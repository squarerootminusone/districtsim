/**
 * 2.5D Hexagonal Map Renderer
 * 
 * This component renders a Civ6-style hex map with:
 * - Isometric 2.5D perspective
 * - Terrain textures and elevation
 * - District and wonder overlays with Civ6 icons
 * - Interactive tile selection
 * - Zoom and pan support
 */

import React, { useRef, useCallback, useState } from 'react';
import {
  GameMap,
  Tile,
  HexUtils,
  HexCoord,
  TerrainType,
  TerrainModifier,
  FeatureType,
  DistrictType,
  ResourceType,
  ResourceCategory,
  WonderType,
} from '../../core';
import { RESOURCE_DATA } from '../../core/gameData';
import { DISTRICT_ICONS, RESOURCE_ICONS, FEATURE_ICONS, TERRAIN_ICONS, WONDER_ICONS } from '../../core/icons';

interface HexMapProps {
  map: GameMap;
  selectedCoord: HexCoord | null;
  selectedCoords: HexCoord[];  // Multi-tile selection
  cityCenter: HexCoord | null;
  zoom: number;
  panOffset: { x: number; y: number };
  onTileSelect: (coord: HexCoord) => void;
  onAddToSelection: (coord: HexCoord) => void;
  onSetSelection: (coords: HexCoord[]) => void;
  onZoomChange: (zoom: number) => void;
  onPanChange: (offset: { x: number; y: number }) => void;
}

// Hex dimensions for rendering
const HEX_SIZE = 40;
const HEX_WIDTH = HEX_SIZE * Math.sqrt(3);
const HEX_HEIGHT = HEX_SIZE * 2;
const VERTICAL_SPACING = HEX_HEIGHT * 0.75;
const ICON_SIZE = 28;

export const HexMap: React.FC<HexMapProps> = ({
  map,
  selectedCoord,
  selectedCoords,
  cityCenter,
  zoom,
  panOffset,
  onTileSelect,
  onAddToSelection,
  onSetSelection,
  onZoomChange,
  onPanChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<{ x: number; y: number } | null>(null);

  // Hex coordinate to screen position conversion (defined first as other callbacks depend on it)
  const hexToScreen = useCallback((coord: HexCoord): { x: number; y: number } => {
    const x = HEX_WIDTH * (coord.q + coord.r / 2);
    const y = VERTICAL_SPACING * coord.r;
    return { x, y };
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    onZoomChange(zoom + delta);
  }, [zoom, onZoomChange]);

  // Convert screen coordinates to SVG coordinates using the inverse CTM
  // This properly handles all transforms (CSS scale, translate, and SVG group transforms)
  const screenToSvg = useCallback((screenX: number, screenY: number): { x: number; y: number } | null => {
    if (!svgRef.current) return null;
    const svg = svgRef.current;
    
    // Get the inner group element that contains the tiles
    const group = svg.querySelector('g');
    if (!group) return null;
    
    // Use SVG's getScreenCTM which accounts for ALL transforms including CSS
    const ctm = group.getScreenCTM();
    if (!ctm) return null;
    
    // Create a point and transform it using the inverse CTM
    const point = svg.createSVGPoint();
    point.x = screenX;
    point.y = screenY;
    const transformedPoint = point.matrixTransform(ctm.inverse());
    
    return { x: transformedPoint.x, y: transformedPoint.y };
  }, []);

  // Find hex tile at SVG coordinates
  const findHexAtPosition = useCallback((svgX: number, svgY: number): HexCoord | null => {
    const tiles = map.getAllTiles();
    for (const tile of tiles) {
      const pos = hexToScreen(tile.coord);
      const dx = svgX - pos.x;
      const dy = svgY - pos.y;
      // Check if point is within hex (approximate with circle for simplicity)
      if (Math.sqrt(dx * dx + dy * dy) < HEX_SIZE * 0.9) {
        return tile.coord;
      }
    }
    return null;
  }, [map, hexToScreen]);

  // Get all hex tiles within a rectangle
  const getHexesInRect = useCallback((x1: number, y1: number, x2: number, y2: number): HexCoord[] => {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    
    const tiles = map.getAllTiles();
    const selected: HexCoord[] = [];
    
    for (const tile of tiles) {
      const pos = hexToScreen(tile.coord);
      if (pos.x >= minX && pos.x <= maxX && pos.y >= minY && pos.y <= maxY) {
        selected.push(tile.coord);
      }
    }
    
    return selected;
  }, [map, hexToScreen]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Shift+left-click or right-click = start selection drag
    if ((e.button === 0 && e.shiftKey) || e.button === 2) {
      const svgPos = screenToSvg(e.clientX, e.clientY);
      if (svgPos) {
        setIsSelecting(true);
        setSelectionStart(svgPos);
        setSelectionEnd(svgPos);
      }
      e.preventDefault();
      return;
    }
    
    // Left-click or middle mouse = pan
    if (e.button === 0 || e.button === 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      e.preventDefault();
      return;
    }
  }, [panOffset, screenToSvg]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      onPanChange({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
      return;
    }
    
    if (isSelecting) {
      const svgPos = screenToSvg(e.clientX, e.clientY);
      if (svgPos) {
        setSelectionEnd(svgPos);
      }
    }
  }, [isDragging, dragStart, onPanChange, isSelecting, screenToSvg]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      // Check if it was a drag or just a click (for single tile selection)
      const dx = Math.abs(e.clientX - (dragStart.x + panOffset.x));
      const dy = Math.abs(e.clientY - (dragStart.y + panOffset.y));
      
      setIsDragging(false);
      
      // If minimal movement, treat as a click for tile selection
      if (dx < 5 && dy < 5 && e.button === 0) {
        const svgPos = screenToSvg(e.clientX, e.clientY);
        if (svgPos) {
          const hex = findHexAtPosition(svgPos.x, svgPos.y);
          if (hex) {
            if (e.ctrlKey || e.metaKey) {
              onAddToSelection(hex);
            } else {
              onTileSelect(hex);
            }
          }
        }
      }
      return;
    }
    
    if (isSelecting && selectionStart && selectionEnd) {
      // Check if it was a drag or just a click
      const dx = Math.abs(selectionEnd.x - selectionStart.x);
      const dy = Math.abs(selectionEnd.y - selectionStart.y);
      
      if (dx > 5 || dy > 5) {
        // It was a drag, select all tiles in rectangle
        const hexes = getHexesInRect(selectionStart.x, selectionStart.y, selectionEnd.x, selectionEnd.y);
        if (hexes.length > 0) {
          onSetSelection(hexes);
        }
      }
      
      setIsSelecting(false);
      setSelectionStart(null);
      setSelectionEnd(null);
    }
  }, [isDragging, isSelecting, selectionStart, selectionEnd, dragStart, panOffset, screenToSvg, findHexAtPosition, getHexesInRect, onTileSelect, onAddToSelection, onSetSelection]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  const getHexPoints = useCallback((centerX: number, centerY: number, size: number = HEX_SIZE): string => {
    const points: string[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 6) + (Math.PI / 3) * i;
      const x = centerX + size * Math.cos(angle);
      const y = centerY + size * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    return points.join(' ');
  }, []);

  const getTerrainColor = useCallback((tile: Tile): string => {
    const colors: Record<TerrainType, string> = {
      [TerrainType.GRASS]: '#4a7c23',
      [TerrainType.PLAINS]: '#a89052',
      [TerrainType.DESERT]: '#d4b896',
      [TerrainType.TUNDRA]: '#8fa58f',
      [TerrainType.SNOW]: '#e8eef4',
      [TerrainType.COAST]: '#4a90a4',
      [TerrainType.OCEAN]: '#2a5f7c',
    };
    return colors[tile.terrain] || '#888888';
  }, []);

  const getDistrictIconUrl = useCallback((district: DistrictType): string | null => {
    const iconKey = district as keyof typeof DISTRICT_ICONS;
    return DISTRICT_ICONS[iconKey] || DISTRICT_ICONS.district || null;
  }, []);

  const getResourceIconUrl = useCallback((resource: ResourceType): string | null => {
    if (resource === ResourceType.NONE) return null;
    const iconKey = resource as keyof typeof RESOURCE_ICONS;
    return RESOURCE_ICONS[iconKey] || null;
  }, []);

  const getFeatureIconUrl = useCallback((feature: FeatureType): string | null => {
    if (feature === FeatureType.NONE) return null;
    const iconKey = feature as keyof typeof FEATURE_ICONS;
    return FEATURE_ICONS[iconKey] || null;
  }, []);

  const getWonderIconUrl = useCallback((wonder: WonderType): string | null => {
    if (wonder === WonderType.NONE) return null;
    const iconKey = wonder as keyof typeof WONDER_ICONS;
    return WONDER_ICONS[iconKey] || WONDER_ICONS.wonder || null;
  }, []);

  const getTerrainIconUrl = useCallback((tile: Tile): string | null => {
    const terrain = tile.terrain;
    const modifier = tile.modifier;
    
    // Build icon key based on terrain and modifier
    let iconKey: string;
    
    if (modifier === TerrainModifier.MOUNTAIN) {
      iconKey = `${terrain}_mountain`;
    } else if (modifier === TerrainModifier.HILLS) {
      iconKey = `${terrain}_hills`;
    } else {
      iconKey = terrain;
    }
    
    return TERRAIN_ICONS[iconKey as keyof typeof TERRAIN_ICONS] || TERRAIN_ICONS[terrain as keyof typeof TERRAIN_ICONS] || null;
  }, []);

  const renderTile = useCallback((tile: Tile) => {
    const { coord } = tile;
    const screenPos = hexToScreen(coord);
    const key = HexUtils.coordToKey(coord);
    
    const centerX = screenPos.x;
    const centerY = screenPos.y;

    const isSelected = selectedCoord && 
      selectedCoord.q === coord.q && 
      selectedCoord.r === coord.r;

    const isInMultiSelection = selectedCoords.some(c => c.q === coord.q && c.r === coord.r);

    const isCityCenter = cityCenter &&
      cityCenter.q === coord.q &&
      cityCenter.r === coord.r;

    const isInCityRange = cityCenter && 
      HexUtils.distance(cityCenter, coord) <= 3;

    const terrainColor = getTerrainColor(tile);
    const terrainIconUrl = getTerrainIconUrl(tile);
    const districtIconUrl = tile.hasDistrict ? getDistrictIconUrl(tile.district) : null;
    const resourceIconUrl = !tile.hasDistrict ? getResourceIconUrl(tile.resource) : null;
    const featureIconUrl = tile.feature !== FeatureType.NONE ? getFeatureIconUrl(tile.feature) : null;
    const wonderIconUrl = tile.hasWonder ? getWonderIconUrl(tile.wonder) : null;

    return (
      <g
        key={key}
        transform={`translate(${centerX}, ${centerY})`}
        style={{ cursor: 'pointer' }}
      >
        {/* Define clip path for this hex */}
        <defs>
          <clipPath id={`hex-clip-${key}`}>
            <polygon points={getHexPoints(0, 0, HEX_SIZE)} />
          </clipPath>
        </defs>

        {/* Base terrain color (fallback) */}
        <polygon
          points={getHexPoints(0, 0, HEX_SIZE)}
          fill={terrainColor}
          stroke="#222"
          strokeWidth={0.5}
        />

        {/* Terrain icon (scaled 120%) */}
        {terrainIconUrl && (
          <image
            xlinkHref={terrainIconUrl}
            href={terrainIconUrl}
            x={-HEX_SIZE * 1.4}
            y={-HEX_SIZE * 1.4}
            width={HEX_SIZE * 2.8}
            height={HEX_SIZE * 2.8}
            clipPath={`url(#hex-clip-${key})`}
            preserveAspectRatio="xMidYMid slice"
            style={{ pointerEvents: 'none' }}
          />
        )}

        {/* River edges */}
        {tile.hasRiver && Array.from(tile.riverEdges).map(edge => {
          const angle = (Math.PI / 6) + (Math.PI / 3) * edge;
          const nextAngle = (Math.PI / 6) + (Math.PI / 3) * ((edge + 1) % 6);
          const x1 = HEX_SIZE * Math.cos(angle);
          const y1 = HEX_SIZE * Math.sin(angle);
          const x2 = HEX_SIZE * Math.cos(nextAngle);
          const y2 = HEX_SIZE * Math.sin(nextAngle);
          return (
            <line
              key={`river-${edge}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#4fc3f7"
              strokeWidth={4}
              strokeLinecap="round"
            />
          );
        })}

        {/* City range indicator */}
        {isInCityRange && !isCityCenter && (
          <polygon
            points={getHexPoints(0, 0, HEX_SIZE - 2)}
            fill="none"
            stroke="rgba(201, 162, 39, 0.4)"
            strokeWidth={2}
            strokeDasharray="4,4"
          />
        )}

        {/* Feature icon overlay (upscaled like terrain) */}
        {featureIconUrl && (
          <image
            xlinkHref={featureIconUrl}
            href={featureIconUrl}
            x={-HEX_SIZE * 1.2}
            y={-HEX_SIZE * 1.2}
            width={HEX_SIZE * 2.4}
            height={HEX_SIZE * 2.4}
            clipPath={`url(#hex-clip-${key})`}
            preserveAspectRatio="xMidYMid slice"
            style={{ pointerEvents: 'none' }}
          />
        )}

        {/* Resource icon (when no district) */}
        {resourceIconUrl && !tile.hasDistrict && (
          <image
            xlinkHref={resourceIconUrl}
            href={resourceIconUrl}
            x={-ICON_SIZE / 2}
            y={HEX_SIZE * 0.05}
            width={ICON_SIZE}
            height={ICON_SIZE}
            style={{ pointerEvents: 'none' }}
          />
        )}

        {/* District icon */}
        {districtIconUrl && (
          <image
            xlinkHref={districtIconUrl}
            href={districtIconUrl}
            x={-ICON_SIZE / 2}
            y={-ICON_SIZE / 2}
            width={ICON_SIZE}
            height={ICON_SIZE}
            style={{ pointerEvents: 'none' }}
          />
        )}

        {/* Wonder icon */}
        {wonderIconUrl && (
          <image
            xlinkHref={wonderIconUrl}
            href={wonderIconUrl}
            x={-ICON_SIZE * 0.8}
            y={-ICON_SIZE * 0.8}
            width={ICON_SIZE * 1.6}
            height={ICON_SIZE * 1.6}
            style={{ pointerEvents: 'none' }}
          />
        )}

        {/* Multi-selection highlight */}
        {isInMultiSelection && !isSelected && (
          <polygon
            points={getHexPoints(0, 0, HEX_SIZE + 2)}
            fill="rgba(100, 180, 255, 0.2)"
            stroke="#64b4ff"
            strokeWidth={2}
          />
        )}

        {/* Primary selection highlight */}
        {isSelected && (
          <polygon
            points={getHexPoints(0, 0, HEX_SIZE + 3)}
            fill="rgba(201, 162, 39, 0.2)"
            stroke="#c9a227"
            strokeWidth={3}
          />
        )}
      </g>
    );
  }, [
    hexToScreen,
    getHexPoints,
    getTerrainColor,
    getTerrainIconUrl,
    getDistrictIconUrl,
    getResourceIconUrl,
    getFeatureIconUrl,
    getWonderIconUrl,
    selectedCoord,
    selectedCoords,
    cityCenter,
  ]);

  // Calculate SVG viewBox dimensions
  const tiles = map.getAllTiles();
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  
  for (const tile of tiles) {
    const pos = hexToScreen(tile.coord);
    minX = Math.min(minX, pos.x - HEX_WIDTH);
    maxX = Math.max(maxX, pos.x + HEX_WIDTH);
    minY = Math.min(minY, pos.y - HEX_HEIGHT);
    maxY = Math.max(maxY, pos.y + HEX_HEIGHT);
  }

  // Sort tiles by Y coordinate for proper layering
  const sortedTiles = [...tiles].sort((a, b) => {
    const posA = hexToScreen(a.coord);
    const posB = hexToScreen(b.coord);
    return posA.y - posB.y;
  });

  // Calculate selection rectangle in screen coordinates
  const selectionRect = isSelecting && selectionStart && selectionEnd ? {
    x: Math.min(selectionStart.x, selectionEnd.x),
    y: Math.min(selectionStart.y, selectionEnd.y),
    width: Math.abs(selectionEnd.x - selectionStart.x),
    height: Math.abs(selectionEnd.y - selectionStart.y),
  } : null;

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden relative"
      style={{
        background: 'radial-gradient(ellipse at center, #1a2a3a 0%, #0a1420 70%, #050a10 100%)',
        cursor: isDragging ? 'grabbing' : isSelecting ? 'crosshair' : 'grab',
      }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onContextMenu={handleContextMenu}
    >
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        style={{
          transform: `scale(${zoom}) translate(${panOffset.x / zoom}px, ${panOffset.y / zoom}px)`,
          transformOrigin: 'center center',
        }}
      >
        <g transform={`translate(${-minX + HEX_WIDTH}, ${-minY + HEX_HEIGHT})`}>
          {sortedTiles.map(renderTile)}
          
          {/* Selection rectangle */}
          {selectionRect && selectionRect.width > 5 && selectionRect.height > 5 && (
            <rect
              x={selectionRect.x}
              y={selectionRect.y}
              width={selectionRect.width}
              height={selectionRect.height}
              fill="rgba(100, 180, 255, 0.15)"
              stroke="#64b4ff"
              strokeWidth={2}
              strokeDasharray="8,4"
            />
          )}
        </g>
      </svg>
      
      {/* Selection count indicator */}
      {selectedCoords.length > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-blue-500/90 backdrop-blur-sm rounded-lg text-white text-sm font-medium border border-blue-400/50 shadow-lg">
          {selectedCoords.length} tiles selected
        </div>
      )}
      
      {/* Zoom indicator */}
      <div className="absolute bottom-4 right-4 px-3 py-2 bg-black/70 backdrop-blur-sm rounded-lg text-white text-sm font-mono border border-white/10">
        Zoom: {Math.round(zoom * 100)}%
      </div>
      
      {/* Instructions */}
      <div className="absolute bottom-4 left-4 px-3 py-2 bg-black/70 backdrop-blur-sm rounded-lg text-white/80 text-xs border border-white/10">
        🖱️ Drag to pan • Click to select • Right-drag to select multiple • Ctrl+Z undo • Ctrl+X redo
      </div>
    </div>
  );
};
