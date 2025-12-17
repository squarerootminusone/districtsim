/**
 * Tile Editor Panel
 * 
 * Allows editing properties of a selected tile with Civ6 icons.
 */

import React from 'react';
import {
  Tile,
  HexCoord,
  TerrainType,
  TerrainModifier,
  FeatureType,
  ResourceType,
  DistrictType,
  WonderType,
  Yields,
} from '../../core';
import { TERRAIN_DATA, FEATURE_DATA, RESOURCE_DATA, DISTRICT_DATA } from '../../core/gameData';
import { YieldIcon, DistrictIcon, ResourceIcon, FeatureIcon, TerrainIcon } from './Icon';

interface TileEditorProps {
  tile: Tile | null;
  selectedCount?: number;
  cityCenter: HexCoord | null;
  onSetTerrain: (terrain: TerrainType, modifier?: TerrainModifier) => void;
  onSetFeature: (feature: FeatureType) => void;
  onSetResource: (resource: ResourceType) => void;
  onSetDistrict: (district: DistrictType) => void;
  onSetWonder: (wonder: WonderType) => void;
  onToggleRiverEdge: (edge: number) => void;
  onSetCityCenter: () => void;
}

const YieldDisplay: React.FC<{ yields: Yields }> = ({ yields }) => {
  const items: React.ReactNode[] = [];
  
  if (yields.food > 0) {
    items.push(
      <span key="food" className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-xs">
        <YieldIcon type="food" size="sm" /> {yields.food}
      </span>
    );
  }
  if (yields.production > 0) {
    items.push(
      <span key="prod" className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 text-xs">
        <YieldIcon type="production" size="sm" /> {yields.production}
      </span>
    );
  }
  if (yields.gold > 0) {
    items.push(
      <span key="gold" className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 text-xs">
        <YieldIcon type="gold" size="sm" /> {yields.gold}
      </span>
    );
  }
  if (yields.science > 0) {
    items.push(
      <span key="sci" className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-xs">
        <YieldIcon type="science" size="sm" /> {yields.science}
      </span>
    );
  }
  if (yields.culture > 0) {
    items.push(
      <span key="cult" className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 text-xs">
        <YieldIcon type="culture" size="sm" /> {yields.culture}
      </span>
    );
  }
  if (yields.faith > 0) {
    items.push(
      <span key="faith" className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-500/20 text-gray-400 text-xs">
        <YieldIcon type="faith" size="sm" /> {yields.faith}
      </span>
    );
  }
  
  return items.length > 0 ? (
    <div className="flex flex-wrap gap-1">{items}</div>
  ) : (
    <span className="text-gray-500 text-sm">None</span>
  );
};

export const TileEditor: React.FC<TileEditorProps> = ({
  tile,
  selectedCount = 1,
  cityCenter,
  onSetTerrain,
  onSetFeature,
  onSetResource,
  onSetDistrict,
  onSetWonder,
  onToggleRiverEdge,
  onSetCityCenter,
}) => {
  const isMultiSelect = selectedCount > 1;
  if (!tile) {
    return (
      <div className="panel">
        <div className="panel-header">Tile Editor</div>
        <div className="panel-body text-center text-gray-500 py-8">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          Select a tile on the map to edit
        </div>
      </div>
    );
  }

  const isCityCenter = cityCenter && 
    cityCenter.q === tile.coord.q && 
    cityCenter.r === tile.coord.r;

  // Options for selects
  const terrainOptions = Object.values(TerrainType).map(t => ({
    label: TERRAIN_DATA[t]?.name || t,
    value: t,
  }));

  const modifierOptions = Object.values(TerrainModifier).map(m => ({
    label: m.charAt(0).toUpperCase() + m.slice(1),
    value: m,
  }));

  const featureOptions = Object.values(FeatureType).map(f => ({
    label: FEATURE_DATA[f]?.name || f,
    value: f,
    disabled: f !== FeatureType.NONE && !FEATURE_DATA[f]?.validTerrains.includes(tile.terrain),
  }));

  const resourceOptions = Object.values(ResourceType)
    .filter(r => r === ResourceType.NONE || RESOURCE_DATA[r]?.category !== 'none')
    .map(r => ({
      label: RESOURCE_DATA[r]?.name || r,
      value: r,
    }));

  const districtOptions = Object.values(DistrictType).map(d => ({
    label: DISTRICT_DATA[d]?.name || d,
    value: d,
  }));

  const wonderOptions = [
    { label: 'None', value: WonderType.NONE },
    { label: 'Stonehenge', value: WonderType.STONEHENGE },
    { label: 'Pyramids', value: WonderType.PYRAMIDS },
    { label: 'Hanging Gardens', value: WonderType.HANGING_GARDENS },
    { label: 'Oracle', value: WonderType.ORACLE },
    { label: 'Colosseum', value: WonderType.COLOSSEUM },
    { label: 'Petra', value: WonderType.PETRA },
    { label: 'Great Library', value: WonderType.GREAT_LIBRARY },
    { label: 'Alhambra', value: WonderType.ALHAMBRA },
    { label: 'Forbidden City', value: WonderType.FORBIDDEN_CITY },
    { label: 'Taj Mahal', value: WonderType.TAJ_MAHAL },
  ];

  return (
    <div className="panel">
      <div className="panel-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TerrainIcon terrain={tile.terrain} modifier={tile.modifier} size="lg" />
          <div>
            <span>Tile Editor</span>
            {isMultiSelect ? (
              <span className="ml-2 text-sm font-normal text-blue-400">
                ({selectedCount} tiles)
              </span>
            ) : (
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({tile.coord.q}, {tile.coord.r})
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onSetCityCenter}
          disabled={tile.isWater || tile.isMountain}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            isCityCenter 
              ? 'bg-civ-accent text-civ-bg' 
              : 'bg-civ-surface border border-civ-border text-gray-300 hover:bg-civ-hover disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
        >
          <DistrictIcon type="city_center" size="sm" />
          {isCityCenter ? 'City Center' : 'Set City'}
        </button>
      </div>

      <div className="panel-body space-y-4">
        {/* Tile Status Badges */}
        <div className="flex flex-wrap gap-2">
          {tile.isWater && (
            <span className="inline-flex items-center gap-1 badge badge-info">
              💧 Water
            </span>
          )}
          {tile.isHill && (
            <span className="inline-flex items-center gap-1 badge badge-neutral">
              ⛰ Hills
            </span>
          )}
          {tile.isMountain && (
            <span className="inline-flex items-center gap-1 badge badge-neutral">
              🏔️ Mountain
            </span>
          )}
          {tile.hasRiver && (
            <span className="inline-flex items-center gap-1 badge badge-info">
              🌊 River
            </span>
          )}
          {tile.hasDistrict && (
            <span className="inline-flex items-center gap-1 badge badge-success">
              <DistrictIcon type={tile.district} size="sm" /> District
            </span>
          )}
          {tile.hasWonder && (
            <span className="inline-flex items-center gap-1 badge badge-warning">
              ✨ Wonder
            </span>
          )}
          {tile.resource !== ResourceType.NONE && (
            <span className="inline-flex items-center gap-1 badge badge-warning">
              <ResourceIcon type={tile.resource} size="sm" /> Resource
            </span>
          )}
          {tile.feature !== FeatureType.NONE && (
            <span className="inline-flex items-center gap-1 badge badge-success">
              <FeatureIcon type={tile.feature} size="sm" /> Feature
            </span>
          )}
        </div>

        {/* Base Yields */}
        <div className="p-3 bg-civ-surface rounded-lg border border-civ-border/50">
          <div className="text-xs text-gray-400 mb-2">Base Yields</div>
          <YieldDisplay yields={tile.baseYields} />
        </div>

        {/* Terrain & Elevation */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Terrain</label>
            <select
              className="select"
              value={tile.terrain}
              onChange={(e) => onSetTerrain(e.target.value as TerrainType, tile.modifier)}
            >
              {terrainOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Elevation</label>
            <select
              className="select"
              value={tile.modifier}
              onChange={(e) => onSetTerrain(tile.terrain, e.target.value as TerrainModifier)}
              disabled={tile.isWater}
            >
              {modifierOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Feature */}
        <div>
          <label className="label flex items-center gap-2">
            Feature
            {tile.feature !== FeatureType.NONE && <FeatureIcon type={tile.feature} size="sm" />}
          </label>
          <select
            className="select"
            value={tile.feature}
            onChange={(e) => onSetFeature(e.target.value as FeatureType)}
            disabled={tile.isMountain || tile.hasDistrict}
          >
            {featureOptions.map(opt => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label} {opt.disabled ? '(invalid)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Resource */}
        <div>
          <label className="label flex items-center gap-2">
            Resource
            {tile.resource !== ResourceType.NONE && <ResourceIcon type={tile.resource} size="sm" />}
          </label>
          <select
            className="select"
            value={tile.resource}
            onChange={(e) => onSetResource(e.target.value as ResourceType)}
          >
            {resourceOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* District */}
        <div>
          <label className="label flex items-center gap-2">
            District
            {tile.district !== DistrictType.NONE && <DistrictIcon type={tile.district} size="sm" />}
          </label>
          <select
            className="select"
            value={tile.district}
            onChange={(e) => onSetDistrict(e.target.value as DistrictType)}
            disabled={tile.isMountain}
          >
            {districtOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Wonder */}
        <div>
          <label className="label">Wonder</label>
          <select
            className="select"
            value={tile.wonder}
            onChange={(e) => onSetWonder(e.target.value as WonderType)}
            disabled={tile.isMountain || tile.isWater}
          >
            {wonderOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* River Edges */}
        <div>
          <label className="label">River Edges</label>
          <p className="text-xs text-gray-500 mb-2">Toggle river on each hex edge (0-5)</p>
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4, 5].map(edge => (
              <button
                key={edge}
                onClick={() => onToggleRiverEdge(edge)}
                className={`w-8 h-8 rounded font-mono text-sm transition-colors ${
                  tile.riverEdges.has(edge)
                    ? 'bg-blue-500 text-white'
                    : 'bg-civ-surface border border-civ-border text-gray-400 hover:bg-civ-hover'
                }`}
              >
                {edge}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
