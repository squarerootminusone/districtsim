/**
 * React hook for managing game map state
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  GameMap,
  AdjacencyEngine,
  Tile,
  HexCoord,
  TerrainType,
  TerrainModifier,
  FeatureType,
  ResourceType,
  DistrictType,
  WonderType,
  CityAdjacencyResult,
} from '../../core';

const MAX_HISTORY_SIZE = 50;
const LOCAL_STORAGE_KEY = 'districtsim_map';
const LOCAL_STORAGE_CAMERA_KEY = 'districtsim_camera';

interface CameraState {
  zoom: number;
  panOffset: { x: number; y: number };
}

export interface MapState {
  map: GameMap;
  selectedTile: Tile | null;
  selectedCoord: HexCoord | null;
  selectedCoords: HexCoord[];  // Multi-tile selection
  cityCenter: HexCoord | null;
  zoom: number;
  panOffset: { x: number; y: number };
  adjacencyResult: CityAdjacencyResult | null;
}

export interface MapActions {
  // Map management
  createNewMap: (width: number, height: number, name?: string) => void;
  loadMap: (jsonString: string) => void;
  exportMap: () => string;
  
  // Undo/Redo
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  
  // Tile selection
  selectTile: (coord: HexCoord | null) => void;
  addToSelection: (coord: HexCoord) => void;
  clearSelection: () => void;
  setSelection: (coords: HexCoord[]) => void;
  
  // Tile editing (applies to all selected tiles)
  setTileTerrain: (coord: HexCoord, terrain: TerrainType, modifier?: TerrainModifier) => void;
  setTileFeature: (coord: HexCoord, feature: FeatureType) => void;
  setTileResource: (coord: HexCoord, resource: ResourceType) => void;
  setTileDistrict: (coord: HexCoord, district: DistrictType) => void;
  setTileWonder: (coord: HexCoord, wonder: WonderType) => void;
  toggleRiverEdge: (coord: HexCoord, edge: number) => void;
  
  // Bulk editing for selected tiles
  setSelectedTilesTerrain: (terrain: TerrainType, modifier?: TerrainModifier) => void;
  setSelectedTilesFeature: (feature: FeatureType) => void;
  setSelectedTilesResource: (resource: ResourceType) => void;
  setSelectedTilesDistrict: (district: DistrictType) => void;
  toggleSelectedTilesRiverEdge: (edge: number) => void;
  
  // City management
  setCityCenter: (coord: HexCoord | null) => void;
  
  // View controls
  setZoom: (zoom: number) => void;
  setPanOffset: (offset: { x: number; y: number }) => void;
  
  // Adjacency calculation
  calculateAdjacency: () => void;
}

// Load camera state from localStorage
function loadCameraState(): CameraState {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_CAMERA_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as CameraState;
      return {
        zoom: parsed.zoom ?? 1,
        panOffset: parsed.panOffset ?? { x: 0, y: 0 },
      };
    }
  } catch (error) {
    console.warn('Failed to load camera state from localStorage:', error);
  }
  return { zoom: 1, panOffset: { x: 0, y: 0 } };
}

// Load map from localStorage or create new
function loadInitialMap(initialWidth: number, initialHeight: number): { map: GameMap; cityCenter: HexCoord | null } {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const loadedMap = GameMap.importFromString(saved);
      const cityCenterTile = loadedMap.findCityCenter();
      return { map: loadedMap, cityCenter: cityCenterTile?.coord || null };
    }
  } catch (error) {
    console.warn('Failed to load map from localStorage:', error);
  }
  return { map: new GameMap(initialWidth, initialHeight, 'Untitled Map'), cityCenter: null };
}

export function useMapState(initialWidth = 12, initialHeight = 10): [MapState, MapActions] {
  const [initialState] = useState(() => loadInitialMap(initialWidth, initialHeight));
  const [initialCamera] = useState(() => loadCameraState());
  const [map, setMap] = useState<GameMap>(initialState.map);
  const [selectedCoord, setSelectedCoord] = useState<HexCoord | null>(null);
  const [selectedCoords, setSelectedCoords] = useState<HexCoord[]>([]);
  const [cityCenter, setCityCenterState] = useState<HexCoord | null>(initialState.cityCenter);
  const [zoom, setZoomState] = useState(initialCamera.zoom);
  const [panOffset, setPanOffsetState] = useState(initialCamera.panOffset);
  const [adjacencyResult, setAdjacencyResult] = useState<CityAdjacencyResult | null>(null);
  
  // Undo/Redo history
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const isUndoRedoAction = useRef(false);
  
  // Save map to localStorage whenever it changes
  useEffect(() => {
    try {
      const mapData = map.exportToString();
      localStorage.setItem(LOCAL_STORAGE_KEY, mapData);
    } catch (error) {
      console.warn('Failed to save map to localStorage:', error);
    }
  }, [map]);
  
  // Save camera state to localStorage whenever it changes
  useEffect(() => {
    try {
      const cameraData: CameraState = { zoom, panOffset };
      localStorage.setItem(LOCAL_STORAGE_CAMERA_KEY, JSON.stringify(cameraData));
    } catch (error) {
      console.warn('Failed to save camera state to localStorage:', error);
    }
  }, [zoom, panOffset]);

  const selectedTile = useMemo(() => {
    if (!selectedCoord) return null;
    return map.getTile(selectedCoord) || null;
  }, [map, selectedCoord]);

  const engine = useMemo(() => new AdjacencyEngine(map), [map]);

  // Save state to undo stack before modifications
  const saveToHistory = useCallback(() => {
    if (isUndoRedoAction.current) return;
    const snapshot = map.exportToString();
    setUndoStack(prev => {
      const newStack = [...prev, snapshot];
      if (newStack.length > MAX_HISTORY_SIZE) {
        return newStack.slice(-MAX_HISTORY_SIZE);
      }
      return newStack;
    });
    setRedoStack([]); // Clear redo stack on new action
  }, [map]);

  // Wrapper for setMap that saves history
  const setMapWithHistory = useCallback((updater: (prev: GameMap) => GameMap) => {
    if (!isUndoRedoAction.current) {
      saveToHistory();
    }
    setMap(updater);
  }, [saveToHistory]);

  // Undo action
  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    
    isUndoRedoAction.current = true;
    
    // Save current state to redo stack
    const currentSnapshot = map.exportToString();
    setRedoStack(prev => [...prev, currentSnapshot]);
    
    // Pop from undo stack and restore
    const prevSnapshot = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    
    try {
      const restoredMap = GameMap.importFromString(prevSnapshot);
      setMap(restoredMap);
      
      // Find and restore city center
      const cityCenterTile = restoredMap.findCityCenter();
      setCityCenterState(cityCenterTile?.coord || null);
    } catch (error) {
      console.error('Failed to undo:', error);
    }
    
    isUndoRedoAction.current = false;
  }, [undoStack, map]);

  // Redo action
  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    
    isUndoRedoAction.current = true;
    
    // Save current state to undo stack
    const currentSnapshot = map.exportToString();
    setUndoStack(prev => [...prev, currentSnapshot]);
    
    // Pop from redo stack and restore
    const nextSnapshot = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    
    try {
      const restoredMap = GameMap.importFromString(nextSnapshot);
      setMap(restoredMap);
      
      // Find and restore city center
      const cityCenterTile = restoredMap.findCityCenter();
      setCityCenterState(cityCenterTile?.coord || null);
    } catch (error) {
      console.error('Failed to redo:', error);
    }
    
    isUndoRedoAction.current = false;
  }, [redoStack, map]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'x') {
        e.preventDefault();
        redo();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  // Map management
  const createNewMap = useCallback((width: number, height: number, name = 'Untitled Map') => {
    setMap(new GameMap(width, height, name));
    setSelectedCoord(null);
    setCityCenterState(null);
    setAdjacencyResult(null);
    setPanOffsetState({ x: 0, y: 0 });
  }, []);

  const loadMap = useCallback((jsonString: string) => {
    try {
      const newMap = GameMap.importFromString(jsonString);
      setMap(newMap);
      setSelectedCoord(null);
      
      // Find city center if exists
      const cityCenterTile = newMap.findCityCenter();
      setCityCenterState(cityCenterTile?.coord || null);
      setAdjacencyResult(null);
    } catch (error) {
      console.error('Failed to load map:', error);
      throw error;
    }
  }, []);

  const exportMap = useCallback(() => {
    return map.exportToString();
  }, [map]);

  // Tile selection
  const selectTile = useCallback((coord: HexCoord | null) => {
    setSelectedCoord(coord);
    // When single-selecting, also set as the only selected coord
    setSelectedCoords(coord ? [coord] : []);
  }, []);

  const addToSelection = useCallback((coord: HexCoord) => {
    setSelectedCoords(prev => {
      // Check if already selected
      const exists = prev.some(c => c.q === coord.q && c.r === coord.r);
      if (exists) return prev;
      return [...prev, coord];
    });
    // Set as current selected coord for the editor
    setSelectedCoord(coord);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedCoords([]);
    setSelectedCoord(null);
  }, []);

  const setSelection = useCallback((coords: HexCoord[]) => {
    setSelectedCoords(coords);
    // Set the last coord as the "active" one for the editor
    setSelectedCoord(coords.length > 0 ? coords[coords.length - 1] : null);
  }, []);

  // Tile editing - these create a new map reference to trigger re-render
  const updateTile = useCallback((coord: HexCoord, updater: (tile: Tile) => void) => {
    const tile = map.getTile(coord);
    if (!tile) return;
    
    updater(tile);
    
    // Force re-render by creating new map reference (with history)
    setMapWithHistory(prevMap => {
      const data = prevMap.toJSON();
      return GameMap.fromJSON(data);
    });
  }, [map, setMapWithHistory]);

  const setTileTerrain = useCallback((coord: HexCoord, terrain: TerrainType, modifier = TerrainModifier.FLAT) => {
    updateTile(coord, tile => tile.setTerrain(terrain, modifier));
  }, [updateTile]);

  const setTileFeature = useCallback((coord: HexCoord, feature: FeatureType) => {
    updateTile(coord, tile => tile.setFeature(feature));
  }, [updateTile]);

  const setTileResource = useCallback((coord: HexCoord, resource: ResourceType) => {
    updateTile(coord, tile => tile.setResource(resource));
  }, [updateTile]);

  const setTileDistrict = useCallback((coord: HexCoord, district: DistrictType) => {
    updateTile(coord, tile => tile.setDistrict(district));
  }, [updateTile]);

  const setTileWonder = useCallback((coord: HexCoord, wonder: WonderType) => {
    updateTile(coord, tile => tile.setWonder(wonder));
  }, [updateTile]);

  const toggleRiverEdge = useCallback((coord: HexCoord, edge: number) => {
    updateTile(coord, tile => {
      if (tile.riverEdges.has(edge)) {
        tile.removeRiverEdge(edge);
      } else {
        tile.addRiverEdge(edge);
      }
    });
  }, [updateTile]);

  // Bulk editing for selected tiles
  const updateSelectedTiles = useCallback((updater: (tile: Tile) => void) => {
    if (selectedCoords.length === 0) return;
    
    for (const coord of selectedCoords) {
      const tile = map.getTile(coord);
      if (tile) {
        updater(tile);
      }
    }
    
    // Force re-render by creating new map reference (with history)
    setMapWithHistory(prevMap => GameMap.fromJSON(prevMap.toJSON()));
  }, [map, selectedCoords, setMapWithHistory]);

  const setSelectedTilesTerrain = useCallback((terrain: TerrainType, modifier = TerrainModifier.FLAT) => {
    updateSelectedTiles(tile => tile.setTerrain(terrain, modifier));
  }, [updateSelectedTiles]);

  const setSelectedTilesFeature = useCallback((feature: FeatureType) => {
    updateSelectedTiles(tile => tile.setFeature(feature));
  }, [updateSelectedTiles]);

  const setSelectedTilesResource = useCallback((resource: ResourceType) => {
    updateSelectedTiles(tile => tile.setResource(resource));
  }, [updateSelectedTiles]);

  const setSelectedTilesDistrict = useCallback((district: DistrictType) => {
    updateSelectedTiles(tile => tile.setDistrict(district));
  }, [updateSelectedTiles]);

  const toggleSelectedTilesRiverEdge = useCallback((edge: number) => {
    updateSelectedTiles(tile => {
      if (tile.riverEdges.has(edge)) {
        tile.removeRiverEdge(edge);
      } else {
        tile.addRiverEdge(edge);
      }
    });
  }, [updateSelectedTiles]);

  // City management
  const setCityCenter = useCallback((coord: HexCoord | null) => {
    // Clear old city center
    if (cityCenter) {
      const oldTile = map.getTile(cityCenter);
      if (oldTile) {
        oldTile.setOwner(null, false);
        oldTile.setDistrict(DistrictType.NONE);
      }
    }

    // Set new city center
    if (coord) {
      const newTile = map.getTile(coord);
      if (newTile) {
        newTile.setOwner('city1', true);
      }
    }

    setCityCenterState(coord);
    setAdjacencyResult(null);
    
    // Force re-render (with history)
    setMapWithHistory(prevMap => GameMap.fromJSON(prevMap.toJSON()));
  }, [map, cityCenter, setMapWithHistory]);

  // View controls
  const setZoom = useCallback((newZoom: number) => {
    setZoomState(Math.max(0.25, Math.min(3, newZoom)));
  }, []);

  const setPanOffset = useCallback((offset: { x: number; y: number }) => {
    setPanOffsetState(offset);
  }, []);

  // Adjacency calculation
  const calculateAdjacency = useCallback(() => {
    if (!cityCenter) {
      setAdjacencyResult(null);
      return;
    }
    
    const result = engine.calculateCityAdjacency(cityCenter);
    setAdjacencyResult(result);
  }, [engine, cityCenter]);

  const state: MapState = {
    map,
    selectedTile,
    selectedCoord,
    selectedCoords,
    cityCenter,
    zoom,
    panOffset,
    adjacencyResult,
  };

  const actions: MapActions = {
    createNewMap,
    loadMap,
    exportMap,
    undo,
    redo,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
    selectTile,
    addToSelection,
    clearSelection,
    setSelection,
    setTileTerrain,
    setTileFeature,
    setTileResource,
    setTileDistrict,
    setTileWonder,
    toggleRiverEdge,
    setSelectedTilesTerrain,
    setSelectedTilesFeature,
    setSelectedTilesResource,
    setSelectedTilesDistrict,
    toggleSelectedTilesRiverEdge,
    setCityCenter,
    setZoom,
    setPanOffset,
    calculateAdjacency,
  };

  return [state, actions];
}

