/**
 * Adjacency Bonus Calculation Engine for Civ6 Districts
 * 
 * This engine calculates adjacency bonuses based on Civilization 6 rules.
 * Reference: https://civilization.fandom.com/wiki/Adjacency_bonus_(Civ6)
 */

import { GameMap, HexUtils } from './GameMap';
import { Tile } from './Tile';
import {
  DistrictType,
  TerrainModifier,
  FeatureType,
  ResourceType,
  ResourceCategory,
  WonderType,
  ImprovementType,
  Yields,
  EMPTY_YIELDS,
  HexCoord,
  AdjacencyBonus,
} from './types';
import { RESOURCE_DATA, DISTRICT_DATA } from './gameData';

/**
 * Result of adjacency calculation for a single district
 */
export interface DistrictAdjacencyResult {
  tile: Tile;
  districtType: DistrictType;
  totalBonus: Yields;
  bonusBreakdown: AdjacencyBonus[];
}

/**
 * Result of adjacency calculation for an entire city
 */
export interface CityAdjacencyResult {
  cityCenter: HexCoord;
  districts: DistrictAdjacencyResult[];
  totalYields: Yields;
}

/**
 * Adjacency calculation engine
 */
export class AdjacencyEngine {
  private map: GameMap;

  constructor(map: GameMap) {
    this.map = map;
  }

  /**
   * Calculate all adjacency bonuses for districts within a city's range
   */
  calculateCityAdjacency(cityCenter: HexCoord): CityAdjacencyResult {
    const workableTiles = this.map.getTilesInRange(cityCenter, 3);
    const districtTiles = workableTiles.filter(t => 
      t.hasDistrict && t.district !== DistrictType.CITY_CENTER
    );

    const districts = districtTiles.map(tile => 
      this.calculateDistrictAdjacency(tile)
    );

    // Sum up total yields
    const totalYields = { ...EMPTY_YIELDS };
    for (const district of districts) {
      for (const key of Object.keys(totalYields) as (keyof Yields)[]) {
        totalYields[key] += district.totalBonus[key];
      }
    }

    return {
      cityCenter,
      districts,
      totalYields,
    };
  }

  /**
   * Calculate adjacency bonus for a single district
   */
  calculateDistrictAdjacency(tile: Tile): DistrictAdjacencyResult {
    const bonuses: AdjacencyBonus[] = [];
    const neighbors = this.map.getNeighborTiles(tile.coord);

    switch (tile.district) {
      case DistrictType.CAMPUS:
        this.calculateCampusAdjacency(tile, neighbors, bonuses);
        break;
      case DistrictType.HOLY_SITE:
        this.calculateHolySiteAdjacency(tile, neighbors, bonuses);
        break;
      case DistrictType.THEATER_SQUARE:
        this.calculateTheaterSquareAdjacency(tile, neighbors, bonuses);
        break;
      case DistrictType.COMMERCIAL_HUB:
        this.calculateCommercialHubAdjacency(tile, neighbors, bonuses);
        break;
      case DistrictType.HARBOR:
        this.calculateHarborAdjacency(tile, neighbors, bonuses);
        break;
      case DistrictType.INDUSTRIAL_ZONE:
        this.calculateIndustrialZoneAdjacency(tile, neighbors, bonuses);
        break;
      case DistrictType.PRESERVE:
        // Preserve doesn't get adjacency bonuses itself
        break;
      case DistrictType.GOVERNMENT_PLAZA:
        // Government Plaza doesn't get bonuses but gives them
        break;
    }

    // Government Plaza adjacent bonus (+1 to all yields for specialty districts)
    const govPlazaAdjacent = neighbors.some(n => n.district === DistrictType.GOVERNMENT_PLAZA);
    if (govPlazaAdjacent && DISTRICT_DATA[tile.district]?.isSpecialty) {
      const primaryYield = DISTRICT_DATA[tile.district].primaryYieldType;
      if (primaryYield) {
        bonuses.push({
          districtType: tile.district,
          yieldType: primaryYield,
          amount: 1,
          source: 'Government Plaza',
        });
      }
    }

    // Calculate total bonus
    const totalBonus = { ...EMPTY_YIELDS };
    for (const bonus of bonuses) {
      totalBonus[bonus.yieldType] += bonus.amount;
    }

    return {
      tile,
      districtType: tile.district,
      totalBonus,
      bonusBreakdown: bonuses,
    };
  }

  /**
   * Campus: +1 Science per Mountain, +1 per 2 Rainforest/districts, +2 per Geothermal Fissure/Reef
   */
  private calculateCampusAdjacency(tile: Tile, neighbors: Tile[], bonuses: AdjacencyBonus[]): void {
    let mountainCount = 0;
    let jungleCount = 0;
    let districtCount = 0;
    let reefCount = 0;
    let geothermalCount = 0;

    for (const n of neighbors) {
      if (n.isMountain) {
        mountainCount++;
      }
      if (n.feature === FeatureType.RAINFOREST) {
        jungleCount++;
      }
      if (n.feature === FeatureType.REEF) {
        reefCount++;
      }
      if (n.feature === FeatureType.GEOTHERMAL_FISSURE) {
        geothermalCount++;
      }
      if (n.hasDistrict) {
        districtCount++;
      }
    }

    if (mountainCount > 0) {
      bonuses.push({
        districtType: DistrictType.CAMPUS,
        yieldType: 'science',
        amount: mountainCount,
        source: `${mountainCount} Mountain(s)`,
      });
    }

    const halfBonusCount = Math.floor((jungleCount + districtCount) / 2);
    if (halfBonusCount > 0) {
      bonuses.push({
        districtType: DistrictType.CAMPUS,
        yieldType: 'science',
        amount: halfBonusCount,
        source: `${jungleCount} Rainforest(s), ${districtCount} District(s)`,
      });
    }

    if (geothermalCount > 0) {
      bonuses.push({
        districtType: DistrictType.CAMPUS,
        yieldType: 'science',
        amount: geothermalCount * 2,
        source: `${geothermalCount} Geothermal Fissure(s)`,
      });
    }

    if (reefCount > 0) {
      bonuses.push({
        districtType: DistrictType.CAMPUS,
        yieldType: 'science',
        amount: reefCount * 2,
        source: `${reefCount} Reef(s)`,
      });
    }
  }

  /**
   * Holy Site: +1 Faith per Mountain, +1 per 2 Woods/districts, +2 per Natural Wonder
   */
  private calculateHolySiteAdjacency(tile: Tile, neighbors: Tile[], bonuses: AdjacencyBonus[]): void {
    let mountainCount = 0;
    let forestCount = 0;
    let districtCount = 0;
    let naturalWonderCount = 0;

    for (const n of neighbors) {
      if (n.isMountain) {
        mountainCount++;
      }
      if (n.feature === FeatureType.WOODS) {
        forestCount++;
      }
      if (n.hasNaturalWonder) {
        naturalWonderCount++;
      }
      if (n.hasDistrict) {
        districtCount++;
      }
    }

    if (mountainCount > 0) {
      bonuses.push({
        districtType: DistrictType.HOLY_SITE,
        yieldType: 'faith',
        amount: mountainCount,
        source: `${mountainCount} Mountain(s)`,
      });
    }

    const halfBonusCount = Math.floor((forestCount + districtCount) / 2);
    if (halfBonusCount > 0) {
      bonuses.push({
        districtType: DistrictType.HOLY_SITE,
        yieldType: 'faith',
        amount: halfBonusCount,
        source: `${forestCount} Woods, ${districtCount} District(s)`,
      });
    }

    if (naturalWonderCount > 0) {
      bonuses.push({
        districtType: DistrictType.HOLY_SITE,
        yieldType: 'faith',
        amount: naturalWonderCount * 2,
        source: `${naturalWonderCount} Natural Wonder(s)`,
      });
    }
  }

  /**
   * Theater Square: +2 Culture per Wonder, +1 per 2 districts
   */
  private calculateTheaterSquareAdjacency(tile: Tile, neighbors: Tile[], bonuses: AdjacencyBonus[]): void {
    let wonderCount = 0;
    let districtCount = 0;

    for (const n of neighbors) {
      if (n.hasWonder) {
        wonderCount++;
      }
      if (n.hasDistrict) {
        districtCount++;
      }
    }

    if (wonderCount > 0) {
      bonuses.push({
        districtType: DistrictType.THEATER_SQUARE,
        yieldType: 'culture',
        amount: wonderCount * 2,
        source: `${wonderCount} Wonder(s)`,
      });
    }

    const halfBonusCount = Math.floor(districtCount / 2);
    if (halfBonusCount > 0) {
      bonuses.push({
        districtType: DistrictType.THEATER_SQUARE,
        yieldType: 'culture',
        amount: halfBonusCount,
        source: `${districtCount} District(s)`,
      });
    }
  }

  /**
   * Commercial Hub: +2 Gold per River edge, +2 per Harbor, +1 per 2 districts
   */
  private calculateCommercialHubAdjacency(tile: Tile, neighbors: Tile[], bonuses: AdjacencyBonus[]): void {
    let harborCount = 0;
    let districtCount = 0;

    // Check for river
    if (tile.hasRiver) {
      bonuses.push({
        districtType: DistrictType.COMMERCIAL_HUB,
        yieldType: 'gold',
        amount: 2,
        source: 'River',
      });
    }

    for (const n of neighbors) {
      if (n.district === DistrictType.HARBOR) {
        harborCount++;
      }
      if (n.hasDistrict) {
        districtCount++;
      }
    }

    if (harborCount > 0) {
      bonuses.push({
        districtType: DistrictType.COMMERCIAL_HUB,
        yieldType: 'gold',
        amount: harborCount * 2,
        source: `${harborCount} Harbor(s)`,
      });
    }

    const halfBonusCount = Math.floor(districtCount / 2);
    if (halfBonusCount > 0) {
      bonuses.push({
        districtType: DistrictType.COMMERCIAL_HUB,
        yieldType: 'gold',
        amount: halfBonusCount,
        source: `${districtCount} District(s)`,
      });
    }
  }

  /**
   * Harbor: +1 Gold per coastal resource, +2 per City Center, +1 per 2 districts
   */
  private calculateHarborAdjacency(tile: Tile, neighbors: Tile[], bonuses: AdjacencyBonus[]): void {
    let coastalResourceCount = 0;
    let cityCenterCount = 0;
    let districtCount = 0;

    for (const n of neighbors) {
      // Coastal resources (Fish, Crabs, Whales, Pearls, etc.)
      if (n.isWater && n.resource !== ResourceType.NONE) {
        coastalResourceCount++;
      }
      if (n.district === DistrictType.CITY_CENTER) {
        cityCenterCount++;
      }
      if (n.hasDistrict) {
        districtCount++;
      }
    }

    if (coastalResourceCount > 0) {
      bonuses.push({
        districtType: DistrictType.HARBOR,
        yieldType: 'gold',
        amount: coastalResourceCount,
        source: `${coastalResourceCount} Coastal Resource(s)`,
      });
    }

    if (cityCenterCount > 0) {
      bonuses.push({
        districtType: DistrictType.HARBOR,
        yieldType: 'gold',
        amount: cityCenterCount * 2,
        source: `${cityCenterCount} City Center(s)`,
      });
    }

    const halfBonusCount = Math.floor(districtCount / 2);
    if (halfBonusCount > 0) {
      bonuses.push({
        districtType: DistrictType.HARBOR,
        yieldType: 'gold',
        amount: halfBonusCount,
        source: `${districtCount} District(s)`,
      });
    }
  }

  /**
   * Industrial Zone: +1 Production per Mine/Quarry, +2 per Aqueduct/Canal/Dam, +1 per 2 districts
   */
  private calculateIndustrialZoneAdjacency(tile: Tile, neighbors: Tile[], bonuses: AdjacencyBonus[]): void {
    let mineCount = 0;
    let quarryCount = 0;
    let aqueductCount = 0;
    let damCount = 0;
    let canalCount = 0;
    let districtCount = 0;
    let strategicResourceCount = 0;

    for (const n of neighbors) {
      if (n.improvement === ImprovementType.MINE) {
        mineCount++;
      }
      if (n.improvement === ImprovementType.QUARRY) {
        quarryCount++;
      }
      if (n.district === DistrictType.AQUEDUCT) {
        aqueductCount++;
      }
      if (n.district === DistrictType.DAM) {
        damCount++;
      }
      if (n.district === DistrictType.CANAL) {
        canalCount++;
      }
      if (n.hasDistrict) {
        districtCount++;
      }
      // Strategic resources also provide bonus
      const resourceData = RESOURCE_DATA[n.resource];
      if (resourceData?.category === ResourceCategory.STRATEGIC) {
        strategicResourceCount++;
      }
    }

    if (mineCount > 0) {
      bonuses.push({
        districtType: DistrictType.INDUSTRIAL_ZONE,
        yieldType: 'production',
        amount: mineCount,
        source: `${mineCount} Mine(s)`,
      });
    }

    if (quarryCount > 0) {
      bonuses.push({
        districtType: DistrictType.INDUSTRIAL_ZONE,
        yieldType: 'production',
        amount: quarryCount,
        source: `${quarryCount} Quarry(ies)`,
      });
    }

    const waterInfraBonus = (aqueductCount + damCount + canalCount) * 2;
    if (waterInfraBonus > 0) {
      bonuses.push({
        districtType: DistrictType.INDUSTRIAL_ZONE,
        yieldType: 'production',
        amount: waterInfraBonus,
        source: `${aqueductCount} Aqueduct(s), ${damCount} Dam(s), ${canalCount} Canal(s)`,
      });
    }

    const halfBonusCount = Math.floor(districtCount / 2);
    if (halfBonusCount > 0) {
      bonuses.push({
        districtType: DistrictType.INDUSTRIAL_ZONE,
        yieldType: 'production',
        amount: halfBonusCount,
        source: `${districtCount} District(s)`,
      });
    }

    // Strategic resources
    if (strategicResourceCount > 0) {
      bonuses.push({
        districtType: DistrictType.INDUSTRIAL_ZONE,
        yieldType: 'production',
        amount: strategicResourceCount,
        source: `${strategicResourceCount} Strategic Resource(s)`,
      });
    }
  }

  /**
   * Calculate what adjacency bonus a district would get if placed at a specific tile
   */
  calculatePotentialAdjacency(coord: HexCoord, districtType: DistrictType): DistrictAdjacencyResult | null {
    const tile = this.map.getTile(coord);
    if (!tile) return null;

    // Create a temporary tile with the district
    const tempTile = Tile.fromJSON({
      ...tile.toJSON(),
      district: districtType,
    });

    const neighbors = this.map.getNeighborTiles(coord);
    
    return this.calculateDistrictAdjacency(tempTile);
  }

  /**
   * Find best placement for a district type within city range
   */
  findBestDistrictPlacement(cityCenter: HexCoord, districtType: DistrictType): {
    coord: HexCoord;
    bonus: DistrictAdjacencyResult;
  } | null {
    const workableTiles = this.map.getTilesInRange(cityCenter, 3);
    const validTiles = workableTiles.filter(t => 
      !t.hasDistrict && 
      !t.isMountain && 
      this.canPlaceDistrict(t, districtType)
    );

    let bestResult: { coord: HexCoord; bonus: DistrictAdjacencyResult } | null = null;
    let bestTotal = -Infinity;

    for (const tile of validTiles) {
      const result = this.calculatePotentialAdjacency(tile.coord, districtType);
      if (result) {
        const primary = DISTRICT_DATA[districtType]?.primaryYieldType;
        const total = primary ? result.totalBonus[primary] : 0;
        
        if (total > bestTotal) {
          bestTotal = total;
          bestResult = { coord: tile.coord, bonus: result };
        }
      }
    }

    return bestResult;
  }

  /**
   * Check if a district can be placed on a tile
   */
  private canPlaceDistrict(tile: Tile, districtType: DistrictType): boolean {
    const districtInfo = DISTRICT_DATA[districtType];
    if (!districtInfo) return false;

    // Check terrain requirements
    if (districtInfo.requiresCoast && !tile.isWater) {
      return false;
    }

    if (districtInfo.requiresLand && tile.isWater) {
      return false;
    }

    if (!districtInfo.canBuildOnHills && tile.isHill) {
      // Some districts can't be built on hills
      return false;
    }

    return true;
  }

  /**
   * Generate a text report of all adjacency bonuses
   */
  generateReport(cityCenter: HexCoord): string {
    const result = this.calculateCityAdjacency(cityCenter);
    const lines: string[] = [];

    lines.push('═══════════════════════════════════════════════════════════');
    lines.push('           DISTRICT ADJACENCY BONUS REPORT');
    lines.push('═══════════════════════════════════════════════════════════');
    lines.push('');

    if (result.districts.length === 0) {
      lines.push('No districts found within city range.');
      return lines.join('\n');
    }

    for (const district of result.districts) {
      const districtInfo = DISTRICT_DATA[district.districtType];
      lines.push(`📍 ${districtInfo?.name || district.districtType}`);
      lines.push(`   Location: (${district.tile.coord.q}, ${district.tile.coord.r})`);
      lines.push('   ─────────────────────────────────────');
      
      if (district.bonusBreakdown.length === 0) {
        lines.push('   No adjacency bonuses');
      } else {
        for (const bonus of district.bonusBreakdown) {
          const yieldEmoji = this.getYieldEmoji(bonus.yieldType);
          lines.push(`   ${yieldEmoji} +${bonus.amount} ${bonus.yieldType} from ${bonus.source}`);
        }
      }
      
      lines.push('   ─────────────────────────────────────');
      lines.push(`   Total: ${this.formatYields(district.totalBonus)}`);
      lines.push('');
    }

    lines.push('═══════════════════════════════════════════════════════════');
    lines.push('CITY TOTAL ADJACENCY YIELDS');
    lines.push('═══════════════════════════════════════════════════════════');
    lines.push(this.formatYields(result.totalYields));
    lines.push('');

    return lines.join('\n');
  }

  private getYieldEmoji(yieldType: keyof Yields): string {
    const emojis: Record<keyof Yields, string> = {
      food: '🌾',
      production: '⚙️',
      gold: '💰',
      science: '🔬',
      culture: '🎭',
      faith: '✨',
    };
    return emojis[yieldType] || '•';
  }

  private formatYields(yields: Yields): string {
    const parts: string[] = [];
    if (yields.food > 0) parts.push(`🌾 ${yields.food}`);
    if (yields.production > 0) parts.push(`⚙️ ${yields.production}`);
    if (yields.gold > 0) parts.push(`💰 ${yields.gold}`);
    if (yields.science > 0) parts.push(`🔬 ${yields.science}`);
    if (yields.culture > 0) parts.push(`🎭 ${yields.culture}`);
    if (yields.faith > 0) parts.push(`✨ ${yields.faith}`);
    return parts.length > 0 ? parts.join(' | ') : 'None';
  }
}

