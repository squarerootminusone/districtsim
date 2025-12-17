#!/usr/bin/env node
/**
 * CLI interface for Civ6 District Adjacency Calculator
 */

import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import {
  GameMap,
  AdjacencyEngine,
  Tile,
  TerrainType,
  TerrainModifier,
  FeatureType,
  ResourceType,
  DistrictType,
  WonderType,
  HexCoord,
  DISTRICT_DATA,
} from '../core';

class CLI {
  private map: GameMap;
  private engine: AdjacencyEngine;
  private rl: readline.Interface;
  private cityCenter: HexCoord = { q: 0, r: 0 };

  constructor() {
    this.map = new GameMap(10, 10, 'CLI Map');
    this.engine = new AdjacencyEngine(this.map);
    
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  async run(): Promise<void> {
    console.log('\n');
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║     🏛️  CIV6 DISTRICT ADJACENCY CALCULATOR  🏛️            ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log('\nType "help" for available commands.\n');

    await this.mainLoop();
  }

  private async mainLoop(): Promise<void> {
    while (true) {
      const input = await this.prompt('civ6> ');
      const [command, ...args] = input.trim().split(/\s+/);

      try {
        switch (command.toLowerCase()) {
          case 'help':
          case 'h':
          case '?':
            this.showHelp();
            break;

          case 'new':
            await this.handleNew(args);
            break;

          case 'load':
            await this.handleLoad(args);
            break;

          case 'save':
            await this.handleSave(args);
            break;

          case 'city':
            await this.handleCity(args);
            break;

          case 'tile':
            await this.handleTile(args);
            break;

          case 'district':
            await this.handleDistrict(args);
            break;

          case 'calc':
          case 'calculate':
            this.handleCalculate();
            break;

          case 'suggest':
            await this.handleSuggest(args);
            break;

          case 'show':
            this.handleShow(args);
            break;

          case 'list':
            this.handleList(args);
            break;

          case 'demo':
            this.handleDemo();
            break;

          case 'quit':
          case 'exit':
          case 'q':
            console.log('\nGoodbye! 🎮\n');
            this.rl.close();
            process.exit(0);

          case '':
            break;

          default:
            console.log(`Unknown command: ${command}. Type "help" for available commands.`);
        }
      } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : error}`);
      }
    }
  }

  private prompt(query: string): Promise<string> {
    return new Promise(resolve => {
      this.rl.question(query, resolve);
    });
  }

  private showHelp(): void {
    console.log(`
╔═══════════════════════════════════════════════════════════════════╗
║                        AVAILABLE COMMANDS                          ║
╠═══════════════════════════════════════════════════════════════════╣
║ Map Management:                                                    ║
║   new <width> <height>     Create new map (default: 10x10)        ║
║   load <filename>          Load map from JSON file                 ║
║   save <filename>          Save map to JSON file                   ║
║   show map                 Display ASCII map                       ║
║                                                                    ║
║ City & Tiles:                                                      ║
║   city <q> <r>             Set city center location                ║
║   tile <q> <r>             Show tile info                          ║
║   tile set <q> <r> <type>  Set terrain (e.g., plains_hills)       ║
║                                                                    ║
║ Districts:                                                         ║
║   district <q> <r> <type>  Place district                         ║
║   district list            List all district types                 ║
║   district remove <q> <r>  Remove district from tile              ║
║                                                                    ║
║ Adjacency Calculation:                                             ║
║   calc                     Calculate all adjacency bonuses         ║
║   suggest <district>       Find best placement for district        ║
║                                                                    ║
║ Other:                                                             ║
║   demo                     Load demo map with sample setup         ║
║   list terrains|features   List available types                    ║
║   list resources|wonders   List available types                    ║
║   help                     Show this help                          ║
║   quit                     Exit the program                        ║
╚═══════════════════════════════════════════════════════════════════╝
`);
  }

  private async handleNew(args: string[]): Promise<void> {
    const width = parseInt(args[0]) || 10;
    const height = parseInt(args[1]) || 10;
    this.map = new GameMap(width, height, 'New Map');
    this.engine = new AdjacencyEngine(this.map);
    console.log(`Created new ${width}x${height} map.`);
  }

  private async handleLoad(args: string[]): Promise<void> {
    if (args.length === 0) {
      console.log('Usage: load <filename>');
      return;
    }

    const filename = args[0];
    const content = fs.readFileSync(filename, 'utf-8');
    this.map = GameMap.importFromString(content);
    this.engine = new AdjacencyEngine(this.map);
    console.log(`Loaded map "${this.map.name}" from ${filename}`);
  }

  private async handleSave(args: string[]): Promise<void> {
    if (args.length === 0) {
      console.log('Usage: save <filename>');
      return;
    }

    const filename = args[0];
    const content = this.map.exportToString();
    fs.writeFileSync(filename, content);
    console.log(`Saved map to ${filename}`);
  }

  private async handleCity(args: string[]): Promise<void> {
    if (args.length < 2) {
      console.log(`Current city center: (${this.cityCenter.q}, ${this.cityCenter.r})`);
      console.log('Usage: city <q> <r>');
      return;
    }

    const q = parseInt(args[0]);
    const r = parseInt(args[1]);
    this.cityCenter = { q, r };

    // Set the tile as city center
    const tile = this.map.getTile(this.cityCenter);
    if (tile) {
      tile.setOwner('city1', true);
      console.log(`Set city center at (${q}, ${r})`);
    } else {
      console.log(`Warning: Tile (${q}, ${r}) not found on map`);
    }
  }

  private async handleTile(args: string[]): Promise<void> {
    if (args[0] === 'set' && args.length >= 4) {
      const q = parseInt(args[1]);
      const r = parseInt(args[2]);
      const typeStr = args[3].toLowerCase();
      
      const tile = this.map.getTile({ q, r });
      if (!tile) {
        console.log(`Tile (${q}, ${r}) not found`);
        return;
      }

      // Parse terrain_modifier format (e.g., "plains_hills", "grass", "desert_flat")
      const [terrainStr, modifierStr] = typeStr.split('_');
      
      const terrain = Object.values(TerrainType).find(t => t === terrainStr);
      if (!terrain) {
        console.log(`Unknown terrain: ${terrainStr}`);
        console.log(`Available: ${Object.values(TerrainType).join(', ')}`);
        return;
      }

      let modifier = TerrainModifier.FLAT;
      if (modifierStr) {
        modifier = Object.values(TerrainModifier).find(m => m === modifierStr) || TerrainModifier.FLAT;
      }

      tile.setTerrain(terrain, modifier);
      console.log(`Set tile (${q}, ${r}) to ${terrain} ${modifier}`);
      return;
    }

    if (args.length < 2) {
      console.log('Usage: tile <q> <r> OR tile set <q> <r> <terrain_modifier>');
      return;
    }

    const q = parseInt(args[0]);
    const r = parseInt(args[1]);
    const tile = this.map.getTile({ q, r });

    if (!tile) {
      console.log(`Tile (${q}, ${r}) not found`);
      return;
    }

    console.log(`\n📍 Tile at (${q}, ${r}):`);
    console.log(`   Terrain: ${tile.terrain} ${tile.modifier !== TerrainModifier.FLAT ? `(${tile.modifier})` : ''}`);
    console.log(`   Feature: ${tile.feature !== FeatureType.NONE ? tile.feature : 'None'}`);
    console.log(`   Resource: ${tile.resource !== ResourceType.NONE ? tile.resource : 'None'}`);
    console.log(`   District: ${tile.district !== DistrictType.NONE ? tile.district : 'None'}`);
    console.log(`   Has River: ${tile.hasRiver ? 'Yes' : 'No'}`);
    console.log(`   Base Yields: 🌾${tile.baseYields.food} ⚙️${tile.baseYields.production} 💰${tile.baseYields.gold}`);
  }

  private async handleDistrict(args: string[]): Promise<void> {
    if (args[0] === 'list') {
      console.log('\nAvailable Districts:');
      for (const [key, info] of Object.entries(DISTRICT_DATA)) {
        if (key !== DistrictType.NONE) {
          const primary = info.primaryYieldType ? ` (${info.primaryYieldType})` : '';
          console.log(`  • ${info.name}${primary}`);
        }
      }
      return;
    }

    if (args[0] === 'remove' && args.length >= 3) {
      const q = parseInt(args[1]);
      const r = parseInt(args[2]);
      const tile = this.map.getTile({ q, r });
      if (tile) {
        tile.setDistrict(DistrictType.NONE);
        console.log(`Removed district from (${q}, ${r})`);
      }
      return;
    }

    if (args.length < 3) {
      console.log('Usage: district <q> <r> <type>');
      console.log('       district list');
      console.log('       district remove <q> <r>');
      return;
    }

    const q = parseInt(args[0]);
    const r = parseInt(args[1]);
    const typeStr = args[2].toLowerCase().replace(/\s+/g, '_');

    const tile = this.map.getTile({ q, r });
    if (!tile) {
      console.log(`Tile (${q}, ${r}) not found`);
      return;
    }

    const districtType = Object.values(DistrictType).find(d => d === typeStr);
    if (!districtType) {
      console.log(`Unknown district: ${typeStr}`);
      console.log('Use "district list" to see available types');
      return;
    }

    tile.setDistrict(districtType);
    console.log(`Placed ${DISTRICT_DATA[districtType].name} at (${q}, ${r})`);
  }

  private handleCalculate(): void {
    const result = this.engine.calculateCityAdjacency(this.cityCenter);
    const report = this.engine.generateReport(this.cityCenter);
    console.log('\n' + report);
  }

  private async handleSuggest(args: string[]): Promise<void> {
    if (args.length === 0) {
      console.log('Usage: suggest <district_type>');
      return;
    }

    const typeStr = args.join('_').toLowerCase();
    const districtType = Object.values(DistrictType).find(d => d === typeStr);

    if (!districtType) {
      console.log(`Unknown district: ${typeStr}`);
      return;
    }

    const result = this.engine.findBestDistrictPlacement(this.cityCenter, districtType);
    
    if (!result) {
      console.log(`No valid placement found for ${DISTRICT_DATA[districtType].name}`);
      return;
    }

    console.log(`\n🎯 Best placement for ${DISTRICT_DATA[districtType].name}:`);
    console.log(`   Location: (${result.coord.q}, ${result.coord.r})`);
    console.log(`   Adjacency Bonuses:`);
    for (const bonus of result.bonus.bonusBreakdown) {
      console.log(`     +${bonus.amount} ${bonus.yieldType} from ${bonus.source}`);
    }
  }

  private handleShow(args: string[]): void {
    if (args[0] === 'map') {
      this.renderAsciiMap();
    } else {
      console.log('Usage: show map');
    }
  }

  private renderAsciiMap(): void {
    console.log('\n' + '═'.repeat(50));
    console.log('Map: ' + this.map.name);
    console.log('═'.repeat(50));

    for (let r = 0; r < this.map.height; r++) {
      const offset = Math.floor(r / 2);
      let line = '  '.repeat(r % 2);
      
      for (let q = -offset; q < this.map.width - offset; q++) {
        const tile = this.map.getTile({ q, r });
        if (tile) {
          line += this.getTileChar(tile) + ' ';
        }
      }
      console.log(line);
    }
    
    console.log('\nLegend: C=City 🏛️ Districts ⛰️=Mountain 🌲=Woods 🌊=Water');
  }

  private getTileChar(tile: Tile): string {
    if (tile.isCityCenter) return '🏛️';
    if (tile.hasDistrict) {
      switch (tile.district) {
        case DistrictType.CAMPUS: return '📚';
        case DistrictType.HOLY_SITE: return '⛪';
        case DistrictType.THEATER_SQUARE: return '🎭';
        case DistrictType.COMMERCIAL_HUB: return '💰';
        case DistrictType.HARBOR: return '⚓';
        case DistrictType.INDUSTRIAL_ZONE: return '🏭';
        case DistrictType.AQUEDUCT: return '🌊';
        default: return '🔷';
      }
    }
    if (tile.isMountain) return '⛰️';
    if (tile.feature === FeatureType.WOODS) return '🌲';
    if (tile.feature === FeatureType.RAINFOREST) return '🌴';
    if (tile.isWater) return '🌊';
    if (tile.isHill) return '⛰';
    return '🟩';
  }

  private handleList(args: string[]): void {
    switch (args[0]) {
      case 'terrains':
        console.log('\nTerrain Types:');
        Object.values(TerrainType).forEach(t => console.log(`  • ${t}`));
        break;
      case 'features':
        console.log('\nFeature Types:');
        Object.values(FeatureType).forEach(f => console.log(`  • ${f}`));
        break;
      case 'resources':
        console.log('\nResource Types:');
        Object.values(ResourceType).filter(r => r !== ResourceType.NONE).forEach(r => console.log(`  • ${r}`));
        break;
      case 'districts':
        console.log('\nDistrict Types:');
        Object.values(DistrictType).filter(d => d !== DistrictType.NONE).forEach(d => console.log(`  • ${d}`));
        break;
      default:
        console.log('Usage: list <terrains|features|resources|districts>');
    }
  }

  private handleDemo(): void {
    console.log('\n🎮 Loading demo map...\n');
    
    // Create a demo map with sample districts
    this.map = new GameMap(10, 10, 'Demo Map');
    this.engine = new AdjacencyEngine(this.map);

    // Set city center
    this.cityCenter = { q: 4, r: 4 };
    const cityTile = this.map.getTile(this.cityCenter);
    if (cityTile) {
      cityTile.setOwner('demo_city', true);
    }

    // Add some terrain variety
    const mountainTiles = [
      { q: 3, r: 3 },
      { q: 5, r: 3 },
      { q: 4, r: 2 },
    ];
    
    for (const coord of mountainTiles) {
      const tile = this.map.getTile(coord);
      if (tile) {
        tile.setTerrain(TerrainType.PLAINS, TerrainModifier.MOUNTAIN);
      }
    }

    // Add forest
    const forestTiles = [
      { q: 3, r: 5 },
      { q: 2, r: 5 },
      { q: 2, r: 4 },
    ];
    
    for (const coord of forestTiles) {
      const tile = this.map.getTile(coord);
      if (tile) {
        try {
          tile.setTerrain(TerrainType.GRASS, TerrainModifier.FLAT);
          tile.setFeature(FeatureType.WOODS);
        } catch (_e) {
          // Ignore feature placement errors
        }
      }
    }

    // Place a Campus near mountains
    const campusTile = this.map.getTile({ q: 4, r: 3 });
    if (campusTile) {
      campusTile.setTerrain(TerrainType.PLAINS, TerrainModifier.FLAT);
      campusTile.setDistrict(DistrictType.CAMPUS);
    }

    // Place a Holy Site near forest
    const holySiteTile = this.map.getTile({ q: 3, r: 4 });
    if (holySiteTile) {
      holySiteTile.setDistrict(DistrictType.HOLY_SITE);
    }

    // Add a river to a tile and place Commercial Hub
    const commercialTile = this.map.getTile({ q: 5, r: 4 });
    if (commercialTile) {
      commercialTile.addRiverEdge(0);
      commercialTile.addRiverEdge(1);
      commercialTile.setDistrict(DistrictType.COMMERCIAL_HUB);
    }

    console.log('Demo map loaded with:');
    console.log('  • City center at (4, 4)');
    console.log('  • Campus at (4, 3) near mountains');
    console.log('  • Holy Site at (3, 4) near forest');
    console.log('  • Commercial Hub at (5, 4) with river');
    console.log('\nUse "calc" to see adjacency bonuses!');
    console.log('Use "show map" to see the map!\n');
  }
}

// Run CLI
const cli = new CLI();
cli.run().catch(console.error);

