/**
 * Civ6 Icon Paths
 * 
 * Local icons stored in /public/icons/
 * All icons are .webp format
 * 
 * Folder structure:
 * - /icons/districts/        - All district icons
 * - /icons/terrain/          - Terrain and feature icons
 * - /icons/resources/
 *   - /bonus/               - Bonus resources
 *   - /luxury/              - Luxury resources
 *   - /strategic/           - Strategic resources
 * - /icons/player_wonders/   - Player-built wonders
 * - /icons/natural_wonders/  - Natural wonders
 */

// ============================================================================
// DISTRICT ICONS
// ============================================================================

export const DISTRICT_ICONS = {
  city_center: '/icons/districts/city_center.webp',
  campus: '/icons/districts/campus.webp',
  holy_site: '/icons/districts/holy_site.webp',
  theater_square: '/icons/districts/theater_square.webp',
  commercial_hub: '/icons/districts/commercial_hub.webp',
  harbor: '/icons/districts/harbor.webp',
  industrial_zone: '/icons/districts/industrial_zone.webp',
  entertainment_complex: '/icons/districts/entertainment_complex.webp',
  water_park: '/icons/districts/entertainment_complex.webp',
  aqueduct: '/icons/districts/aqueduct.webp',
  neighborhood: '/icons/districts/neighborhood.webp',
  spaceport: '/icons/districts/spaceport.webp',
  aerodrome: '/icons/districts/aerodrome.webp',
  encampment: '/icons/districts/encampment.webp',
  government_plaza: '/icons/districts/government_plaza.webp',
  diplomatic_quarter: '/icons/districts/diplomatic_quarter.webp',
  preserve: '/icons/districts/preserve.webp', 
  dam: '/icons/districts/dam.webp',
  canal: '/icons/districts/canal.webp',
  street_carnival: '/icons/districts/street_carnival.webp',
  // Unique districts
  hansa: '/icons/districts/hansa.webp',
  lavra: '/icons/districts/lavra.webp',
  acropolis: '/icons/districts/acropolis.webp',
  bath: '/icons/districts/bath.webp',
  mbanza: '/icons/districts/mbanza.webp',
  royal_navy_dockyard: '/icons/districts/royal_navy_dockyard.webp',
  // Generic
  district: '/icons/districts/wonder.webp',
  wonder: '/icons/districts/wonder.webp',
} as const;

// ============================================================================
// TERRAIN ICONS (includes features)
// ============================================================================

export const TERRAIN_ICONS = {
  // Base terrain
  grass: '/icons/terrain/grass.webp',
  grass_hills: '/icons/terrain/grass_hills.webp',
  grass_mountain: '/icons/terrain/grass_mountain.webp',
  plains: '/icons/terrain/plains.webp',
  plains_hills: '/icons/terrain/plains_hills.webp',
  plains_mountain: '/icons/terrain/plains_mountain.webp',
  desert: '/icons/terrain/desert.webp',
  desert_hills: '/icons/terrain/desert_hills.webp',
  desert_mountain: '/icons/terrain/desert_mountain.webp',
  tundra: '/icons/terrain/tundra.webp',
  tundra_hills: '/icons/terrain/tundra_hills.webp',
  tundra_mountain: '/icons/terrain/tundra_mountain.webp',
  snow: '/icons/terrain/snow.webp',
  snow_hills: '/icons/terrain/snow_hills.webp',
  snow_mountain: '/icons/terrain/snow_mountain.webp',
  coast: '/icons/terrain/coast.webp',
  ocean: '/icons/terrain/ocean.webp',
  mountain: '/icons/terrain/mountain.webp',
} as const;

// ============================================================================
// FEATURE ICONS
// ============================================================================

export const FEATURE_ICONS = {
  forest: '/icons/terrain/forest.webp',
  jungle: '/icons/terrain/jungle.webp',
  marsh: '/icons/terrain/marsh.webp',
  floodplains: '/icons/terrain/floodplains.webp',
  oasis: '/icons/terrain/oasis.webp',
  ice: '/icons/terrain/ice.webp',
  reef: '/icons/terrain/coast.webp', // Using coast as fallback
  volcano: '/icons/terrain/mountain.webp', // Using mountain as fallback
  geothermal_fissure: '/icons/terrain/marsh.webp', // Using marsh as fallback
} as const;

// ============================================================================
// RESOURCE ICONS - BONUS
// ============================================================================

export const BONUS_RESOURCE_ICONS = {
  bananas: '/icons/resources/bonus/bananas.webp',
  cattle: '/icons/resources/bonus/cattle.webp',
  copper: '/icons/resources/bonus/copper.webp',
  deer: '/icons/resources/bonus/deer.webp',
  fish: '/icons/resources/bonus/fish.webp',
  maize: '/icons/resources/bonus/maize.webp',
  rice: '/icons/resources/bonus/rice.webp',
  sheep: '/icons/resources/bonus/sheep.webp',
  stone: '/icons/resources/bonus/stone.webp',
  wheat: '/icons/resources/bonus/wheat.webp',
} as const;

// ============================================================================
// RESOURCE ICONS - LUXURY
// ============================================================================

export const LUXURY_RESOURCE_ICONS = {
  amber: '/icons/resources/luxury/amber.webp',
  citrus: '/icons/resources/luxury/citrus.webp',
  cocoa: '/icons/resources/luxury/cocoa.webp',
  coffee: '/icons/resources/luxury/coffee.webp',
  crabs: '/icons/resources/bonus/crabs.webp',
  cotton: '/icons/resources/luxury/cotton.webp',
  diamonds: '/icons/resources/luxury/diamonds.webp',
  dyes: '/icons/resources/luxury/dyes.webp',
  furs: '/icons/resources/luxury/furs.webp',
  gypsum: '/icons/resources/luxury/gypsum.webp',
  honey: '/icons/resources/luxury/honey.webp',
  incense: '/icons/resources/luxury/incense.webp',
  ivory: '/icons/resources/luxury/ivory.webp',
  jade: '/icons/resources/luxury/jade.webp',
  jeans: '/icons/resources/luxury/jeans.webp',
  marble: '/icons/resources/luxury/marble.webp',
  mercury: '/icons/resources/luxury/mercury.webp',
  pearls: '/icons/resources/luxury/pearls.webp',
  salt: '/icons/resources/luxury/salt.webp',
  silk: '/icons/resources/luxury/silk.webp',
  silver: '/icons/resources/luxury/silver.webp',
  spices: '/icons/resources/luxury/spices.webp',
  sugar: '/icons/resources/luxury/sugar.webp',
  tea: '/icons/resources/luxury/tea.webp',
  tobacco: '/icons/resources/luxury/tobacco.webp',
  toys: '/icons/resources/luxury/toys.webp',
  truffles: '/icons/resources/luxury/truffles.webp',
  whales: '/icons/resources/luxury/whales.webp',
  wine: '/icons/resources/luxury/wine.webp',
} as const;

// ============================================================================
// RESOURCE ICONS - STRATEGIC
// ============================================================================

export const STRATEGIC_RESOURCE_ICONS = {
  aluminum: '/icons/resources/strategic/aluminum.webp',
  coal: '/icons/resources/strategic/coal.webp',
  horses: '/icons/resources/strategic/horses.webp',
  iron: '/icons/resources/strategic/iron.webp',
  niter: '/icons/resources/strategic/niter.webp',
  oil: '/icons/resources/strategic/oil.webp',
  uranium: '/icons/resources/strategic/uranium.webp',
} as const;

// ============================================================================
// COMBINED RESOURCE ICONS
// ============================================================================

export const RESOURCE_ICONS = {
  ...BONUS_RESOURCE_ICONS,
  ...LUXURY_RESOURCE_ICONS,
  ...STRATEGIC_RESOURCE_ICONS,
} as const;

// ============================================================================
// PLAYER WONDER ICONS
// ============================================================================

export const WONDER_ICONS = {
  // Generic
  wonder: '/icons/districts/wonder.webp',
  // Ancient Era
  stonehenge: '/icons/player_wonders/stonehenge.webp',
  pyramids: '/icons/player_wonders/pyramids.webp',
  hanging_gardens: '/icons/player_wonders/hanging_gardens.webp',
  oracle: '/icons/player_wonders/oracle.webp',
  temple_of_artemis: '/icons/player_wonders/temple_of_artemis.webp',
  // Classical Era
  colosseum: '/icons/player_wonders/colosseum.webp',
  colossus: '/icons/player_wonders/colossus.webp',
  great_library: '/icons/player_wonders/great_library.webp',
  great_lighthouse: '/icons/player_wonders/great_lighthouse.webp',
  mahabodhi_temple: '/icons/player_wonders/mahabodhi_temple.webp',
  petra: '/icons/player_wonders/petra.webp',
  terracotta_army: '/icons/player_wonders/terracotta_army.webp',
  // Medieval Era
  alhambra: '/icons/player_wonders/alhambra.webp',
  chichen_itza: '/icons/player_wonders/chichen_itza.webp',
  hagia_sophia: '/icons/player_wonders/hagia_sophia.webp',
  mont_st_michel: '/icons/player_wonders/mont_st_michel.webp',
  // Renaissance Era
  forbidden_city: '/icons/player_wonders/forbidden_city.webp',
  great_zimbabwe: '/icons/player_wonders/great_zimbabwe.webp',
  huey_teocalli: '/icons/player_wonders/huey_teocalli.webp',
  potala_palace: '/icons/player_wonders/potala_palace.webp',
  venetian_arsenal: '/icons/player_wonders/venetian_arsenal.webp',
  taj_mahal: 'icons/player_wonders/taj_mahal.webp',
  // Industrial Era
  big_ben: '/icons/player_wonders/big_ben.webp',
  bolshoi_theatre: '/icons/player_wonders/bolshoi_theatre.webp',
  hermitage: '/icons/player_wonders/hermitage.webp',
  oxford_university: '/icons/player_wonders/oxford_university.webp',
  ruhr_valley: '/icons/player_wonders/ruhr_valley.webp',
  // Modern Era
  broadway: '/icons/player_wonders/broadway.webp',
  cristo_redentor: '/icons/player_wonders/cristo_redentor.webp',
  eiffel_tower: '/icons/player_wonders/eiffel_tower.webp',
  // Atomic Era
  estadio_do_maracana: '/icons/player_wonders/estadio_do_maracana.webp',
  sydney_opera_house: '/icons/player_wonders/sydney_opera_house.webp',
} as const;

// ============================================================================
// NATURAL WONDER ICONS
// ============================================================================

export const NATURAL_WONDER_ICONS = {
  barrier_reef: '/icons/natural_wonders/barrier_reef.webp',
  cliffs_dover: '/icons/natural_wonders/cliffs_dover.webp',
  crater_lake: '/icons/natural_wonders/crater_lake.webp',
  dead_sea: '/icons/natural_wonders/dead_sea.webp',
  everest: '/icons/natural_wonders/everest.webp',
  galapagos: '/icons/natural_wonders/galapagos.webp',
  kilimanjaro: '/icons/natural_wonders/kilimanjaro.webp',
  pantanal: '/icons/natural_wonders/pantanal.webp',
  piopiotahi: '/icons/natural_wonders/piopiotahi.webp',
  torres_del_paine: '/icons/natural_wonders/torres_del_paine.webp',
  tsingy: '/icons/natural_wonders/tsingy.webp',
  yosemite: '/icons/natural_wonders/yosemite.webp',
} as const;

// ============================================================================
// YIELD ICONS (using terrain colors as fallback until we have proper yield icons)
// ============================================================================

export const YIELD_ICONS = {
  food: '/icons/statistics/food.webp',
  production: '/icons/statistics/production.webp',
  gold: '/icons/statistics/gold.webp',
  science: '/icons/statistics/science.webp',
  culture: '/icons/statistics/culture.webp',
  faith: '/icons/statistics/faith.webp',
} as const;

// ============================================================================
// STAT ICONS (using district icons as fallback)
// ============================================================================

export const STAT_ICONS = {
  housing: '/icons/districts/city_center.webp',
  amenities: '/icons/districts/entertainment_complex.webp',
  citizen: '/icons/districts/city_center.webp',
  capital: '/icons/districts/city_center.webp',
  movement: '/icons/terrain/plains.webp',
  greatPerson: '/icons/districts/wonder.webp',
  government: '/icons/districts/city_center.webp',
  envoy: '/icons/districts/city_center.webp',
} as const;

// ============================================================================
// HELPER TYPES
// ============================================================================

export type DistrictIconKey = keyof typeof DISTRICT_ICONS;
export type TerrainIconKey = keyof typeof TERRAIN_ICONS;
export type FeatureIconKey = keyof typeof FEATURE_ICONS;
export type ResourceIconKey = keyof typeof RESOURCE_ICONS;
export type BonusResourceIconKey = keyof typeof BONUS_RESOURCE_ICONS;
export type LuxuryResourceIconKey = keyof typeof LUXURY_RESOURCE_ICONS;
export type StrategicResourceIconKey = keyof typeof STRATEGIC_RESOURCE_ICONS;
export type WonderIconKey = keyof typeof WONDER_ICONS;
export type NaturalWonderIconKey = keyof typeof NATURAL_WONDER_ICONS;
export type YieldIconKey = keyof typeof YIELD_ICONS;
