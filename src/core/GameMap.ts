import { HexCoord, CubeCoord } from './types';
import { Tile, TileData } from './Tile';

/**
 * Hexagonal map utility functions
 */
export class HexUtils {
  /**
   * Convert axial coordinates to cube coordinates
   */
  static axialToCube(coord: HexCoord): CubeCoord {
    return {
      q: coord.q,
      r: coord.r,
      s: -coord.q - coord.r,
    };
  }

  /**
   * Convert cube coordinates to axial coordinates
   */
  static cubeToAxial(coord: CubeCoord): HexCoord {
    return {
      q: coord.q,
      r: coord.r,
    };
  }

  /**
   * Get the 6 neighboring hex coordinates (pointy-top orientation)
   * Direction 0 = East, going counter-clockwise
   */
  static getNeighbors(coord: HexCoord): HexCoord[] {
    const directions: [number, number][] = [
      [1, 0],   // 0: East
      [0, 1],   // 1: Southeast
      [-1, 1],  // 2: Southwest
      [-1, 0],  // 3: West
      [0, -1],  // 4: Northwest
      [1, -1],  // 5: Northeast
    ];

    return directions.map(([dq, dr]) => ({
      q: coord.q + dq,
      r: coord.r + dr,
    }));
  }

  /**
   * Get neighbor in a specific direction (0-5)
   */
  static getNeighborInDirection(coord: HexCoord, direction: number): HexCoord {
    const neighbors = this.getNeighbors(coord);
    return neighbors[direction % 6];
  }

  /**
   * Calculate hex distance between two coordinates
   */
  static distance(a: HexCoord, b: HexCoord): number {
    const cubeA = this.axialToCube(a);
    const cubeB = this.axialToCube(b);
    return Math.max(
      Math.abs(cubeA.q - cubeB.q),
      Math.abs(cubeA.r - cubeB.r),
      Math.abs(cubeA.s - cubeB.s)
    );
  }

  /**
   * Get all hexes within a given range
   */
  static getHexesInRange(center: HexCoord, range: number): HexCoord[] {
    const results: HexCoord[] = [];
    
    for (let q = -range; q <= range; q++) {
      for (let r = Math.max(-range, -q - range); r <= Math.min(range, -q + range); r++) {
        results.push({
          q: center.q + q,
          r: center.r + r,
        });
      }
    }
    
    return results;
  }

  /**
   * Get hexes in a ring at exactly the given distance
   */
  static getHexRing(center: HexCoord, radius: number): HexCoord[] {
    if (radius === 0) return [center];
    
    const results: HexCoord[] = [];
    let current = { q: center.q - radius, r: center.r + radius };
    
    const directions: [number, number][] = [
      [1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]
    ];
    
    for (const [dq, dr] of directions) {
      for (let i = 0; i < radius; i++) {
        results.push({ ...current });
        current = { q: current.q + dq, r: current.r + dr };
      }
    }
    
    return results;
  }

  /**
   * Convert hex coordinate to unique string key
   */
  static coordToKey(coord: HexCoord): string {
    return `${coord.q},${coord.r}`;
  }

  /**
   * Parse string key back to hex coordinate
   */
  static keyToCoord(key: string): HexCoord {
    const [q, r] = key.split(',').map(Number);
    return { q, r };
  }

  /**
   * Convert hex coordinates to pixel position (for rendering)
   * Using pointy-top hexes
   */
  static hexToPixel(coord: HexCoord, size: number): { x: number; y: number } {
    const x = size * (Math.sqrt(3) * coord.q + Math.sqrt(3) / 2 * coord.r);
    const y = size * (3 / 2 * coord.r);
    return { x, y };
  }

  /**
   * Convert pixel position to hex coordinates
   */
  static pixelToHex(x: number, y: number, size: number): HexCoord {
    const q = (Math.sqrt(3) / 3 * x - 1 / 3 * y) / size;
    const r = (2 / 3 * y) / size;
    return this.roundHex({ q, r });
  }

  /**
   * Round fractional hex coordinates to nearest hex
   */
  static roundHex(coord: { q: number; r: number }): HexCoord {
    const cube = {
      q: coord.q,
      r: coord.r,
      s: -coord.q - coord.r,
    };

    let rq = Math.round(cube.q);
    let rr = Math.round(cube.r);
    let rs = Math.round(cube.s);

    const qDiff = Math.abs(rq - cube.q);
    const rDiff = Math.abs(rr - cube.r);
    const sDiff = Math.abs(rs - cube.s);

    if (qDiff > rDiff && qDiff > sDiff) {
      rq = -rr - rs;
    } else if (rDiff > sDiff) {
      rr = -rq - rs;
    }

    return { q: rq, r: rr };
  }
}

/**
 * Represents a Civ6 game map
 */
export class GameMap {
  private tiles: Map<string, Tile> = new Map();
  private _width: number;
  private _height: number;
  private _name: string;

  constructor(width: number, height: number, name: string = 'Untitled Map') {
    this._width = width;
    this._height = height;
    this._name = name;
    this.initializeEmptyMap();
  }

  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  /**
   * Initialize the map with default grass tiles
   */
  private initializeEmptyMap(): void {
    for (let r = 0; r < this._height; r++) {
      // Offset for pointy-top hexes to create rectangular map
      const qOffset = Math.floor(r / 2);
      for (let q = -qOffset; q < this._width - qOffset; q++) {
        const coord: HexCoord = { q, r };
        const tile = new Tile(coord);
        this.tiles.set(HexUtils.coordToKey(coord), tile);
      }
    }
  }

  /**
   * Get a tile at the specified coordinates
   */
  getTile(coord: HexCoord): Tile | undefined {
    return this.tiles.get(HexUtils.coordToKey(coord));
  }

  /**
   * Get a tile by key string
   */
  getTileByKey(key: string): Tile | undefined {
    return this.tiles.get(key);
  }

  /**
   * Set or replace a tile
   */
  setTile(tile: Tile): void {
    this.tiles.set(HexUtils.coordToKey(tile.coord), tile);
  }

  /**
   * Check if coordinates are within map bounds
   */
  isInBounds(coord: HexCoord): boolean {
    return this.tiles.has(HexUtils.coordToKey(coord));
  }

  /**
   * Get all tiles
   */
  getAllTiles(): Tile[] {
    return Array.from(this.tiles.values());
  }

  /**
   * Get all tiles as entries (key, tile)
   */
  getAllTileEntries(): [string, Tile][] {
    return Array.from(this.tiles.entries());
  }

  /**
   * Get neighboring tiles that exist on the map
   */
  getNeighborTiles(coord: HexCoord): Tile[] {
    return HexUtils.getNeighbors(coord)
      .map(nc => this.getTile(nc))
      .filter((t): t is Tile => t !== undefined);
  }

  /**
   * Get tiles within a certain range of a coordinate
   */
  getTilesInRange(coord: HexCoord, range: number): Tile[] {
    return HexUtils.getHexesInRange(coord, range)
      .map(c => this.getTile(c))
      .filter((t): t is Tile => t !== undefined);
  }

  /**
   * Get tiles in a city's workable range (3 tiles from city center)
   */
  getCityWorkableTiles(cityCenter: HexCoord): Tile[] {
    return this.getTilesInRange(cityCenter, 3);
  }

  /**
   * Find all tiles with a specific district
   */
  findTilesWithDistrict(districtType: string): Tile[] {
    return this.getAllTiles().filter(t => t.district === districtType);
  }

  /**
   * Find the city center tile (if any)
   */
  findCityCenter(): Tile | undefined {
    return this.getAllTiles().find(t => t.isCityCenter);
  }

  /**
   * Serialize map to JSON
   */
  toJSON(): GameMapData {
    return {
      version: 1,
      name: this._name,
      width: this._width,
      height: this._height,
      tiles: this.getAllTiles().map(t => t.toJSON()),
    };
  }

  /**
   * Deserialize map from JSON
   */
  static fromJSON(data: GameMapData): GameMap {
    const map = new GameMap(data.width, data.height, data.name);
    map.tiles.clear();
    
    for (const tileData of data.tiles) {
      const tile = Tile.fromJSON(tileData);
      map.tiles.set(HexUtils.coordToKey(tile.coord), tile);
    }
    
    return map;
  }

  /**
   * Export to JSON string
   */
  exportToString(): string {
    return JSON.stringify(this.toJSON(), null, 2);
  }

  /**
   * Import from JSON string
   */
  static importFromString(jsonString: string): GameMap {
    const data = JSON.parse(jsonString) as GameMapData;
    return GameMap.fromJSON(data);
  }
}

/**
 * Serialized map data
 */
export interface GameMapData {
  version: number;
  name: string;
  width: number;
  height: number;
  tiles: TileData[];
}

