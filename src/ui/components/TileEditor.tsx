/**
 * Tile Editor Panel
 * 
 * Allows editing properties of a selected tile with Civ6 icons.
 */

import React, { useState } from 'react';
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
  const [selectedEra, setSelectedEra] = useState<string>('ancient');
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

  // Wonders organized by era
  const wondersByEra = {
    ancient: [
      { label: 'Stonehenge', value: WonderType.STONEHENGE },
      { label: 'Pyramids', value: WonderType.PYRAMIDS },
      { label: 'Hanging Gardens', value: WonderType.HANGING_GARDENS },
      { label: 'Oracle', value: WonderType.ORACLE },
      { label: 'Great Bath', value: WonderType.GREAT_BATH },
      { label: 'Temple of Artemis', value: WonderType.TEMPLE_OF_ARTEMIS },
      { label: 'Etemenanki', value: WonderType.ETEMENANKI },
    ],
    classical: [
      { label: 'Colosseum', value: WonderType.COLOSSEUM },
      { label: 'Colossus', value: WonderType.COLOSSUS },
      { label: 'Great Library', value: WonderType.GREAT_LIBRARY },
      { label: 'Great Lighthouse', value: WonderType.GREAT_LIGHTHOUSE },
      { label: 'Jebel Barkal', value: WonderType.JEBEL_BARKAL },
      { label: 'Mahabodhi Temple', value: WonderType.MAHABODHI_TEMPLE },
      { label: 'Mausoleum at Halicarnassus', value: WonderType.MAUSOLEUM_AT_HALICARNASSUS },
      { label: 'Petra', value: WonderType.PETRA },
      { label: 'Terracotta Army', value: WonderType.TERRACOTTA_ARMY },
      { label: 'Apadana', value: WonderType.APADANA },
      { label: 'Statue of Zeus', value: WonderType.STATUE_OF_ZEUS },
    ],
    medieval: [
      { label: 'Alhambra', value: WonderType.ALHAMBRA },
      { label: 'Angkor Wat', value: WonderType.ANGKOR_WAT },
      { label: 'Chichen Itza', value: WonderType.CHICHEN_ITZA },
      { label: 'Hagia Sophia', value: WonderType.HAGIA_SOPHIA },
      { label: 'Kilwa Kisiwani', value: WonderType.KILWA_KISIWANI },
      { label: 'Kotoku-in', value: WonderType.KOTOKU_IN },
      { label: 'Meenakshi Temple', value: WonderType.MEENAKSHI_TEMPLE },
      { label: 'Mont St. Michel', value: WonderType.MONT_ST_MICHEL },
      { label: 'Universidad de Salamanca', value: WonderType.UNIVERSIDAD_DE_SALAMANCA },
    ],
    renaissance: [
      { label: 'Forbidden City', value: WonderType.FORBIDDEN_CITY },
      { label: 'Great Zimbabwe', value: WonderType.GREAT_ZIMBABWE },
      { label: 'Huey Teocalli', value: WonderType.HUEY_TEOCALLI },
      { label: 'Potala Palace', value: WonderType.POTALA_PALACE },
      { label: "St. Basil's Cathedral", value: WonderType.ST_BASILS_CATHEDRAL },
      { label: 'Taj Mahal', value: WonderType.TAJ_MAHAL },
      { label: 'Torre de Belém', value: WonderType.TORRE_DE_BELEM },
      { label: 'Venetian Arsenal', value: WonderType.VENETIAN_ARSENAL },
    ],
    industrial: [
      { label: 'Big Ben', value: WonderType.BIG_BEN },
      { label: 'Bolshoi Theatre', value: WonderType.BOLSHOI_THEATRE },
      { label: 'Hermitage', value: WonderType.HERMITAGE },
      { label: 'Oxford University', value: WonderType.OXFORD_UNIVERSITY },
      { label: 'Ruhr Valley', value: WonderType.RUHR_VALLEY },
      { label: 'Statue of Liberty', value: WonderType.STATUE_OF_LIBERTY },
    ],
    modern: [
      { label: 'Broadway', value: WonderType.BROADWAY },
      { label: 'Cristo Redentor', value: WonderType.CRISTO_REDENTOR },
      { label: 'Eiffel Tower', value: WonderType.EIFFEL_TOWER },
      { label: 'Golden Gate Bridge', value: WonderType.GOLDEN_GATE_BRIDGE },
      { label: 'Panama Canal', value: WonderType.PANAMA_CANAL },
    ],
    atomic: [
      { label: 'Biosphere', value: WonderType.BIOSPHERE },
      { label: 'Estádio do Maracanã', value: WonderType.ESTÁDIO_DO_MARACANÃ },
      { label: 'Sydney Opera House', value: WonderType.SYDNEY_OPERA_HOUSE },
    ],
    information: [
      { label: 'Amundsen-Scott Research Station', value: WonderType.AMUNDSEN_SCOTT_RESEARCH_STATION },
    ],
  };

  const eraLabels: Record<string, string> = {
    ancient: 'Ancient',
    classical: 'Classical',
    medieval: 'Medieval',
    renaissance: 'Renaissance',
    industrial: 'Industrial',
    modern: 'Modern',
    atomic: 'Atomic',
    information: 'Info',
  };

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
          <label className="label flex items-center justify-between">
            <span>Wonder</span>
            {tile.wonder !== WonderType.NONE && (
              <button
                onClick={() => onSetWonder(WonderType.NONE)}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Clear
              </button>
            )}
          </label>
          
          {/* Era Tabs */}
          <div className="flex flex-wrap gap-1 mb-2">
            {Object.keys(wondersByEra).map(era => (
              <button
                key={era}
                onClick={() => setSelectedEra(era)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  selectedEra === era
                    ? 'bg-civ-accent text-civ-bg font-medium'
                    : 'bg-civ-surface border border-civ-border text-gray-400 hover:bg-civ-hover'
                }`}
              >
                {eraLabels[era]}
              </button>
            ))}
          </div>
          
          {/* Wonder Select for Selected Era */}
          <select
            className="select"
            value={tile.wonder}
            onChange={(e) => onSetWonder(e.target.value as WonderType)}
            disabled={tile.isMountain || tile.isWater}
          >
            <option value={WonderType.NONE}>None</option>
            {wondersByEra[selectedEra as keyof typeof wondersByEra].map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          
          {/* Current wonder indicator if from different era */}
          {tile.wonder !== WonderType.NONE && !wondersByEra[selectedEra as keyof typeof wondersByEra].some(w => w.value === tile.wonder) && (
            <div className="mt-1 text-xs text-civ-accent">
              ✨ Current: {Object.values(wondersByEra).flat().find(w => w.value === tile.wonder)?.label || tile.wonder}
            </div>
          )}
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
