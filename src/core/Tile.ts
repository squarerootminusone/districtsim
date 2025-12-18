import {
  TerrainType,
  TerrainModifier,
  FeatureType,
  ResourceType,
  ResourceCategory,
  DistrictType,
  WonderType,
  NaturalWonderType,
  ImprovementType,
  Yields,
  EMPTY_YIELDS,
  HexCoord,
} from './types';
import { TERRAIN_DATA, FEATURE_DATA, RESOURCE_DATA, DISTRICT_DATA } from './gameData';

/**
 * Represents a single hexagonal tile in the Civ6 map
 */
export class Tile {
  public readonly coord: HexCoord;
  
  // Terrain
  private _terrain: TerrainType = TerrainType.GRASS;
  private _modifier: TerrainModifier = TerrainModifier.FLAT;
  
  // Features & Resources
  private _feature: FeatureType = FeatureType.NONE;
  private _resource: ResourceType = ResourceType.NONE;
  
  // Districts & Improvements
  private _district: DistrictType = DistrictType.NONE;
  private _wonder: WonderType = WonderType.NONE;
  private _naturalWonder: NaturalWonderType = NaturalWonderType.NONE;
  private _improvement: ImprovementType = ImprovementType.NONE;
  
  // Rivers (which edges have rivers)
  private _riverEdges: Set<number> = new Set(); // 0-5 for each hex edge
  
  // City ownership
  private _ownerCityId: string | null = null;
  private _isCityCenter: boolean = false;

  constructor(coord: HexCoord) {
    this.coord = coord;
  }

  // ============================================================================
  // GETTERS
  // ============================================================================

  get terrain(): TerrainType {
    return this._terrain;
  }

  get modifier(): TerrainModifier {
    return this._modifier;
  }

  get feature(): FeatureType {
    return this._feature;
  }

  get resource(): ResourceType {
    return this._resource;
  }

  get district(): DistrictType {
    return this._district;
  }

  get wonder(): WonderType {
    return this._wonder;
  }

  get naturalWonder(): NaturalWonderType {
    return this._naturalWonder;
  }

  get improvement(): ImprovementType {
    return this._improvement;
  }

  get riverEdges(): Set<number> {
    return new Set(this._riverEdges);
  }

  get ownerCityId(): string | null {
    return this._ownerCityId;
  }

  get isCityCenter(): boolean {
    return this._isCityCenter;
  }

  // ============================================================================
  // SETTERS WITH VALIDATION
  // ============================================================================

  setTerrain(terrain: TerrainType, modifier: TerrainModifier = TerrainModifier.FLAT): this {
    // Mountains can only be on land terrain
    if (modifier === TerrainModifier.MOUNTAIN) {
      if (terrain === TerrainType.COAST || terrain === TerrainType.OCEAN) {
        throw new Error('Mountains cannot be placed on water tiles');
      }
    }
    
    // Hills cannot be on water
    if (modifier === TerrainModifier.HILLS) {
      if (terrain === TerrainType.COAST || terrain === TerrainType.OCEAN) {
        throw new Error('Hills cannot be placed on water tiles');
      }
    }
    
    this._terrain = terrain;
    this._modifier = modifier;
    return this;
  }

  setFeature(feature: FeatureType): this {
    // Skip validation for NONE (clearing feature)
    if (feature !== FeatureType.NONE) {
      // Validate feature placement
      const featureData = FEATURE_DATA[feature];
      if (featureData && !featureData.validTerrains.includes(this._terrain)) {
        throw new Error(`${feature} cannot be placed on ${this._terrain}`);
      }
    }
    
    this._feature = feature;
    return this;
  }

  setResource(resource: ResourceType): this {
    this._resource = resource;
    return this;
  }

  setDistrict(district: DistrictType): this {
    // Cannot place districts on mountains (except some special cases)
    if (this._modifier === TerrainModifier.MOUNTAIN && district !== DistrictType.NONE) {
      throw new Error('Districts cannot be placed on mountains');
    }
    
    // Cannot place most districts on water
    if ((this._terrain === TerrainType.COAST || this._terrain === TerrainType.OCEAN) 
        && district !== DistrictType.NONE 
        && district !== DistrictType.HARBOR
        && district !== DistrictType.WATER_PARK) {
      throw new Error('Only Harbor and Water Park can be placed on water');
    }
    
    this._district = district;
    
    // Clear improvement when placing district
    if (district !== DistrictType.NONE) {
      this._improvement = ImprovementType.NONE;
      this._feature = FeatureType.NONE; // Districts remove features
    }
    
    return this;
  }

  setWonder(wonder: WonderType): this {
    this._wonder = wonder;
    if (wonder !== WonderType.NONE) {
      this._improvement = ImprovementType.NONE;
    }
    return this;
  }

  setNaturalWonder(naturalWonder: NaturalWonderType): this {
    this._naturalWonder = naturalWonder;
    return this;
  }

  setImprovement(improvement: ImprovementType): this {
    if (this._district !== DistrictType.NONE || this._wonder !== WonderType.NONE) {
      throw new Error('Cannot place improvements on districts or wonders');
    }
    this._improvement = improvement;
    return this;
  }

  addRiverEdge(edge: number): this {
    if (edge < 0 || edge > 5) {
      throw new Error('River edge must be between 0 and 5');
    }
    this._riverEdges.add(edge);
    return this;
  }

  removeRiverEdge(edge: number): this {
    this._riverEdges.delete(edge);
    return this;
  }

  setOwner(cityId: string | null, isCityCenter: boolean = false): this {
    this._ownerCityId = cityId;
    this._isCityCenter = isCityCenter;
    if (isCityCenter) {
      this._district = DistrictType.CITY_CENTER;
    }
    return this;
  }

  // ============================================================================
  // COMPUTED PROPERTIES
  // ============================================================================

  get isWater(): boolean {
    return this._terrain === TerrainType.COAST || this._terrain === TerrainType.OCEAN;
  }

  get isLand(): boolean {
    return !this.isWater;
  }

  get isPassable(): boolean {
    return this._modifier !== TerrainModifier.MOUNTAIN 
      && this._naturalWonder === NaturalWonderType.NONE;
  }

  get hasRiver(): boolean {
    return this._riverEdges.size > 0;
  }

  get isHill(): boolean {
    return this._modifier === TerrainModifier.HILLS;
  }

  get isMountain(): boolean {
    return this._modifier === TerrainModifier.MOUNTAIN;
  }

  get hasDistrict(): boolean {
    return this._district !== DistrictType.NONE;
  }

  get hasWonder(): boolean {
    return this._wonder !== WonderType.NONE;
  }

  get hasNaturalWonder(): boolean {
    return this._naturalWonder !== NaturalWonderType.NONE;
  }

  get resourceCategory(): ResourceCategory {
    if (this._resource === ResourceType.NONE) {
      return ResourceCategory.NONE;
    }
    return RESOURCE_DATA[this._resource]?.category ?? ResourceCategory.NONE;
  }

  /**
   * Calculate base yields from terrain, features, and resources
   */
  get baseYields(): Yields {
    const yields = { ...EMPTY_YIELDS };
    
    // Terrain yields
    const terrainData = TERRAIN_DATA[this._terrain];
    if (terrainData) {
      yields.food += terrainData.yields.food;
      yields.production += terrainData.yields.production;
      yields.gold += terrainData.yields.gold;
    }
    
    // Modifier yields (hills)
    if (this._modifier === TerrainModifier.HILLS) {
      yields.production += 1;
    }
    
    // Feature yields
    const featureData = FEATURE_DATA[this._feature];
    if (featureData) {
      yields.food += featureData.yields.food;
      yields.production += featureData.yields.production;
      yields.gold += featureData.yields.gold;
    }
    
    // Resource yields
    const resourceData = RESOURCE_DATA[this._resource];
    if (resourceData) {
      yields.food += resourceData.yields.food;
      yields.production += resourceData.yields.production;
      yields.gold += resourceData.yields.gold;
    }
    
    return yields;
  }

  // ============================================================================
  // SERIALIZATION
  // ============================================================================

  toJSON(): TileData {
    return {
      coord: this.coord,
      terrain: this._terrain,
      modifier: this._modifier,
      feature: this._feature,
      resource: this._resource,
      district: this._district,
      wonder: this._wonder,
      naturalWonder: this._naturalWonder,
      improvement: this._improvement,
      riverEdges: Array.from(this._riverEdges),
      ownerCityId: this._ownerCityId,
      isCityCenter: this._isCityCenter,
    };
  }

  static fromJSON(data: TileData): Tile {
    const tile = new Tile(data.coord);
    tile._terrain = data.terrain;
    tile._modifier = data.modifier;
    tile._feature = data.feature;
    tile._resource = data.resource;
    tile._district = data.district;
    tile._wonder = data.wonder;
    tile._naturalWonder = data.naturalWonder;
    tile._improvement = data.improvement;
    tile._riverEdges = new Set(data.riverEdges);
    tile._ownerCityId = data.ownerCityId;
    tile._isCityCenter = data.isCityCenter;
    return tile;
  }

  /**
   * Get a human-readable description of the tile
   */
  getDescription(): string {
    const parts: string[] = [];
    
    // Terrain
    let terrainDesc = this._terrain.replace('_', ' ');
    if (this._modifier !== TerrainModifier.FLAT) {
      terrainDesc += ` ${this._modifier}`;
    }
    parts.push(terrainDesc);
    
    // Feature
    if (this._feature !== FeatureType.NONE) {
      parts.push(`with ${this._feature.replace('_', ' ')}`);
    }
    
    // River
    if (this.hasRiver) {
      parts.push('(river)');
    }
    
    // Resource
    if (this._resource !== ResourceType.NONE) {
      parts.push(`[${this._resource.replace('_', ' ')}]`);
    }
    
    // District
    if (this._district !== DistrictType.NONE) {
      parts.push(`{${this._district.replace('_', ' ')}}`);
    }
    
    // Wonder
    if (this._wonder !== WonderType.NONE) {
      parts.push(`<${this._wonder.replace('_', ' ')}>`);
    }
    
    return parts.join(' ');
  }
}

/**
 * Serialized tile data
 */
export interface TileData {
  coord: HexCoord;
  terrain: TerrainType;
  modifier: TerrainModifier;
  feature: FeatureType;
  resource: ResourceType;
  district: DistrictType;
  wonder: WonderType;
  naturalWonder: NaturalWonderType;
  improvement: ImprovementType;
  riverEdges: number[];
  ownerCityId: string | null;
  isCityCenter: boolean;
}

