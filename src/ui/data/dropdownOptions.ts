/**
 * Dropdown Options Data
 * 
 * Contains all dropdown option definitions for the TileEditor.
 */

import {
  TerrainType,
  TerrainModifier,
  FeatureType,
  ResourceType,
  DistrictType,
  WonderType,
} from '../../core';
import { TERRAIN_DATA, FEATURE_DATA, RESOURCE_DATA, DISTRICT_DATA } from '../../core/gameData';

// ============================================================================
// TYPES
// ============================================================================

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

// ============================================================================
// HELPERS
// ============================================================================

/** Sort options alphabetically, keeping "None" at top */
export const sortOptions = <T extends { label: string; value: string }>(options: T[]): T[] => {
  return [...options].sort((a, b) => {
    if (a.label === 'None') return -1;
    if (b.label === 'None') return 1;
    return a.label.localeCompare(b.label);
  });
};

// ============================================================================
// TERRAIN OPTIONS
// ============================================================================

export const TERRAIN_OPTIONS: SelectOption[] = sortOptions(
  Object.values(TerrainType).map(t => ({
    label: TERRAIN_DATA[t]?.name || t,
    value: t,
  }))
);

// ============================================================================
// MODIFIER OPTIONS (Elevation)
// ============================================================================

export const MODIFIER_OPTIONS: SelectOption[] = sortOptions(
  Object.values(TerrainModifier).map(m => ({
    label: m.charAt(0).toUpperCase() + m.slice(1),
    value: m,
  }))
);

// ============================================================================
// FEATURE OPTIONS
// ============================================================================

/** Get feature options with disabled state based on current terrain */
export const getFeatureOptions = (currentTerrain: TerrainType): SelectOption[] => {
  return sortOptions(
    Object.values(FeatureType).map(f => ({
      label: FEATURE_DATA[f]?.name || f,
      value: f,
      disabled: f !== FeatureType.NONE && !FEATURE_DATA[f]?.validTerrains.includes(currentTerrain),
    }))
  );
};

// ============================================================================
// RESOURCE OPTIONS
// ============================================================================

export const RESOURCE_OPTIONS: SelectOption[] = sortOptions(
  Object.values(ResourceType)
    .filter(r => r === ResourceType.NONE || RESOURCE_DATA[r]?.category !== 'none')
    .map(r => ({
      label: RESOURCE_DATA[r]?.name || r,
      value: r,
    }))
);

// ============================================================================
// DISTRICT OPTIONS
// ============================================================================

export const DISTRICT_OPTIONS: SelectOption[] = sortOptions(
  Object.values(DistrictType).map(d => ({
    label: DISTRICT_DATA[d]?.name || d,
    value: d,
  }))
);

// ============================================================================
// WONDER OPTIONS
// ============================================================================

export interface WonderOption {
  label: string;
  value: WonderType;
}

export const WONDERS_BY_ERA: Record<string, WonderOption[]> = {
  ancient: [
    { label: 'Etemenanki', value: WonderType.ETEMENANKI },
    { label: 'Great Bath', value: WonderType.GREAT_BATH },
    { label: 'Hanging Gardens', value: WonderType.HANGING_GARDENS },
    { label: 'Oracle', value: WonderType.ORACLE },
    { label: 'Pyramids', value: WonderType.PYRAMIDS },
    { label: 'Stonehenge', value: WonderType.STONEHENGE },
    { label: 'Temple of Artemis', value: WonderType.TEMPLE_OF_ARTEMIS },
  ],
  classical: [
    { label: 'Apadana', value: WonderType.APADANA },
    { label: 'Colosseum', value: WonderType.COLOSSEUM },
    { label: 'Colossus', value: WonderType.COLOSSUS },
    { label: 'Great Library', value: WonderType.GREAT_LIBRARY },
    { label: 'Great Lighthouse', value: WonderType.GREAT_LIGHTHOUSE },
    { label: 'Jebel Barkal', value: WonderType.JEBEL_BARKAL },
    { label: 'Mahabodhi Temple', value: WonderType.MAHABODHI_TEMPLE },
    { label: 'Mausoleum at Halicarnassus', value: WonderType.MAUSOLEUM_AT_HALICARNASSUS },
    { label: 'Petra', value: WonderType.PETRA },
    { label: 'Statue of Zeus', value: WonderType.STATUE_OF_ZEUS },
    { label: 'Terracotta Army', value: WonderType.TERRACOTTA_ARMY },
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

export const ERA_LABELS: Record<string, string> = {
  ancient: 'Ancient',
  classical: 'Classical',
  medieval: 'Medieval',
  renaissance: 'Renaissance',
  industrial: 'Industrial',
  modern: 'Modern',
  atomic: 'Atomic',
  information: 'Info',
};

/** Get all wonders as a flat array */
export const ALL_WONDERS: WonderOption[] = Object.values(WONDERS_BY_ERA).flat();

