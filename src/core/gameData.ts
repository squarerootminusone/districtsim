/**
 * Civilization 6 Game Data
 * Based on the Civilization 6 Wiki
 */

import {
  TerrainType,
  FeatureType,
  ResourceType,
  ResourceCategory,
  DistrictType,
  WonderType,
  NaturalWonderType,
  Yields,
  EMPTY_YIELDS,
} from './types';

// ============================================================================
// TERRAIN DATA
// ============================================================================

export interface TerrainInfo {
  name: string;
  yields: Yields;
  movementCost: number;
  isWater: boolean;
}

export const TERRAIN_DATA: Record<TerrainType, TerrainInfo> = {
  [TerrainType.GRASS]: {
    name: 'Grassland',
    yields: { ...EMPTY_YIELDS, food: 2 },
    movementCost: 1,
    isWater: false,
  },
  [TerrainType.PLAINS]: {
    name: 'Plains',
    yields: { ...EMPTY_YIELDS, food: 1, production: 1 },
    movementCost: 1,
    isWater: false,
  },
  [TerrainType.DESERT]: {
    name: 'Desert',
    yields: { ...EMPTY_YIELDS },
    movementCost: 1,
    isWater: false,
  },
  [TerrainType.TUNDRA]: {
    name: 'Tundra',
    yields: { ...EMPTY_YIELDS, food: 1 },
    movementCost: 1,
    isWater: false,
  },
  [TerrainType.SNOW]: {
    name: 'Snow',
    yields: { ...EMPTY_YIELDS },
    movementCost: 1,
    isWater: false,
  },
  [TerrainType.COAST]: {
    name: 'Coast',
    yields: { ...EMPTY_YIELDS, food: 1, gold: 1 },
    movementCost: 1,
    isWater: true,
  },
  [TerrainType.OCEAN]: {
    name: 'Ocean',
    yields: { ...EMPTY_YIELDS, food: 1 },
    movementCost: 1,
    isWater: true,
  },
};

// ============================================================================
// FEATURE DATA
// ============================================================================

export interface FeatureInfo {
  name: string;
  yields: Yields;
  validTerrains: TerrainType[];
  removable: boolean;
  appealModifier: number;
}

export const FEATURE_DATA: Record<FeatureType, FeatureInfo> = {
  [FeatureType.NONE]: {
    name: 'None',
    yields: { ...EMPTY_YIELDS },
    validTerrains: [],
    removable: false,
    appealModifier: 0,
  },
  [FeatureType.WOODS]: {
    name: 'Woods',
    yields: { ...EMPTY_YIELDS, production: 1 },
    validTerrains: [TerrainType.GRASS, TerrainType.PLAINS, TerrainType.TUNDRA],
    removable: true,
    appealModifier: 1,
  },
  [FeatureType.RAINFOREST]: {
    name: 'Rainforest',
    yields: { ...EMPTY_YIELDS, food: 1 },
    validTerrains: [TerrainType.PLAINS],
    removable: true,
    appealModifier: -1,
  },
  [FeatureType.MARSH]: {
    name: 'Marsh',
    yields: { ...EMPTY_YIELDS, food: 1 },
    validTerrains: [TerrainType.GRASS],
    removable: true,
    appealModifier: -1,
  },
  [FeatureType.FLOODPLAINS]: {
    name: 'Floodplains',
    yields: { ...EMPTY_YIELDS, food: 3 },
    validTerrains: [TerrainType.DESERT, TerrainType.GRASS, TerrainType.PLAINS],
    removable: false,
    appealModifier: -1,
  },
  [FeatureType.OASIS]: {
    name: 'Oasis',
    yields: { ...EMPTY_YIELDS, food: 3, gold: 1 },
    validTerrains: [TerrainType.DESERT],
    removable: false,
    appealModifier: 1,
  },
  [FeatureType.REEF]: {
    name: 'Reef',
    yields: { ...EMPTY_YIELDS, food: 1, production: 1 },
    validTerrains: [TerrainType.COAST],
    removable: false,
    appealModifier: 0,
  },
  [FeatureType.ICE]: {
    name: 'Ice',
    yields: { ...EMPTY_YIELDS },
    validTerrains: [TerrainType.COAST, TerrainType.OCEAN],
    removable: false,
    appealModifier: 0,
  },
  [FeatureType.VOLCANO]: {
    name: 'Volcano',
    yields: { ...EMPTY_YIELDS },
    validTerrains: [TerrainType.GRASS, TerrainType.PLAINS, TerrainType.DESERT, TerrainType.TUNDRA, TerrainType.SNOW],
    removable: false,
    appealModifier: 0,
  },
  [FeatureType.GEOTHERMAL_FISSURE]: {
    name: 'Geothermal Fissure',
    yields: { ...EMPTY_YIELDS, science: 1 },
    validTerrains: [TerrainType.GRASS, TerrainType.PLAINS, TerrainType.DESERT, TerrainType.TUNDRA, TerrainType.SNOW],
    removable: false,
    appealModifier: -1,
  },
};

// ============================================================================
// RESOURCE DATA
// ============================================================================

export interface ResourceInfo {
  name: string;
  category: ResourceCategory;
  yields: Yields;
  validTerrains: TerrainType[];
  validFeatures: FeatureType[];
}

export const RESOURCE_DATA: Record<ResourceType, ResourceInfo> = {
  [ResourceType.NONE]: {
    name: 'None',
    category: ResourceCategory.NONE,
    yields: { ...EMPTY_YIELDS },
    validTerrains: [],
    validFeatures: [],
  },
  // Bonus Resources
  [ResourceType.BANANAS]: {
    name: 'Bananas',
    category: ResourceCategory.BONUS,
    yields: { ...EMPTY_YIELDS, food: 1 },
    validTerrains: [TerrainType.PLAINS],
    validFeatures: [FeatureType.RAINFOREST],
  },
  [ResourceType.CATTLE]: {
    name: 'Cattle',
    category: ResourceCategory.BONUS,
    yields: { ...EMPTY_YIELDS, food: 1 },
    validTerrains: [TerrainType.GRASS],
    validFeatures: [FeatureType.NONE],
  },
  [ResourceType.COPPER]: {
    name: 'Copper',
    category: ResourceCategory.BONUS,
    yields: { ...EMPTY_YIELDS, gold: 2 },
    validTerrains: [TerrainType.GRASS, TerrainType.PLAINS, TerrainType.DESERT, TerrainType.TUNDRA],
    validFeatures: [FeatureType.NONE],
  },
  [ResourceType.CRABS]: {
    name: 'Crabs',
    category: ResourceCategory.BONUS,
    yields: { ...EMPTY_YIELDS, gold: 2 },
    validTerrains: [TerrainType.COAST],
    validFeatures: [FeatureType.NONE],
  },
  [ResourceType.DEER]: {
    name: 'Deer',
    category: ResourceCategory.BONUS,
    yields: { ...EMPTY_YIELDS, production: 1 },
    validTerrains: [TerrainType.TUNDRA],
    validFeatures: [FeatureType.WOODS],
  },
  [ResourceType.FISH]: {
    name: 'Fish',
    category: ResourceCategory.BONUS,
    yields: { ...EMPTY_YIELDS, food: 1 },
    validTerrains: [TerrainType.COAST, TerrainType.OCEAN],
    validFeatures: [FeatureType.NONE],
  },
  [ResourceType.MAIZE]: {
    name: 'Maize',
    category: ResourceCategory.BONUS,
    yields: { ...EMPTY_YIELDS, gold: 2 },
    validTerrains: [TerrainType.GRASS, TerrainType.PLAINS],
    validFeatures: [FeatureType.NONE],
  },
  [ResourceType.RICE]: {
    name: 'Rice',
    category: ResourceCategory.BONUS,
    yields: { ...EMPTY_YIELDS, food: 1 },
    validTerrains: [TerrainType.GRASS],
    validFeatures: [FeatureType.MARSH],
  },
  [ResourceType.SHEEP]: {
    name: 'Sheep',
    category: ResourceCategory.BONUS,
    yields: { ...EMPTY_YIELDS, food: 1 },
    validTerrains: [TerrainType.GRASS, TerrainType.PLAINS, TerrainType.DESERT, TerrainType.TUNDRA],
    validFeatures: [FeatureType.NONE],
  },
  [ResourceType.STONE]: {
    name: 'Stone',
    category: ResourceCategory.BONUS,
    yields: { ...EMPTY_YIELDS, production: 1 },
    validTerrains: [TerrainType.GRASS, TerrainType.PLAINS, TerrainType.DESERT, TerrainType.TUNDRA],
    validFeatures: [FeatureType.NONE],
  },
  [ResourceType.WHEAT]: {
    name: 'Wheat',
    category: ResourceCategory.BONUS,
    yields: { ...EMPTY_YIELDS, food: 1 },
    validTerrains: [TerrainType.PLAINS],
    validFeatures: [FeatureType.FLOODPLAINS],
  },
  // Luxury Resources
  [ResourceType.AMBER]: {
    name: 'Amber',
    category: ResourceCategory.LUXURY,
    yields: { ...EMPTY_YIELDS, gold: 3 },
    validTerrains: [TerrainType.GRASS, TerrainType.PLAINS],
    validFeatures: [FeatureType.WOODS],
  },
  [ResourceType.CITRUS]: {
    name: 'Citrus',
    category: ResourceCategory.LUXURY,
    yields: { ...EMPTY_YIELDS, food: 2 },
    validTerrains: [TerrainType.GRASS, TerrainType.PLAINS],
    validFeatures: [FeatureType.NONE],
  },
  [ResourceType.COCOA]: {
    name: 'Cocoa',
    category: ResourceCategory.LUXURY,
    yields: { ...EMPTY_YIELDS, gold: 3 },
    validTerrains: [TerrainType.PLAINS],
    validFeatures: [FeatureType.RAINFOREST],
  },
  [ResourceType.COFFEE]: {
    name: 'Coffee',
    category: ResourceCategory.LUXURY,
    yields: { ...EMPTY_YIELDS, culture: 1 },
    validTerrains: [TerrainType.GRASS, TerrainType.PLAINS],
    validFeatures: [FeatureType.NONE],
  },
  [ResourceType.COTTON]: {
    name: 'Cotton',
    category: ResourceCategory.LUXURY,
    yields: { ...EMPTY_YIELDS, gold: 3 },
    validTerrains: [TerrainType.GRASS, TerrainType.PLAINS],
    validFeatures: [FeatureType.NONE],
  },
  [ResourceType.DIAMONDS]: {
    name: 'Diamonds',
    category: ResourceCategory.LUXURY,
    yields: { ...EMPTY_YIELDS, gold: 3 },
    validTerrains: [TerrainType.GRASS, TerrainType.PLAINS, TerrainType.DESERT, TerrainType.TUNDRA],
    validFeatures: [FeatureType.RAINFOREST],
  },
  [ResourceType.DYES]: {
    name: 'Dyes',
    category: ResourceCategory.LUXURY,
    yields: { ...EMPTY_YIELDS, faith: 1 },
    validTerrains: [TerrainType.PLAINS],
    validFeatures: [FeatureType.RAINFOREST, FeatureType.WOODS],
  },
  [ResourceType.FURS]: {
    name: 'Furs',
    category: ResourceCategory.LUXURY,
    yields: { ...EMPTY_YIELDS, food: 1, gold: 1 },
    validTerrains: [TerrainType.TUNDRA],
    validFeatures: [FeatureType.WOODS],
  },
  [ResourceType.GYPSUM]: {
    name: 'Gypsum',
    category: ResourceCategory.LUXURY,
    yields: { ...EMPTY_YIELDS, production: 1, gold: 1 },
    validTerrains: [TerrainType.PLAINS, TerrainType.DESERT],
    validFeatures: [FeatureType.NONE],
  },
  [ResourceType.HONEY]: {
    name: 'Honey',
    category: ResourceCategory.LUXURY,
    yields: { ...EMPTY_YIELDS, food: 2 },
    validTerrains: [TerrainType.GRASS, TerrainType.PLAINS],
    validFeatures: [FeatureType.NONE],
  },
  [ResourceType.INCENSE]: {
    name: 'Incense',
    category: ResourceCategory.LUXURY,
    yields: { ...EMPTY_YIELDS, faith: 1 },
    validTerrains: [TerrainType.PLAINS, TerrainType.DESERT],
    validFeatures: [FeatureType.NONE],
  },
  [ResourceType.IVORY]: {
    name: 'Ivory',
    category: ResourceCategory.LUXURY,
    yields: { ...EMPTY_YIELDS, production: 1, gold: 1 },
    validTerrains: [TerrainType.PLAINS, TerrainType.DESERT],
    validFeatures: [FeatureType.NONE],
  },
  [ResourceType.JADE]: {
    name: 'Jade',
    category: ResourceCategory.LUXURY,
    yields: { ...EMPTY_YIELDS, culture: 1 },
    validTerrains: [TerrainType.GRASS, TerrainType.PLAINS, TerrainType.TUNDRA],
    validFeatures: [FeatureType.WOODS],
  },
  [ResourceType.MARBLE]: {
    name: 'Marble',
    category: ResourceCategory.LUXURY,
    yields: { ...EMPTY_YIELDS, culture: 1 },
    validTerrains: [TerrainType.GRASS, TerrainType.PLAINS],
    validFeatures: [FeatureType.NONE],
  },
  [ResourceType.MERCURY]: {
    name: 'Mercury',
    category: ResourceCategory.LUXURY,
    yields: { ...EMPTY_YIELDS, science: 1 },
    validTerrains: [TerrainType.PLAINS],
    validFeatures: [FeatureType.NONE],
  },
  [ResourceType.PEARLS]: {
    name: 'Pearls',
    category: ResourceCategory.LUXURY,
    yields: { ...EMPTY_YIELDS, faith: 1 },
    validTerrains: [TerrainType.COAST],
    validFeatures: [FeatureType.NONE],
  },
  [ResourceType.SALT]: {
    name: 'Salt',
    category: ResourceCategory.LUXURY,
    yields: { ...EMPTY_YIELDS, food: 1, gold: 1 },
    validTerrains: [TerrainType.PLAINS, TerrainType.DESERT, TerrainType.TUNDRA],
    validFeatures: [FeatureType.NONE],
  },
  [ResourceType.SILK]: {
    name: 'Silk',
    category: ResourceCategory.LUXURY,
    yields: { ...EMPTY_YIELDS, culture: 1 },
    validTerrains: [TerrainType.GRASS, TerrainType.PLAINS],
    validFeatures: [FeatureType.WOODS],
  },
  [ResourceType.SILVER]: {
    name: 'Silver',
    category: ResourceCategory.LUXURY,
    yields: { ...EMPTY_YIELDS, gold: 3 },
    validTerrains: [TerrainType.DESERT, TerrainType.TUNDRA],
    validFeatures: [FeatureType.NONE],
  },
  [ResourceType.SPICES]: {
    name: 'Spices',
    category: ResourceCategory.LUXURY,
    yields: { ...EMPTY_YIELDS, food: 2 },
    validTerrains: [TerrainType.PLAINS],
    validFeatures: [FeatureType.RAINFOREST],
  },
  [ResourceType.SUGAR]: {
    name: 'Sugar',
    category: ResourceCategory.LUXURY,
    yields: { ...EMPTY_YIELDS, food: 2 },
    validTerrains: [TerrainType.GRASS],
    validFeatures: [FeatureType.FLOODPLAINS, FeatureType.MARSH],
  },
  [ResourceType.TEA]: {
    name: 'Tea',
    category: ResourceCategory.LUXURY,
    yields: { ...EMPTY_YIELDS, culture: 1 },
    validTerrains: [TerrainType.GRASS, TerrainType.PLAINS],
    validFeatures: [FeatureType.NONE],
  },
  [ResourceType.TOBACCO]: {
    name: 'Tobacco',
    category: ResourceCategory.LUXURY,
    yields: { ...EMPTY_YIELDS, faith: 1 },
    validTerrains: [TerrainType.GRASS, TerrainType.PLAINS],
    validFeatures: [FeatureType.NONE],
  },
  [ResourceType.TRUFFLES]: {
    name: 'Truffles',
    category: ResourceCategory.LUXURY,
    yields: { ...EMPTY_YIELDS, gold: 3 },
    validTerrains: [TerrainType.GRASS, TerrainType.PLAINS, TerrainType.TUNDRA],
    validFeatures: [FeatureType.RAINFOREST, FeatureType.MARSH, FeatureType.WOODS],
  },
  [ResourceType.WHALES]: {
    name: 'Whales',
    category: ResourceCategory.LUXURY,
    yields: { ...EMPTY_YIELDS, gold: 1, production: 1 },
    validTerrains: [TerrainType.COAST, TerrainType.OCEAN],
    validFeatures: [FeatureType.NONE],
  },
  [ResourceType.WINE]: {
    name: 'Wine',
    category: ResourceCategory.LUXURY,
    yields: { ...EMPTY_YIELDS, food: 1, gold: 1 },
    validTerrains: [TerrainType.GRASS, TerrainType.PLAINS],
    validFeatures: [FeatureType.NONE],
  },
  // Strategic Resources
  [ResourceType.HORSES]: {
    name: 'Horses',
    category: ResourceCategory.STRATEGIC,
    yields: { ...EMPTY_YIELDS, food: 1, production: 1 },
    validTerrains: [TerrainType.GRASS, TerrainType.PLAINS, TerrainType.TUNDRA],
    validFeatures: [FeatureType.NONE],
  },
  [ResourceType.IRON]: {
    name: 'Iron',
    category: ResourceCategory.STRATEGIC,
    yields: { ...EMPTY_YIELDS, science: 1 },
    validTerrains: [TerrainType.GRASS, TerrainType.PLAINS, TerrainType.DESERT, TerrainType.TUNDRA, TerrainType.SNOW],
    validFeatures: [FeatureType.NONE],
  },
  [ResourceType.NITER]: {
    name: 'Niter',
    category: ResourceCategory.STRATEGIC,
    yields: { ...EMPTY_YIELDS, food: 1, production: 1 },
    validTerrains: [TerrainType.GRASS, TerrainType.PLAINS, TerrainType.DESERT, TerrainType.TUNDRA],
    validFeatures: [FeatureType.NONE],
  },
  [ResourceType.COAL]: {
    name: 'Coal',
    category: ResourceCategory.STRATEGIC,
    yields: { ...EMPTY_YIELDS, production: 2 },
    validTerrains: [TerrainType.GRASS, TerrainType.PLAINS],
    validFeatures: [FeatureType.NONE],
  },
  [ResourceType.OIL]: {
    name: 'Oil',
    category: ResourceCategory.STRATEGIC,
    yields: { ...EMPTY_YIELDS, production: 3 },
    validTerrains: [TerrainType.DESERT, TerrainType.TUNDRA, TerrainType.SNOW, TerrainType.COAST, TerrainType.OCEAN],
    validFeatures: [FeatureType.RAINFOREST, FeatureType.MARSH],
  },
  [ResourceType.ALUMINUM]: {
    name: 'Aluminum',
    category: ResourceCategory.STRATEGIC,
    yields: { ...EMPTY_YIELDS, science: 1 },
    validTerrains: [TerrainType.PLAINS, TerrainType.DESERT],
    validFeatures: [FeatureType.NONE],
  },
  [ResourceType.URANIUM]: {
    name: 'Uranium',
    category: ResourceCategory.STRATEGIC,
    yields: { ...EMPTY_YIELDS, production: 2 },
    validTerrains: [TerrainType.GRASS, TerrainType.PLAINS, TerrainType.DESERT, TerrainType.TUNDRA, TerrainType.SNOW],
    validFeatures: [FeatureType.RAINFOREST, FeatureType.MARSH, FeatureType.WOODS],
  },
};

// ============================================================================
// DISTRICT DATA
// ============================================================================

export interface DistrictInfo {
  name: string;
  baseYields: Yields;
  primaryYieldType: keyof Yields | null;
  requiresCoast: boolean;
  requiresLand: boolean;
  canBuildOnHills: boolean;
  isSpecialty: boolean;
  description: string;
}

export const DISTRICT_DATA: Record<DistrictType, DistrictInfo> = {
  [DistrictType.NONE]: {
    name: 'None',
    baseYields: { ...EMPTY_YIELDS },
    primaryYieldType: null,
    requiresCoast: false,
    requiresLand: false,
    canBuildOnHills: true,
    isSpecialty: false,
    description: '',
  },
  [DistrictType.CITY_CENTER]: {
    name: 'City Center',
    baseYields: { ...EMPTY_YIELDS, food: 2, production: 1 },
    primaryYieldType: null,
    requiresCoast: false,
    requiresLand: true,
    canBuildOnHills: true,
    isSpecialty: false,
    description: 'The heart of your city.',
  },
  [DistrictType.HOLY_SITE]: {
    name: 'Holy Site',
    baseYields: { ...EMPTY_YIELDS },
    primaryYieldType: 'faith',
    requiresCoast: false,
    requiresLand: true,
    canBuildOnHills: true,
    isSpecialty: true,
    description: '+1 Faith for each adjacent Mountain. +1 Faith for every 2 adjacent Woods and district tiles.',
  },
  [DistrictType.CAMPUS]: {
    name: 'Campus',
    baseYields: { ...EMPTY_YIELDS },
    primaryYieldType: 'science',
    requiresCoast: false,
    requiresLand: true,
    canBuildOnHills: true,
    isSpecialty: true,
    description: '+1 Science for each adjacent Mountain. +1 Science for every 2 adjacent Rainforest and district tiles.',
  },
  [DistrictType.THEATER_SQUARE]: {
    name: 'Theater Square',
    baseYields: { ...EMPTY_YIELDS },
    primaryYieldType: 'culture',
    requiresCoast: false,
    requiresLand: true,
    canBuildOnHills: true,
    isSpecialty: true,
    description: '+1 Culture for each adjacent Wonder. +1 Culture for every 2 adjacent district tiles.',
  },
  [DistrictType.COMMERCIAL_HUB]: {
    name: 'Commercial Hub',
    baseYields: { ...EMPTY_YIELDS },
    primaryYieldType: 'gold',
    requiresCoast: false,
    requiresLand: true,
    canBuildOnHills: true,
    isSpecialty: true,
    description: '+2 Gold for each adjacent River. +2 Gold for each adjacent Harbor. +1 Gold for every 2 adjacent district tiles.',
  },
  [DistrictType.HARBOR]: {
    name: 'Harbor',
    baseYields: { ...EMPTY_YIELDS },
    primaryYieldType: 'gold',
    requiresCoast: true,
    requiresLand: false,
    canBuildOnHills: false,
    isSpecialty: true,
    description: '+1 Gold for each adjacent Coastal resource. +2 Gold for each adjacent City Center. +1 Gold for every 2 adjacent district tiles.',
  },
  [DistrictType.INDUSTRIAL_ZONE]: {
    name: 'Industrial Zone',
    baseYields: { ...EMPTY_YIELDS },
    primaryYieldType: 'production',
    requiresCoast: false,
    requiresLand: true,
    canBuildOnHills: true,
    isSpecialty: true,
    description: '+1 Production for each adjacent Mine. +1 Production for each adjacent Quarry. +2 Production for each adjacent Aqueduct, Canal, or Dam.',
  },
  [DistrictType.ENTERTAINMENT_COMPLEX]: {
    name: 'Entertainment Complex',
    baseYields: { ...EMPTY_YIELDS },
    primaryYieldType: null,
    requiresCoast: false,
    requiresLand: true,
    canBuildOnHills: true,
    isSpecialty: true,
    description: 'Provides Amenities to your city.',
  },
  [DistrictType.WATER_PARK]: {
    name: 'Water Park',
    baseYields: { ...EMPTY_YIELDS },
    primaryYieldType: null,
    requiresCoast: true,
    requiresLand: false,
    canBuildOnHills: false,
    isSpecialty: true,
    description: 'Coastal entertainment district providing Amenities.',
  },
  [DistrictType.AQUEDUCT]: {
    name: 'Aqueduct',
    baseYields: { ...EMPTY_YIELDS },
    primaryYieldType: null,
    requiresCoast: false,
    requiresLand: true,
    canBuildOnHills: false,
    isSpecialty: false,
    description: 'Must be built adjacent to the City Center and a source of fresh water.',
  },
  [DistrictType.NEIGHBORHOOD]: {
    name: 'Neighborhood',
    baseYields: { ...EMPTY_YIELDS },
    primaryYieldType: null,
    requiresCoast: false,
    requiresLand: true,
    canBuildOnHills: true,
    isSpecialty: false,
    description: 'Provides Housing based on Appeal.',
  },
  [DistrictType.SPACEPORT]: {
    name: 'Spaceport',
    baseYields: { ...EMPTY_YIELDS },
    primaryYieldType: null,
    requiresCoast: false,
    requiresLand: true,
    canBuildOnHills: false,
    isSpecialty: true,
    description: 'Allows construction of Space Race projects.',
  },
  [DistrictType.AERODROME]: {
    name: 'Aerodrome',
    baseYields: { ...EMPTY_YIELDS },
    primaryYieldType: null,
    requiresCoast: false,
    requiresLand: true,
    canBuildOnHills: false,
    isSpecialty: true,
    description: 'Allows construction of air units.',
  },
  [DistrictType.ENCAMPMENT]: {
    name: 'Encampment',
    baseYields: { ...EMPTY_YIELDS },
    primaryYieldType: null,
    requiresCoast: false,
    requiresLand: true,
    canBuildOnHills: true,
    isSpecialty: true,
    description: 'Military district. Cannot be adjacent to City Center.',
  },
  [DistrictType.GOVERNMENT_PLAZA]: {
    name: 'Government Plaza',
    baseYields: { ...EMPTY_YIELDS },
    primaryYieldType: null,
    requiresCoast: false,
    requiresLand: true,
    canBuildOnHills: true,
    isSpecialty: true,
    description: 'Can only be built once. +1 adjacency bonus to all adjacent districts.',
  },
  [DistrictType.DIPLOMATIC_QUARTER]: {
    name: 'Diplomatic Quarter',
    baseYields: { ...EMPTY_YIELDS },
    primaryYieldType: null,
    requiresCoast: false,
    requiresLand: true,
    canBuildOnHills: true,
    isSpecialty: true,
    description: 'Diplomatic district.',
  },
  [DistrictType.PRESERVE]: {
    name: 'Preserve',
    baseYields: { ...EMPTY_YIELDS },
    primaryYieldType: null,
    requiresCoast: false,
    requiresLand: true,
    canBuildOnHills: true,
    isSpecialty: true,
    description: 'Cannot be adjacent to any other district. Increases Appeal of adjacent tiles.',
  },
  [DistrictType.DAM]: {
    name: 'Dam',
    baseYields: { ...EMPTY_YIELDS },
    primaryYieldType: null,
    requiresCoast: false,
    requiresLand: true,
    canBuildOnHills: false,
    isSpecialty: false,
    description: 'Must be built on Floodplains. Prevents flooding and provides bonus to Industrial Zones.',
  },
  [DistrictType.CANAL]: {
    name: 'Canal',
    baseYields: { ...EMPTY_YIELDS, gold: 2 },
    primaryYieldType: 'gold',
    requiresCoast: false,
    requiresLand: true,
    canBuildOnHills: false,
    isSpecialty: false,
    description: 'Must be built between City Center and water, or between two water tiles.',
  },
};

// ============================================================================
// WONDER DATA
// ============================================================================

export interface WonderInfo {
  name: string;
  era: string;
  yields: Yields;
  description: string;
  providesAdjacency: boolean;
}

export const WONDER_DATA: Record<WonderType, WonderInfo> = {
  [WonderType.NONE]: { name: 'None', era: '', yields: { ...EMPTY_YIELDS }, description: '', providesAdjacency: false },
  // Ancient Era
  [WonderType.STONEHENGE]: { name: 'Stonehenge', era: 'Ancient', yields: { ...EMPTY_YIELDS, faith: 2 }, description: 'Provides a free Great Prophet.', providesAdjacency: true },
  [WonderType.PYRAMIDS]: { name: 'Pyramids', era: 'Ancient', yields: { ...EMPTY_YIELDS, culture: 2 }, description: 'Builders gain an extra charge.', providesAdjacency: true },
  [WonderType.HANGING_GARDENS]: { name: 'Hanging Gardens', era: 'Ancient', yields: { ...EMPTY_YIELDS, food: 2 }, description: '+15% Growth in all cities.', providesAdjacency: true },
  [WonderType.ORACLE]: { name: 'Oracle', era: 'Ancient', yields: { ...EMPTY_YIELDS, culture: 1, faith: 1 }, description: 'Great People cost less.', providesAdjacency: true },
  [WonderType.GREAT_BATH]: { name: 'Great Bath', era: 'Ancient', yields: { ...EMPTY_YIELDS, faith: 3 }, description: 'Floodplains generate Faith.', providesAdjacency: true },
  [WonderType.TEMPLE_OF_ARTEMIS]: { name: 'Temple of Artemis', era: 'Ancient', yields: { ...EMPTY_YIELDS, food: 4 }, description: '+1 Amenity for each Camp, Pasture, and Plantation.', providesAdjacency: true },
  [WonderType.ETEMENANKI]: { name: 'Etemenanki', era: 'Ancient', yields: { ...EMPTY_YIELDS, science: 2 }, description: 'Floodplains and Marsh tiles gain Science and Production.', providesAdjacency: true },
  // Classical Era
  [WonderType.COLOSSEUM]: { name: 'Colosseum', era: 'Classical', yields: { ...EMPTY_YIELDS, culture: 2 }, description: '+3 Loyalty and +2 Amenities to cities within 6 tiles.', providesAdjacency: true },
  [WonderType.COLOSSUS]: { name: 'Colossus', era: 'Classical', yields: { ...EMPTY_YIELDS, gold: 3 }, description: '+1 Trade Route capacity.', providesAdjacency: true },
  [WonderType.GREAT_LIBRARY]: { name: 'Great Library', era: 'Classical', yields: { ...EMPTY_YIELDS, science: 2 }, description: 'Receive boosts to Ancient and Classical technologies.', providesAdjacency: true },
  [WonderType.GREAT_LIGHTHOUSE]: { name: 'Great Lighthouse', era: 'Classical', yields: { ...EMPTY_YIELDS, gold: 3 }, description: '+1 Movement for naval units.', providesAdjacency: true },
  [WonderType.JEBEL_BARKAL]: { name: 'Jebel Barkal', era: 'Classical', yields: { ...EMPTY_YIELDS, faith: 4 }, description: 'Awards 2 Iron.', providesAdjacency: true },
  [WonderType.MAHABODHI_TEMPLE]: { name: 'Mahabodhi Temple', era: 'Classical', yields: { ...EMPTY_YIELDS, faith: 4 }, description: 'Grants 2 Apostles.', providesAdjacency: true },
  [WonderType.MAUSOLEUM_AT_HALICARNASSUS]: { name: 'Mausoleum at Halicarnassus', era: 'Classical', yields: { ...EMPTY_YIELDS, faith: 1, science: 1, culture: 1 }, description: 'Great Engineers have additional charges.', providesAdjacency: true },
  [WonderType.PETRA]: { name: 'Petra', era: 'Classical', yields: { ...EMPTY_YIELDS, culture: 2 }, description: 'Desert tiles gain +2 Food, +2 Gold, +1 Production.', providesAdjacency: true },
  [WonderType.TERRACOTTA_ARMY]: { name: 'Terracotta Army', era: 'Classical', yields: { ...EMPTY_YIELDS, culture: 2 }, description: 'All land units gain a promotion.', providesAdjacency: true },
  [WonderType.APADANA]: { name: 'Apadana', era: 'Classical', yields: { ...EMPTY_YIELDS, culture: 2 }, description: '+2 Envoys when a Wonder is completed.', providesAdjacency: true },
  [WonderType.STATUE_OF_ZEUS]: { name: 'Statue of Zeus', era: 'Classical', yields: { ...EMPTY_YIELDS, gold: 3 }, description: '+50% Production toward anti-cavalry units.', providesAdjacency: true },
  // Medieval Era
  [WonderType.ALHAMBRA]: { name: 'Alhambra', era: 'Medieval', yields: { ...EMPTY_YIELDS, science: 2, culture: 2 }, description: 'Provides Military Policy slot.', providesAdjacency: true },
  [WonderType.ANGKOR_WAT]: { name: 'Angkor Wat', era: 'Medieval', yields: { ...EMPTY_YIELDS, faith: 2 }, description: '+1 Population and +1 Housing in all cities.', providesAdjacency: true },
  [WonderType.CHICHEN_ITZA]: { name: 'Chichen Itza', era: 'Medieval', yields: { ...EMPTY_YIELDS, culture: 2 }, description: 'Rainforest tiles gain +2 Culture and +1 Production.', providesAdjacency: true },
  [WonderType.HAGIA_SOPHIA]: { name: 'Hagia Sophia', era: 'Medieval', yields: { ...EMPTY_YIELDS, faith: 4 }, description: 'Missionaries and Apostles +1 Spread Religion charge.', providesAdjacency: true },
  [WonderType.KILWA_KISIWANI]: { name: 'Kilwa Kisiwani', era: 'Medieval', yields: { ...EMPTY_YIELDS, gold: 3 }, description: 'City-State bonuses improved.', providesAdjacency: true },
  [WonderType.KOTOKU_IN]: { name: 'Kotoku-in', era: 'Medieval', yields: { ...EMPTY_YIELDS, faith: 5 }, description: '+4 Faith for each Holy Site in your empire.', providesAdjacency: true },
  [WonderType.MEENAKSHI_TEMPLE]: { name: 'Meenakshi Temple', era: 'Medieval', yields: { ...EMPTY_YIELDS, faith: 3 }, description: 'Gurus +2 Religious Strength.', providesAdjacency: true },
  [WonderType.MONT_ST_MICHEL]: { name: 'Mont St. Michel', era: 'Medieval', yields: { ...EMPTY_YIELDS, faith: 2 }, description: 'Apostles gain Martyr.', providesAdjacency: true },
  [WonderType.UNIVERSIDAD_DE_SALAMANCA]: { name: 'Universidad de Salamanca', era: 'Medieval', yields: { ...EMPTY_YIELDS, science: 3 }, description: '+1 Science per Trade Route.', providesAdjacency: true },
  // Renaissance Era
  [WonderType.FORBIDDEN_CITY]: { name: 'Forbidden City', era: 'Renaissance', yields: { ...EMPTY_YIELDS, culture: 5 }, description: 'Provides Wildcard Policy slot.', providesAdjacency: true },
  [WonderType.GREAT_ZIMBABWE]: { name: 'Great Zimbabwe', era: 'Renaissance', yields: { ...EMPTY_YIELDS, gold: 5 }, description: '+2 Gold per bonus resource.', providesAdjacency: true },
  [WonderType.HUEY_TEOCALLI]: { name: 'Huey Teocalli', era: 'Renaissance', yields: { ...EMPTY_YIELDS, faith: 1 }, description: '+1 Amenity for each Lake tile.', providesAdjacency: true },
  [WonderType.POTALA_PALACE]: { name: 'Potala Palace', era: 'Renaissance', yields: { ...EMPTY_YIELDS, culture: 2, faith: 3 }, description: 'Provides Diplomatic Policy slot.', providesAdjacency: true },
  [WonderType.ST_BASILS_CATHEDRAL]: { name: "St. Basil's Cathedral", era: 'Renaissance', yields: { ...EMPTY_YIELDS, faith: 3 }, description: '+100% Religious Tourism from this city.', providesAdjacency: true },
  [WonderType.TAJ_MAHAL]: { name: 'Taj Mahal', era: 'Renaissance', yields: { ...EMPTY_YIELDS, culture: 1 }, description: '+2 Era Score from Historic Moments.', providesAdjacency: true },
  [WonderType.TORRE_DE_BELEM]: { name: 'Torre de Belém', era: 'Renaissance', yields: { ...EMPTY_YIELDS, gold: 5 }, description: 'International Trade Routes +2 Gold.', providesAdjacency: true },
  [WonderType.VENETIAN_ARSENAL]: { name: 'Venetian Arsenal', era: 'Renaissance', yields: { ...EMPTY_YIELDS, production: 2 }, description: 'Receive a second naval unit when training.', providesAdjacency: true },
  // Industrial Era
  [WonderType.BIG_BEN]: { name: 'Big Ben', era: 'Industrial', yields: { ...EMPTY_YIELDS, gold: 6 }, description: '+1 Economic Policy slot.', providesAdjacency: true },
  [WonderType.BOLSHOI_THEATRE]: { name: 'Bolshoi Theatre', era: 'Industrial', yields: { ...EMPTY_YIELDS, culture: 2 }, description: 'Grants 2 randomly chosen civics.', providesAdjacency: true },
  [WonderType.HERMITAGE]: { name: 'Hermitage', era: 'Industrial', yields: { ...EMPTY_YIELDS, culture: 3 }, description: '+3 Great Artist points per turn.', providesAdjacency: true },
  [WonderType.OXFORD_UNIVERSITY]: { name: 'Oxford University', era: 'Industrial', yields: { ...EMPTY_YIELDS, science: 3 }, description: 'Grants 2 randomly chosen technologies.', providesAdjacency: true },
  [WonderType.RUHR_VALLEY]: { name: 'Ruhr Valley', era: 'Industrial', yields: { ...EMPTY_YIELDS, production: 1 }, description: '+30% Production in this city.', providesAdjacency: true },
  [WonderType.STATUE_OF_LIBERTY]: { name: 'Statue of Liberty', era: 'Industrial', yields: { ...EMPTY_YIELDS }, description: '+4 Diplomatic Favor per turn.', providesAdjacency: true },
  // Modern Era
  [WonderType.BROADWAY]: { name: 'Broadway', era: 'Modern', yields: { ...EMPTY_YIELDS, culture: 3 }, description: 'Grants free Atomic Era civic.', providesAdjacency: true },
  [WonderType.CRISTO_REDENTOR]: { name: 'Cristo Redentor', era: 'Modern', yields: { ...EMPTY_YIELDS, culture: 4 }, description: 'Religious Tourism not diminished.', providesAdjacency: true },
  [WonderType.EIFFEL_TOWER]: { name: 'Eiffel Tower', era: 'Modern', yields: { ...EMPTY_YIELDS }, description: '+2 Appeal to all tiles.', providesAdjacency: true },
  [WonderType.GOLDEN_GATE_BRIDGE]: { name: 'Golden Gate Bridge', era: 'Modern', yields: { ...EMPTY_YIELDS }, description: '+3 Appeal to adjacent tiles. +4 Tourism.', providesAdjacency: true },
  [WonderType.PANAMA_CANAL]: { name: 'Panama Canal', era: 'Modern', yields: { ...EMPTY_YIELDS, gold: 10 }, description: 'Connects two water bodies.', providesAdjacency: true },
  // Atomic Era
  [WonderType.BIOSPHERE]: { name: 'Biosphere', era: 'Atomic', yields: { ...EMPTY_YIELDS, science: 4 }, description: '+1 Power for each Rainforest and Marsh.', providesAdjacency: true },
  [WonderType.ESTÁDIO_DO_MARACANÃ]: { name: 'Estádio do Maracanã', era: 'Atomic', yields: { ...EMPTY_YIELDS, culture: 6 }, description: '+2 Amenities in all cities.', providesAdjacency: true },
  [WonderType.SYDNEY_OPERA_HOUSE]: { name: 'Sydney Opera House', era: 'Atomic', yields: { ...EMPTY_YIELDS, culture: 5 }, description: '+5 Great Musician points per turn.', providesAdjacency: true },
  // Information Era
  [WonderType.AMUNDSEN_SCOTT_RESEARCH_STATION]: { name: 'Amundsen-Scott Research Station', era: 'Information', yields: { ...EMPTY_YIELDS, science: 5 }, description: '+10% Science in all cities.', providesAdjacency: true },
};

// ============================================================================
// NATURAL WONDER DATA
// ============================================================================

export interface NaturalWonderInfo {
  name: string;
  yields: Yields;
  tileCount: number;
  description: string;
  impassable: boolean;
}

export const NATURAL_WONDER_DATA: Record<NaturalWonderType, NaturalWonderInfo> = {
  [NaturalWonderType.NONE]: { name: 'None', yields: { ...EMPTY_YIELDS }, tileCount: 0, description: '', impassable: false },
  [NaturalWonderType.CLIFFS_OF_DOVER]: { name: 'Cliffs of Dover', yields: { ...EMPTY_YIELDS, culture: 3, gold: 2 }, tileCount: 2, description: 'Coastal cliffs with high appeal.', impassable: true },
  [NaturalWonderType.CRATER_LAKE]: { name: 'Crater Lake', yields: { ...EMPTY_YIELDS, faith: 4, science: 1 }, tileCount: 1, description: 'Fresh water source.', impassable: false },
  [NaturalWonderType.DEAD_SEA]: { name: 'Dead Sea', yields: { ...EMPTY_YIELDS, faith: 2, culture: 2 }, tileCount: 2, description: 'Units heal automatically.', impassable: false },
  [NaturalWonderType.EVEREST]: { name: 'Mount Everest', yields: { ...EMPTY_YIELDS, faith: 2 }, tileCount: 3, description: 'Religious units ignore hills movement cost.', impassable: true },
  [NaturalWonderType.GALAPAGOS_ISLANDS]: { name: 'Galápagos Islands', yields: { ...EMPTY_YIELDS, science: 2 }, tileCount: 2, description: 'High science yield.', impassable: false },
  [NaturalWonderType.GREAT_BARRIER_REEF]: { name: 'Great Barrier Reef', yields: { ...EMPTY_YIELDS, food: 3, science: 2 }, tileCount: 2, description: 'High appeal coastal wonder.', impassable: false },
  [NaturalWonderType.KILIMANJARO]: { name: 'Mount Kilimanjaro', yields: { ...EMPTY_YIELDS, food: 2, culture: 2 }, tileCount: 1, description: 'Adjacent units ignore hills movement.', impassable: true },
  [NaturalWonderType.PANTANAL]: { name: 'Pantanal', yields: { ...EMPTY_YIELDS, food: 2, culture: 2 }, tileCount: 4, description: 'Large wetland wonder.', impassable: false },
  [NaturalWonderType.PIOPIOTAHI]: { name: 'Piopiotahi', yields: { ...EMPTY_YIELDS, culture: 1, gold: 2 }, tileCount: 3, description: 'Milford Sound fjord.', impassable: false },
  [NaturalWonderType.TORRES_DEL_PAINE]: { name: 'Torres del Paine', yields: { ...EMPTY_YIELDS }, tileCount: 2, description: 'Doubles terrain yields of adjacent tiles.', impassable: true },
  [NaturalWonderType.TSINGY_DE_BEMARAHA]: { name: 'Tsingy de Bemaraha', yields: { ...EMPTY_YIELDS, culture: 1, science: 1 }, tileCount: 1, description: 'Stone forest of Madagascar.', impassable: true },
  [NaturalWonderType.YOSEMITE]: { name: 'Yosemite', yields: { ...EMPTY_YIELDS, gold: 1, science: 1 }, tileCount: 2, description: 'Iconic granite cliffs.', impassable: true },
  [NaturalWonderType.ZHANGYE_DANXIA]: { name: 'Zhangye Danxia', yields: { ...EMPTY_YIELDS }, tileCount: 3, description: 'Rainbow mountains of China.', impassable: true },
  [NaturalWonderType.BERMUDA_TRIANGLE]: { name: 'Bermuda Triangle', yields: { ...EMPTY_YIELDS, science: 5 }, tileCount: 3, description: 'Naval units gain Science.', impassable: false },
  [NaturalWonderType.CHOCOLOTE_HILLS]: { name: 'Chocolate Hills', yields: { ...EMPTY_YIELDS, food: 2, production: 1 }, tileCount: 3, description: 'Geological formation in Philippines.', impassable: false },
  [NaturalWonderType.DELICATE_ARCH]: { name: 'Delicate Arch', yields: { ...EMPTY_YIELDS, faith: 2, gold: 1 }, tileCount: 1, description: 'Utah sandstone arch.', impassable: true },
  [NaturalWonderType.EYE_OF_THE_SAHARA]: { name: 'Eye of the Sahara', yields: { ...EMPTY_YIELDS, production: 1, science: 1 }, tileCount: 3, description: 'Richat Structure.', impassable: false },
  [NaturalWonderType.GIANTS_CAUSEWAY]: { name: "Giant's Causeway", yields: { ...EMPTY_YIELDS, culture: 2 }, tileCount: 2, description: 'Basalt columns in Ireland.', impassable: false },
  [NaturalWonderType.GOBUSTAN]: { name: 'Gobustan', yields: { ...EMPTY_YIELDS, culture: 3, production: 1 }, tileCount: 1, description: 'Ancient rock carvings.', impassable: false },
  [NaturalWonderType.HA_LONG_BAY]: { name: 'Hạ Long Bay', yields: { ...EMPTY_YIELDS, food: 1, culture: 1, production: 1 }, tileCount: 2, description: 'Limestone karsts of Vietnam.', impassable: false },
  [NaturalWonderType.IK_KIL]: { name: 'Ik-Kil', yields: { ...EMPTY_YIELDS, faith: 1, science: 1 }, tileCount: 1, description: 'Sacred cenote of Maya.', impassable: false },
  [NaturalWonderType.LAKE_RETBA]: { name: 'Lake Retba', yields: { ...EMPTY_YIELDS, culture: 2, gold: 2 }, tileCount: 1, description: 'Pink lake in Senegal.', impassable: false },
  [NaturalWonderType.MATO_TIPILA]: { name: 'Mato Tipila', yields: { ...EMPTY_YIELDS, faith: 1, production: 1 }, tileCount: 1, description: "Devil's Tower.", impassable: true },
  [NaturalWonderType.MATTERHORN]: { name: 'Matterhorn', yields: { ...EMPTY_YIELDS, culture: 1 }, tileCount: 1, description: 'Iconic Alpine peak.', impassable: true },
  [NaturalWonderType.PAMUKKALE]: { name: 'Pamukkale', yields: { ...EMPTY_YIELDS, culture: 2, gold: 2 }, tileCount: 2, description: 'Turkish travertine terraces.', impassable: false },
  [NaturalWonderType.RORAIMA]: { name: 'Mount Roraima', yields: { ...EMPTY_YIELDS, faith: 1, science: 1 }, tileCount: 4, description: 'Tabletop mountain.', impassable: true },
  [NaturalWonderType.SAHARA_EL_BEYDA]: { name: 'Sahara el Beyda', yields: { ...EMPTY_YIELDS, culture: 2, gold: 2 }, tileCount: 4, description: 'White Desert of Egypt.', impassable: false },
  [NaturalWonderType.UBSUNUR_HOLLOW]: { name: 'Ubsunur Hollow', yields: { ...EMPTY_YIELDS, faith: 2, production: 1 }, tileCount: 4, description: 'UNESCO biosphere reserve.', impassable: false },
  [NaturalWonderType.ULURU]: { name: 'Uluru', yields: { ...EMPTY_YIELDS, culture: 2, faith: 2 }, tileCount: 1, description: 'Sacred Australian monolith.', impassable: true },
  [NaturalWonderType.VESUVIUS]: { name: 'Mount Vesuvius', yields: { ...EMPTY_YIELDS }, tileCount: 1, description: 'Active volcano near Naples.', impassable: true },
  [NaturalWonderType.VINLAND]: { name: 'Vinland', yields: { ...EMPTY_YIELDS, culture: 1, food: 2 }, tileCount: 2, description: 'Viking settlement site.', impassable: false },
  [NaturalWonderType.WHITE_DESERT]: { name: 'White Desert', yields: { ...EMPTY_YIELDS, culture: 1, science: 1 }, tileCount: 2, description: 'Chalk formations in Egypt.', impassable: false },
};

