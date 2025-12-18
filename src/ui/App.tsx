/**
 * Main App Component
 * 
 * Civ6 District Simulator - React UI with Tailwind CSS
 */

import React, { useState } from 'react';
import { HexMap } from './components/HexMap';
import { TileEditor } from './components/TileEditor';
import { AdjacencyPanel } from './components/AdjacencyPanel';
import { Toolbar } from './components/Toolbar';
import { useMapState } from './hooks/useMapState';
import { TerrainType } from '../core';

export const App: React.FC = () => {
  const [state, actions] = useMapState(12, 10);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSaveMap = () => {
    const json = actions.exportMap();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.map.name.replace(/\s+/g, '_')}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen flex flex-col bg-civ-bg overflow-hidden">
      {/* Toolbar */}
      <Toolbar
        mapName={state.map.name}
        zoom={state.zoom}
        onNewMap={actions.createNewMap}
        onSaveMap={handleSaveMap}
        onLoadMap={actions.loadMap}
        onZoomIn={() => actions.setZoom(state.zoom + 0.2)}
        onZoomOut={() => actions.setZoom(state.zoom - 0.2)}
        onZoomReset={() => actions.setZoom(1)}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map Area */}
        <div className="flex-1 relative">
          <HexMap
            map={state.map}
            selectedCoord={state.selectedCoord}
            selectedCoords={state.selectedCoords}
            cityCenter={state.cityCenter}
            zoom={state.zoom}
            panOffset={state.panOffset}
            onTileSelect={actions.selectTile}
            onAddToSelection={actions.addToSelection}
            onSetSelection={actions.setSelection}
            onZoomChange={actions.setZoom}
            onPanChange={actions.setPanOffset}
          />
        </div>

        {/* Sidebar Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-civ-panel border border-civ-border border-r-0 rounded-l-lg p-2 text-gray-400 hover:text-white hover:bg-civ-hover transition-colors"
          style={{ right: sidebarCollapsed ? 0 : 384 }}
        >
          <svg 
            className={`w-4 h-4 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Sidebar */}
        <aside 
          className={`w-96 bg-civ-surface border-l border-civ-border overflow-y-auto custom-scrollbar transition-all duration-300 ${
            sidebarCollapsed ? 'w-0 border-l-0' : ''
          }`}
        >
          <div className={`p-4 space-y-4 ${sidebarCollapsed ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
            <TileEditor
              tile={state.selectedTile}
              selectedCount={state.selectedCoords.length}
              cityCenter={state.cityCenter}
              onSetTerrainType={(terrain) => {
                if (state.selectedCoords.length > 1) {
                  actions.setSelectedTilesTerrainType(terrain);
                } else if (state.selectedCoord) {
                  actions.setTileTerrain(state.selectedCoord, terrain, state.selectedTile?.modifier);
                }
              }}
              onSetModifier={(modifier) => {
                if (state.selectedCoords.length > 1) {
                  actions.setSelectedTilesModifier(modifier);
                } else if (state.selectedCoord) {
                  actions.setTileTerrain(state.selectedCoord, state.selectedTile?.terrain ?? TerrainType.GRASS, modifier);
                }
              }}
              onSetFeature={(feature) => {
                if (state.selectedCoords.length > 1) {
                  actions.setSelectedTilesFeature(feature);
                } else if (state.selectedCoord) {
                  actions.setTileFeature(state.selectedCoord, feature);
                }
              }}
              onSetResource={(resource) => {
                if (state.selectedCoords.length > 1) {
                  actions.setSelectedTilesResource(resource);
                } else if (state.selectedCoord) {
                  actions.setTileResource(state.selectedCoord, resource);
                }
              }}
              onSetDistrict={(district) => {
                if (state.selectedCoords.length > 1) {
                  actions.setSelectedTilesDistrict(district);
                } else if (state.selectedCoord) {
                  actions.setTileDistrict(state.selectedCoord, district);
                }
              }}
              onSetWonder={(wonder) => {
                if (state.selectedCoord) {
                  actions.setTileWonder(state.selectedCoord, wonder);
                }
              }}
              onToggleRiverEdge={(edge) => {
                if (state.selectedCoords.length > 0) {
                  actions.toggleSelectedTilesRiverEdge(edge);
                }
              }}
              onSetCityCenter={() => {
                if (state.selectedCoord) {
                  actions.setCityCenter(state.selectedCoord);
                }
              }}
            />

            <AdjacencyPanel
              result={state.adjacencyResult}
              cityCenter={state.cityCenter}
              onCalculate={actions.calculateAdjacency}
            />
          </div>
        </aside>
      </div>
    </div>
  );
};
