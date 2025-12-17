/**
 * Map Toolbar Component
 * 
 * Provides map management controls: new, save, load, zoom.
 */

import React, { useRef, useState } from 'react';
import { DISTRICT_ICONS } from '../../core/icons';

interface ToolbarProps {
  mapName: string;
  zoom: number;
  onNewMap: (width: number, height: number, name: string) => void;
  onSaveMap: () => void;
  onLoadMap: (jsonString: string) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  mapName,
  zoom,
  onNewMap,
  onSaveMap,
  onLoadMap,
  onZoomIn,
  onZoomOut,
  onZoomReset,
}) => {
  const [showNewMapModal, setShowNewMapModal] = useState(false);
  const [newMapWidth, setNewMapWidth] = useState('12');
  const [newMapHeight, setNewMapHeight] = useState('10');
  const [newMapName, setNewMapName] = useState('My Map');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNewMap = () => {
    const width = parseInt(newMapWidth) || 12;
    const height = parseInt(newMapHeight) || 10;
    onNewMap(width, height, newMapName);
    setShowNewMapModal(false);
  };

  const handleLoadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        onLoadMap(content);
      } catch (error) {
        alert('Failed to load map file. Please check the file format.');
      }
    };
    reader.readAsText(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <header className="flex items-center justify-between px-5 py-3 bg-gradient-to-b from-civ-panel to-civ-surface border-b border-civ-border">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <img 
            src={DISTRICT_ICONS.city_center} 
            alt="City Center" 
            className="w-10 h-10"
            style={{ imageRendering: 'pixelated' }}
          />
          <div>
            <h1 className="text-white font-display font-semibold text-lg tracking-wide">
              Civ6 District Simulator
            </h1>
            <p className="text-gray-500 text-sm">{mapName}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          {/* Map Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowNewMapModal(true)}
              className="btn-icon"
              title="New Map"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-icon"
              title="Load Map"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </button>
            <button
              onClick={onSaveMap}
              className="btn-icon"
              title="Save Map"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-civ-border" />

          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <button onClick={onZoomOut} className="btn-icon" title="Zoom Out">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
              </svg>
            </button>
            <span className="px-2 py-1 bg-civ-surface rounded text-sm font-mono text-civ-accent min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button onClick={onZoomIn} className="btn-icon" title="Zoom In">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
              </svg>
            </button>
            <button onClick={onZoomReset} className="btn-icon" title="Reset Zoom">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleLoadFile}
        />
      </header>

      {/* New Map Modal */}
      {showNewMapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowNewMapModal(false)}
          />
          <div className="relative panel w-full max-w-md animate-slide-up">
            <div className="panel-header flex items-center justify-between">
              <h2 className="text-lg">Create New Map</h2>
              <button 
                onClick={() => setShowNewMapModal(false)}
                className="btn-icon"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="panel-body space-y-4">
              <div>
                <label className="label">Map Name</label>
                <input
                  type="text"
                  className="input"
                  value={newMapName}
                  onChange={(e) => setNewMapName(e.target.value)}
                  placeholder="Enter map name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Width</label>
                  <input
                    type="number"
                    className="input"
                    value={newMapWidth}
                    onChange={(e) => setNewMapWidth(e.target.value)}
                    min="4"
                    max="30"
                  />
                </div>
                <div>
                  <label className="label">Height</label>
                  <input
                    type="number"
                    className="input"
                    value={newMapHeight}
                    onChange={(e) => setNewMapHeight(e.target.value)}
                    min="4"
                    max="30"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowNewMapModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNewMap}
                  className="btn-primary"
                >
                  Create Map
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
