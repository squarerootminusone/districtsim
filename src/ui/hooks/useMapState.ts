/**
 * React hook for managing game map state
 */

import { useState, useCallback, useMemo } from 'react';
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
  
  // City management
  setCityCenter: (coord: HexCoord | null) => void;
  
  // View controls
  setZoom: (zoom: number) => void;
  setPanOffset: (offset: { x: number; y: number }) => void;
  
  // Adjacency calculation
  calculateAdjacency: () => void;
}

export function useMapState(initialWidth = 12, initialHeight = 10): [MapState, MapActions] {
  const [map, setMap] = useState<GameMap>(() => new GameMap(initialWidth, initialHeight, 'Untitled Map'));
  const [selectedCoord, setSelectedCoord] = useState<HexCoord | null>(null);
  const [selectedCoords, setSelectedCoords] = useState<HexCoord[]>([]);
  const [cityCenter, setCityCenterState] = useState<HexCoord | null>(null);
  const [zoom, setZoomState] = useState(1);
  const [panOffset, setPanOffsetState] = useState({ x: 0, y: 0 });
  const [adjacencyResult, setAdjacencyResult] = useState<CityAdjacencyResult | null>(null);

  const selectedTile = useMemo(() => {
    if (!selectedCoord) return null;
    return map.getTile(selectedCoord) || null;
  }, [map, selectedCoord]);

  const engine = useMemo(() => new AdjacencyEngine(map), [map]);

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
    
    // Force re-render by creating new map reference
    setMap(prevMap => {
      const data = prevMap.toJSON();
      return GameMap.fromJSON(data);
    });
  }, [map]);

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
    
    // Force re-render by creating new map reference
    setMap(prevMap => GameMap.fromJSON(prevMap.toJSON()));
  }, [map, selectedCoords]);

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
    
    // Force re-render
    setMap(prevMap => GameMap.fromJSON(prevMap.toJSON()));
  }, [map, cityCenter]);

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
    setCityCenter,
    setZoom,
    setPanOffset,
    calculateAdjacency,
  };

  return [state, actions];
}

