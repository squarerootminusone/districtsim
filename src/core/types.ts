/**
 * Core types for Civilization 6 District Simulator
 */

// ============================================================================
// TERRAIN TYPES
// ============================================================================

export enum TerrainType {
  GRASS = 'grass',
  PLAINS = 'plains',
  DESERT = 'desert',
  TUNDRA = 'tundra',
  SNOW = 'snow',
  COAST = 'coast',
  OCEAN = 'ocean',
}

export enum TerrainModifier {
  FLAT = 'flat',
  HILLS = 'hills',
  MOUNTAIN = 'mountain',
}

// ============================================================================
// FEATURES
// ============================================================================

export enum FeatureType {
  NONE = 'none',
  WOODS = 'forest',
  RAINFOREST = 'jungle',
  MARSH = 'marsh',
  FLOODPLAINS = 'floodplains',
  OASIS = 'oasis',
  REEF = 'reef',
  ICE = 'ice',
  VOLCANO = 'volcano',
  GEOTHERMAL_FISSURE = 'geothermal_fissure',
}

// ============================================================================
// RESOURCES
// ============================================================================

export enum ResourceCategory {
  NONE = 'none',
  BONUS = 'bonus',
  LUXURY = 'luxury',
  STRATEGIC = 'strategic',
}

export enum ResourceType {
  NONE = 'none',
  // Bonus Resources
  BANANAS = 'bananas',
  CATTLE = 'cattle',
  COPPER = 'copper',
  CRABS = 'crabs',
  DEER = 'deer',
  FISH = 'fish',
  MAIZE = 'maize',
  RICE = 'rice',
  SHEEP = 'sheep',
  STONE = 'stone',
  WHEAT = 'wheat',
  // Luxury Resources
  AMBER = 'amber',
  CITRUS = 'citrus',
  COCOA = 'cocoa',
  COFFEE = 'coffee',
  COTTON = 'cotton',
  DIAMONDS = 'diamonds',
  DYES = 'dyes',
  FURS = 'furs',
  GYPSUM = 'gypsum',
  HONEY = 'honey',
  INCENSE = 'incense',
  IVORY = 'ivory',
  JADE = 'jade',
  MARBLE = 'marble',
  MERCURY = 'mercury',
  PEARLS = 'pearls',
  SALT = 'salt',
  SILK = 'silk',
  SILVER = 'silver',
  SPICES = 'spices',
  SUGAR = 'sugar',
  TEA = 'tea',
  TOBACCO = 'tobacco',
  TRUFFLES = 'truffles',
  WHALES = 'whales',
  WINE = 'wine',
  // Strategic Resources
  HORSES = 'horses',
  IRON = 'iron',
  NITER = 'niter',
  COAL = 'coal',
  OIL = 'oil',
  ALUMINUM = 'aluminum',
  URANIUM = 'uranium',
}

// ============================================================================
// DISTRICTS
// ============================================================================

export enum DistrictType {
  NONE = 'none',
  CITY_CENTER = 'city_center',
  HOLY_SITE = 'holy_site',
  CAMPUS = 'campus',
  THEATER_SQUARE = 'theater_square',
  COMMERCIAL_HUB = 'commercial_hub',
  HARBOR = 'harbor',
  INDUSTRIAL_ZONE = 'industrial_zone',
  ENTERTAINMENT_COMPLEX = 'entertainment_complex',
  WATER_PARK = 'water_park',
  AQUEDUCT = 'aqueduct',
  NEIGHBORHOOD = 'neighborhood',
  SPACEPORT = 'spaceport',
  AERODROME = 'aerodrome',
  ENCAMPMENT = 'encampment',
  GOVERNMENT_PLAZA = 'government_plaza',
  DIPLOMATIC_QUARTER = 'diplomatic_quarter',
  PRESERVE = 'preserve',
  DAM = 'dam',
  CANAL = 'canal',
}

// ============================================================================
// WONDERS
// ============================================================================

export enum WonderType {
  NONE = 'none',
  // Ancient Era
  STONEHENGE = 'stonehenge',
  PYRAMIDS = 'pyramids',
  HANGING_GARDENS = 'hanging_gardens',
  ORACLE = 'oracle',
  GREAT_BATH = 'great_bath',
  TEMPLE_OF_ARTEMIS = 'temple_of_artemis',
  ETEMENANKI = 'etemenanki',
  // Classical Era
  COLOSSEUM = 'colosseum',
  COLOSSUS = 'colossus',
  GREAT_LIBRARY = 'great_library',
  GREAT_LIGHTHOUSE = 'great_lighthouse',
  JEBEL_BARKAL = 'jebel_barkal',
  MAHABODHI_TEMPLE = 'mahabodhi_temple',
  MAUSOLEUM_AT_HALICARNASSUS = 'mausoleum_at_halicarnassus',
  PETRA = 'petra',
  TERRACOTTA_ARMY = 'terracotta_army',
  APADANA = 'apadana',
  STATUE_OF_ZEUS = 'statue_of_zeus',
  // Medieval Era
  ALHAMBRA = 'alhambra',
  ANGKOR_WAT = 'angkor_wat',
  CHICHEN_ITZA = 'chichen_itza',
  HAGIA_SOPHIA = 'hagia_sophia',
  KILWA_KISIWANI = 'kilwa_kisiwani',
  KOTOKU_IN = 'kotoku_in',
  MEENAKSHI_TEMPLE = 'meenakshi_temple',
  MONT_ST_MICHEL = 'mont_st_michel',
  UNIVERSIDAD_DE_SALAMANCA = 'universidad_de_salamanca',
  // Renaissance Era
  FORBIDDEN_CITY = 'forbidden_city',
  GREAT_ZIMBABWE = 'great_zimbabwe',
  HUEY_TEOCALLI = 'huey_teocalli',
  POTALA_PALACE = 'potala_palace',
  ST_BASILS_CATHEDRAL = 'st_basils_cathedral',
  TAJ_MAHAL = 'taj_mahal',
  TORRE_DE_BELEM = 'torre_de_belem',
  VENETIAN_ARSENAL = 'venetian_arsenal',
  // Industrial Era
  BIG_BEN = 'big_ben',
  BOLSHOI_THEATRE = 'bolshoi_theatre',
  HERMITAGE = 'hermitage',
  OXFORD_UNIVERSITY = 'oxford_university',
  RUHR_VALLEY = 'ruhr_valley',
  STATUE_OF_LIBERTY = 'statue_of_liberty',
  // Modern Era
  BROADWAY = 'broadway',
  CRISTO_REDENTOR = 'cristo_redentor',
  EIFFEL_TOWER = 'eiffel_tower',
  GOLDEN_GATE_BRIDGE = 'golden_gate_bridge',
  PANAMA_CANAL = 'panama_canal',
  // Atomic Era
  BIOSPHERE = 'biosphere',
  ESTÁDIO_DO_MARACANÃ = 'estadio_do_maracana',
  SYDNEY_OPERA_HOUSE = 'sydney_opera_house',
  // Information Era
  AMUNDSEN_SCOTT_RESEARCH_STATION = 'amundsen_scott_research_station',
}

// ============================================================================
// NATURAL WONDERS
// ============================================================================

export enum NaturalWonderType {
  NONE = 'none',
  CLIFFS_OF_DOVER = 'cliffs_of_dover',
  CRATER_LAKE = 'crater_lake',
  DEAD_SEA = 'dead_sea',
  EVEREST = 'everest',
  GALAPAGOS_ISLANDS = 'galapagos_islands',
  GREAT_BARRIER_REEF = 'great_barrier_reef',
  KILIMANJARO = 'kilimanjaro',
  PANTANAL = 'pantanal',
  PIOPIOTAHI = 'piopiotahi',
  TORRES_DEL_PAINE = 'torres_del_paine',
  TSINGY_DE_BEMARAHA = 'tsingy_de_bemaraha',
  YOSEMITE = 'yosemite',
  ZHANGYE_DANXIA = 'zhangye_danxia',
  BERMUDA_TRIANGLE = 'bermuda_triangle',
  CHOCOLOTE_HILLS = 'chocolate_hills',
  DELICATE_ARCH = 'delicate_arch',
  EYE_OF_THE_SAHARA = 'eye_of_the_sahara',
  GIANTS_CAUSEWAY = 'giants_causeway',
  GOBUSTAN = 'gobustan',
  HA_LONG_BAY = 'ha_long_bay',
  IK_KIL = 'ik_kil',
  LAKE_RETBA = 'lake_retba',
  MATO_TIPILA = 'mato_tipila',
  MATTERHORN = 'matterhorn',
  PAMUKKALE = 'pamukkale',
  RORAIMA = 'roraima',
  SAHARA_EL_BEYDA = 'sahara_el_beyda',
  UBSUNUR_HOLLOW = 'ubsunur_hollow',
  ULURU = 'uluru',
  VESUVIUS = 'vesuvius',
  VINLAND = 'vinland',
  WHITE_DESERT = 'white_desert',
}

// ============================================================================
// IMPROVEMENTS
// ============================================================================

export enum ImprovementType {
  NONE = 'none',
  FARM = 'farm',
  MINE = 'mine',
  QUARRY = 'quarry',
  LUMBER_MILL = 'lumber_mill',
  PASTURE = 'pasture',
  PLANTATION = 'plantation',
  CAMP = 'camp',
  FISHING_BOATS = 'fishing_boats',
  OIL_WELL = 'oil_well',
  OFFSHORE_OIL_RIG = 'offshore_oil_rig',
}

// ============================================================================
// YIELDS
// ============================================================================

export interface Yields {
  food: number;
  production: number;
  gold: number;
  science: number;
  culture: number;
  faith: number;
}

export const EMPTY_YIELDS: Yields = {
  food: 0,
  production: 0,
  gold: 0,
  science: 0,
  culture: 0,
  faith: 0,
};

// ============================================================================
// HEX COORDINATES
// ============================================================================

/**
 * Axial coordinate system for hexagonal grids
 * Using "pointy-top" hex orientation
 */
export interface HexCoord {
  q: number; // column
  r: number; // row
}

/**
 * Cube coordinates (derived from axial)
 * q + r + s = 0
 */
export interface CubeCoord {
  q: number;
  r: number;
  s: number;
}

// ============================================================================
// ADJACENCY BONUS TYPES
// ============================================================================

export interface AdjacencyBonus {
  districtType: DistrictType;
  yieldType: keyof Yields;
  amount: number;
  source: string;
}

