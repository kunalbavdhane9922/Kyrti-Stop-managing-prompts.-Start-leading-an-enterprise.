import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import EventBus from './EventBus';

// ═══════════════════════════════════════════════════════════════════════════
// TILEMAP AND GRID SETTINGS
// ═══════════════════════════════════════════════════════════════════════════
let gameInstance = null;

const TILE_SIZE = 32;
// 60 cols * 32px = 1920px. 45 rows * 32px = 1440px.
const MAP_COLS = 60;  
const MAP_ROWS = 45;  
const WORLD_W = MAP_COLS * TILE_SIZE;
const WORLD_H = MAP_ROWS * TILE_SIZE;
const FRAME_W = Math.floor(1024 / 5);  // 204
const FRAME_H = Math.floor(1024 / 4);  // 256
const CHAR_SCALE = 0.28;

// ═══════════════════════════════════════════════════════════════════════════
// NPC DEFINITIONS — Based on the new organizational structure
// ═══════════════════════════════════════════════════════════════════════════
const NPC_DEFS = [
  // ── Executive Leadership Zone (Top Cabins) ──
  { name: 'CTO', dept: 'Executive', tint: null, x: 15 * 32, y: 5 * 32, patrol: { x1: 12*32, y1: 2*32, x2: 18*32, y2: 8*32 }, sitting: false },
  
  // ── Senior Employee Zone (Row 1 and 2) ──
  { name: 'Alex C.', dept: 'Frontend', tint: null, x: 18 * 32, y: 14 * 32 - 50, sitting: true },
  { name: 'Wei Z.', dept: 'Backend', tint: null, x: 24 * 32, y: 14 * 32 - 50, sitting: true },
  { name: 'Luna R.', dept: 'Design', tint: null, x: 30 * 32, y: 14 * 32 - 50, sitting: true },
  { name: 'AI-01', dept: 'AI', tint: 0x66EEBB, x: 36 * 32, y: 14 * 32 - 50, sitting: true, isAI: true },
  { name: 'Omar F.', dept: 'HR', tint: null, x: 42 * 32, y: 14 * 32 - 50, sitting: true },

  { name: 'James L.', dept: 'IT', tint: null, x: 18 * 32, y: 19 * 32 - 50, sitting: true },
  { name: 'Sarah T.', dept: 'Frontend', tint: null, x: 24 * 32, y: 19 * 32 - 50, sitting: true },
  { name: 'Mike B.', dept: 'Backend', tint: null, x: 30 * 32, y: 19 * 32 - 50, sitting: true },
  { name: 'Emma W.', dept: 'Design', tint: null, x: 36 * 32, y: 19 * 32 - 50, sitting: true },
  { name: 'AI-03', dept: 'AI', tint: 0x66EEBB, x: 42 * 32, y: 19 * 32 - 50, sitting: true, isAI: true },

  // ── Junior Employee Zone (Row 3 and 4) ──
  { name: 'Intern-F1', dept: 'Frontend', tint: null, x: 18 * 32, y: 25 * 32 + 50, sitting: true },
  { name: 'Intern-B1', dept: 'Backend', tint: null, x: 24 * 32, y: 25 * 32 + 50, sitting: true },
  { name: 'Intern-D1', dept: 'Design', tint: null, x: 30 * 32, y: 25 * 32 + 50, sitting: true },
  { name: 'AI-02', dept: 'AI', tint: 0x66EEBB, x: 36 * 32, y: 25 * 32 + 50, sitting: true, isAI: true },
  { name: 'Intern-HR1', dept: 'HR', tint: null, x: 42 * 32, y: 25 * 32 + 50, sitting: true },

  { name: 'Intern-IT1', dept: 'IT', tint: null, x: 18 * 32, y: 30 * 32 + 50, sitting: true },
  { name: 'Intern-F2', dept: 'Frontend', tint: null, x: 24 * 32, y: 30 * 32 + 50, sitting: true },
  { name: 'Intern-B2', dept: 'Backend', tint: null, x: 30 * 32, y: 30 * 32 + 50, sitting: true },
  { name: 'Intern-D2', dept: 'Design', tint: null, x: 36 * 32, y: 30 * 32 + 50, sitting: true },
  { name: 'AI-04', dept: 'AI', tint: 0x66EEBB, x: 42 * 32, y: 30 * 32 + 50, sitting: true, isAI: true },
];

const ROOM_LABELS = [
  { text: 'CEO Cabin', x: 5 * 32, y: 5 * 32 },
  { text: 'CTO Cabin', x: 15 * 32, y: 5 * 32 },
  { text: 'Cabin 3', x: 25 * 32, y: 5 * 32 },
  { text: 'Cabin 4', x: 35 * 32, y: 5 * 32 },
  { text: 'Cabin 5', x: 45 * 32, y: 5 * 32 },
  { text: 'Cabin 6', x: 55 * 32, y: 5 * 32 },
  
  { text: 'Senior Employee Zone', x: 30 * 32, y: 15 * 32 },
  { text: 'Junior Employee Zone', x: 30 * 32, y: 28 * 32 },
  
  { text: 'Meeting Room', x: 12 * 32, y: 40 * 32 },
  { text: 'Company Announcement Hall', x: 42 * 32, y: 40 * 32 },
];

class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.agents = [];
    this.npcs = [];
    this.moveSpeed = 160;
    this.facingDirection = 'down';
  }

  preload() {
    // Load new tilemap components
    this.load.image('floor-tiles', 'assets/tilesets/floortileset.png');
    this.load.image('wall-tiles', 'assets/tilesets/tileset1.png');
    
    // Load newly copied props from office_props directory
    this.load.image('chair-down', 'assets/office_props/ChairGreyDown.png');
    this.load.image('chair-up', 'assets/office_props/ChairGreyUp.png');
    this.load.image('chair-left', 'assets/office_props/ChairGreyLeft.png');
    this.load.image('chair-right', 'assets/office_props/ChairGreyRight.png');
    
    this.load.image('chair-black-down', 'assets/office_props/ArmchairBlackDown.png');
    this.load.image('chair-black-up', 'assets/office_props/ArmchairBlackUp.png');
    
    this.load.image('table-brown', 'assets/office_props/TableBrown.png'); // 64x96
    this.load.image('table-dark-brown', 'assets/office_props/TableDarkBrown.png'); // 64x96
    this.load.image('table-small', 'assets/office_props/TableSmallWhite.png'); // 32x64
    this.load.image('table-narrow', 'assets/office_props/TableNarrowBrown.png'); // 32x96
    
    this.load.image('Desk', 'assets/office_props/Desk.png'); // 512x512
    this.load.image('laptop', 'assets/office_props/LaptopBlackDown.png');
    
    this.load.image('computer', 'assets/office_props/computer.png'); // 42x40
    
    this.load.image('couch-blue-left', 'assets/office_props/CouchBlueLeft.png');
    this.load.image('couch-blue-right', 'assets/office_props/CouchBlueRight.png');
    this.load.image('couch-blue-up', 'assets/office_props/CouchBlueUp.png');
    
    this.load.image('plant-large', 'assets/office_props/PlantLarge.png'); // 64x32
    this.load.image('plant-small', 'assets/office_props/PlantSmall.png');
    this.load.image('plant-small-blue', 'assets/office_props/PlantSmallBlue.png');
    this.load.image('plant-small-red', 'assets/office_props/PlantSmallRed.png');
    this.load.image('plant-small-cyan', 'assets/office_props/PlantSmallCyan.png');
    
    this.load.image('shelf', 'assets/office_props/Shelf.png');
    this.load.image('shelf-big', 'assets/office_props/ShelfBig.png');
    this.load.image('screen-down', 'assets/office_props/ScreenWhiteDown.png');
    
    this.load.image('couch-grey-left', 'assets/office_props/CouchGreyLeft.png');
    this.load.image('couch-grey-right', 'assets/office_props/CouchGreyRight.png');
    this.load.image('couch-grey-up', 'assets/office_props/CouchGreyUp.png');
    this.load.image('pouf-brown', 'assets/office_props/PoufBrown.png');
    this.load.image('pouf-orange', 'assets/office_props/PoufOrange.png');
    this.load.image('table-small-grey', 'assets/office_props/TableSmallGrey.png');
    
    // Artwork
    this.load.image('art-paysage', 'assets/office_props/paysage.jpg');
    this.load.image('art-paysage2', 'assets/office_props/paysage_2.jpg');
    this.load.image('art-waterfall', 'assets/office_props/waterfall.jpg');
    
    // Wall partitions
    this.load.image('pannel-left', 'assets/office_props/PannelLeft.png'); // 64x128
    this.load.image('pannel-right', 'assets/office_props/PannelRight.png'); // 64x128
    
    // Player spritesheet
    this.load.image('ceo-sprite-raw', 'assets/player_spritesheet.png');
  }

  create() {
    this.cameras.main.setBackgroundColor('#0B0F19');
    this.processSpritesheetTexture();
    this.createAnimations();

    // ── Build Component Tilemap ──
    const map = this.make.tilemap({ tileWidth: TILE_SIZE, tileHeight: TILE_SIZE, width: MAP_COLS, height: MAP_ROWS });
    const floorTileset = map.addTilesetImage('floor', 'floor-tiles', 32, 32);
    const wallTileset = map.addTilesetImage('wall', 'wall-tiles', 32, 32);

    const floorLayer = map.createBlankLayer('Floor', floorTileset);
    const wallLayer = map.createBlankLayer('Walls', wallTileset);

    // Fill entire area with a basic floor tile
    floorLayer.fill(0, 0, 0, MAP_COLS, MAP_ROWS);
    
    // Using index 45 for walls (provides physics boundary, but we will make it invisible)
    const wallIndex = 45;
    const buildWall = (col, row, w, h) => wallLayer.fill(wallIndex, col, row, w, h);

    // 1. Outer Perimeter
    buildWall(0, 0, MAP_COLS, 1); // Top
    buildWall(0, MAP_ROWS - 1, MAP_COLS, 1); // Bottom
    buildWall(0, 0, 1, MAP_ROWS); // Left
    buildWall(MAP_COLS - 1, 0, 1, MAP_ROWS); // Right

    // 2. Executive Leadership Zone (Cabins 1 - 6)
    buildWall(0, 10, MAP_COLS, 1);
    for (let i = 1; i < 6; i++) {
      buildWall(i * 10, 0, 1, 10);
    }
    [4, 14, 24, 34, 44, 54].forEach(doorX => {
      wallLayer.fill(-1, doorX, 10, 2, 1); 
    });

    // 3. Senior vs Junior Zone dividers
    buildWall(0, 22, 5, 1); 
    buildWall(MAP_COLS - 6, 22, 5, 1);

    // 4. Meeting Room & Townhall (Bottom Zone)
    buildWall(0, 34, MAP_COLS, 1);
    buildWall(25, 34, 1, 11);
    wallLayer.fill(-1, 12, 34, 3, 1); // Meeting room door
    wallLayer.fill(-1, 40, 34, 6, 1); // Large double doors for Townhall

    wallLayer.setCollisionByExclusion([-1]);
    this.collisionGroup = wallLayer;
    
    // Hide the ugly tilemap layers so we can use procedural high-quality renders
    wallLayer.setVisible(false);
    floorLayer.setVisible(false);
    
    // ── Generate Premium Procedural Floor ──
    const floorGfx = this.add.graphics().setDepth(0);
    
    // 1. Base Floor (Polished Modern Concrete / Light Wood for Corridors)
    floorGfx.fillStyle(0xF8FAFC); // Light slate/white base
    floorGfx.fillRect(0, 0, MAP_COLS * 32, MAP_ROWS * 32);
    
    // Subtle floor tile grid removed for a cleaner, premium look
    
    const drawCarpet = (col, row, width, height, fillColor, borderColor) => {
        const x = col * 32;
        const y = row * 32;
        const w = width * 32;
        const h = height * 32;
        
        floorGfx.fillStyle(fillColor);
        floorGfx.fillRect(x, y, w, h);
        
        // Carpet border
        floorGfx.lineStyle(4, borderColor, 1);
        floorGfx.strokeRect(x + 2, y + 2, w - 4, h - 4);
        
        // Carpet texture grid
        floorGfx.lineStyle(1, borderColor, 0.4);
        for(let c = 1; c < width; c++) {
            floorGfx.beginPath(); floorGfx.moveTo(x + c*32, y); floorGfx.lineTo(x + c*32, y + h); floorGfx.strokePath();
        }
        for(let r = 1; r < height; r++) {
            floorGfx.beginPath(); floorGfx.moveTo(x, y + r*32); floorGfx.lineTo(x + w, y + r*32); floorGfx.strokePath();
        }
    };
    
    // 2. Executive Cabins (Premium Dark Slate)
    for (let i = 0; i < 6; i++) {
       drawCarpet(i*10 + 1, 1, 9, 9, 0x334155, 0x475569);
    }
    
    // 3. Meeting Room (Deep Corporate Navy)
    drawCarpet(1, 35, 24, 14, 0x1E3A8A, 0x3730A3); 
    
    // 4. Townhall (Warm Modern Lounge - Soft Light Grey)
    drawCarpet(26, 35, 33, 14, 0xE5E7EB, 0xD1D5DB); 
    
    // 5. Open Plan Employee Zone (Unified Large Carpet - White)
    drawCarpet(16, 11, 28, 22, 0xE5E7EB, 0xD1D5DB);
    
    this.floorGfx = floorGfx; // Save reference so we can draw shadows later

    // ── Create Props Physics Group ──
    this.propsGroup = this.physics.add.staticGroup();

    // ── Place Props & Decor ──
    const placeImage = (key, x, y) => {
      const img = this.add.image(x, y, key).setOrigin(0.5);
      
      // Do not add collision bodies for wall decor or small table items
      // This prevents unscaled massive invisible hitboxes blocking the room entrances.
      if (key.includes('art') || key.includes('laptop') || key.includes('screen') || key.includes('computer')) {
          return img;
      }

      this.physics.add.existing(img, true); // true = static body
      
      // Adjust hitbox sizes for specific props so they don't feel too big
      if (key.includes('table')) {
        img.body.setSize(img.width * 0.8, img.height * 0.6);
        img.body.setOffset(img.width * 0.1, img.height * 0.2);
      } else if (key.includes('chair') || key.includes('couch') || key.includes('pouf')) {
        img.body.setSize(img.width * 0.7, img.height * 0.7);
        img.body.setOffset(img.width * 0.15, img.height * 0.15);
      } else if (key.includes('plant') || key.includes('shelf')) {
        img.body.setSize(img.width * 0.6, img.height * 0.4);
        img.body.setOffset(img.width * 0.2, img.height * 0.5);
      }
      
      this.propsGroup.add(img);
      return img;
    };
    
    // Helper to safely set depth based on Y coordinate
    const place = (key, x, y, depthOffset = 0) => {
        return placeImage(key, x, y).setDepth(y + depthOffset);
    };
    
    // ── Generate Realistic 3D Modular Office Partitions ──
    wallLayer.forEachTile(tile => {
      if (tile.index !== wallIndex) return;
      
      const x = tile.pixelX;
      const y = tile.pixelY;
      
      const tileN = wallLayer.getTileAt(tile.x, tile.y - 1);
      const tileS = wallLayer.getTileAt(tile.x, tile.y + 1);
      const tileE = wallLayer.getTileAt(tile.x + 1, tile.y);
      const tileW = wallLayer.getTileAt(tile.x - 1, tile.y);
      
      const hasN = tileN && tileN.index === wallIndex;
      const hasS = tileS && tileS.index === wallIndex;
      const hasE = tileE && tileE.index === wallIndex;
      const hasW = tileW && tileW.index === wallIndex;
      
      const px = x;
      const py = y;
      const h = 64; 
      // Depth must perfectly synchronize with player.y (center sorting)
      const depth = py + 16; 
      
      // 1. Top Face (Roof) - ALWAYS drawn
      this.add.rectangle(px + 16, py + 16 - h, 32, 32, 0xE2E8F0).setDepth(depth - 0.2);
      this.add.rectangle(px + 16, py + 16 - h, 32, 32).setStrokeStyle(1, 0x94A3B8).setDepth(depth + 0.2);
      
      // 2. Front Face (South Face) - ONLY if no wall below
      if (!hasS) {
          // Drop shadow on the floor
          this.floorGfx.fillStyle(0x000000, 0.15);
          this.floorGfx.fillRect(px + 8, py + 32, 32, 24);
          
          // Base solid wall
          this.add.rectangle(px + 16, py + 16 - h/2 + 16, 32, h, 0xF8FAFC).setDepth(depth);
          
          // Glass upper panel (reduced height to leave more solid wall for murals)
          this.add.rectangle(px + 16, py - 16, 32, 20, 0x38BDF8, 0.4).setDepth(depth + 0.05);
          
          // Trims
          this.add.rectangle(px + 16, py - h + 32 + 2, 32, 4, 0x94A3B8).setDepth(depth + 0.1); // Top trim
          this.add.rectangle(px + 16, py + 32 - 2, 32, 4, 0x94A3B8).setDepth(depth + 0.1); // Bottom trim
          this.add.rectangle(px + 16, py - h/2 + 16, 32, 4, 0x94A3B8).setDepth(depth + 0.1); // Mid trim
      }
      
      // 3. Side Edges (West/East) - ALWAYS drawn if exposed
      if (!hasW) {
          this.add.rectangle(px + 1, py + 16 - h/2 + 16, 2, h, 0x64748B).setDepth(depth + 0.1);
      }
      if (!hasE) {
          this.add.rectangle(px + 31, py + 16 - h/2 + 16, 2, h, 0x64748B).setDepth(depth + 0.1);
      }
    });
    
    // Helper for framed paintings with depth shadows
    const placePainting = (key, x, y, scale, depthOffset = 0) => {
        const img = this.add.image(x, y, key).setOrigin(0.5).setScale(scale);
        const w = img.width * scale;
        const h = img.height * scale;
        
        // Drop shadow (sandwiched just behind the painting)
        this.add.rectangle(x + 4, y + 4, w + 6, h + 6, 0x000000, 0.3).setOrigin(0.5).setDepth(y + depthOffset - 0.02);
        // Wooden frame
        this.add.rectangle(x, y, w + 6, h + 6, 0x1E293B).setOrigin(0.5).setDepth(y + depthOffset - 0.01);
        
        img.setDepth(y + depthOffset);
        return img;
    };
    
    // 1. Executive Leadership Cabins
    for (let i = 0; i < 6; i++) {
      const cx = (i * 10 + 5) * 32;
      
      // Shifted down 13px to sit on the solid part of the wall below the glass
      // Scale 0.05 ensures its 720px height = 36px, perfectly fitting the 38px solid canvas.
      placePainting('art-paysage', cx, 13, 0.05, 3.05);
      
      place('table-dark-brown', cx, 4.5 * 32);
      place('laptop', cx, 4.2 * 32, 10).setScale(1).setAngle(180);
      place('chair-black-down', cx, 2.5 * 32, -32); // CEO chair
      
      // Visitor chairs
      place('chair-up', cx - 1.5 * 32, 6 * 32, 32);
      place('chair-up', cx + 1.5 * 32, 6 * 32, 32);
      
      // Decor
      place('shelf-big', cx - 3 * 32, 1.5 * 32, -64);
      place('plant-large', cx + 3.5 * 32, 2.5 * 32, -32);
      place('plant-small', cx - 3.5 * 32, 7.5 * 32);
    }

    // 2. Open Plan Area - Domain-wise Employee Lines (4 Rows)
    const domainXs = [18 * 32, 24 * 32, 30 * 32, 36 * 32, 42 * 32];
    
    const seniorYs = [14 * 32, 19 * 32];
    seniorYs.forEach(srY => {
      domainXs.forEach(x => {
        place('table-brown', x, srY);
        place('laptop', x, srY - 10, 10).setScale(1).setAngle(180); // Screen faces UP towards the Senior
        place('chair-down', x, srY - 50, -40);
        place('plant-small-cyan', x + 32, srY);
      });
    });

    const juniorYs = [25 * 32, 30 * 32];
    juniorYs.forEach(jrY => {
      domainXs.forEach(x => {
        place('table-brown', x, jrY);
        place('laptop', x, jrY + 10, 10).setScale(1).setAngle(0); // Screen faces DOWN towards the Junior
        place('chair-up', x, jrY + 50, 40);
        place('plant-small-red', x + 32, jrY);
      });
    });
    
    // Lounge Breakout (Middle gap between Senior and Junior rows)
    const loungeX = 30 * 32;
    const loungeY = 22 * 32;
    place('couch-grey-up', loungeX - 64, loungeY);
    place('pouf-orange', loungeX + 64, loungeY - 20);
    place('pouf-orange', loungeX + 64, loungeY + 20);
    place('table-small-grey', loungeX, loungeY);
    place('plant-small', loungeX - 110, loungeY);
    place('plant-small', loungeX + 110, loungeY);

    // 4. Detailed Meeting Room
    // Centered exactly in the middle of the room
    const mrX = 13 * 32, mrY = 38 * 32 + 16;
    
    // North Wall Decor (Wall is at Y = 34 * 32)
    const mrWallY = 34 * 32;
    placePainting('art-paysage2', 20 * 32, mrWallY + 13, 0.055, 3.05); 
    place('screen-down', 6 * 32, mrWallY + 13, 3.05);  
    place('screen-down', 24 * 32, mrWallY + 13, 3.05); 
    
    // Storage and Plants
    place('shelf-big', 2 * 32, 36 * 32, -64);
    place('shelf-big', 2 * 32, 39 * 32, -64);
    place('plant-large', 2 * 32, 43 * 32);
    place('plant-large', 23 * 32, 36 * 32);
    
    // Massive Central Boardroom Table (Wide Horizontal Rectangle)
    place('table-brown', mrX - 64, mrY);
    place('table-brown', mrX, mrY);
    place('table-brown', mrX + 64, mrY);
    
    // Formal Boss Chairs all around the massive boardroom table
    // 3 chairs on top and bottom
    const chairOffsetsX = [-48, 0, 48];
    chairOffsetsX.forEach(offsetX => {
      place('chair-black-down', mrX + offsetX, mrY - 72); // Top side facing down
      place('chair-black-down', mrX + offsetX, mrY + 72, 40).setAngle(180); // Bottom side facing up
    });
    // 1 chair on left and right
    place('chair-black-down', mrX - 132, mrY).setAngle(-90); // Left side facing east
    place('chair-black-down', mrX + 132, mrY).setAngle(90); // Right side facing west

    // Breakout corner in Meeting Room
    place('pouf-orange', 22 * 32, 47 * 32);
    place('pouf-orange', 20 * 32, 47 * 32);
    place('table-small-grey', 21 * 32, 46 * 32);

    // 5. Townhall & Announcement Room
    // Door is at X=40 to 45. Shift stage to left wing (X=33).
    const thX = 33 * 32, thY = 38 * 32;
    const thWallY = 34 * 32;
    
    // Massive Waterfall Digital Mural firmly mounted on the north wall
    // Since waterfall.jpg is extremely small (150x84px), we scale it by 0.45 to match a ~38px height.
    placePainting('art-waterfall', thX, thWallY + 13, 0.45, 3.05);
    
    // Presenter Stage Area
    place('table-narrow', thX, thWallY + 3 * 32);
    place('plant-large', thX - 4 * 32, thWallY + 3 * 32);
    place('plant-large', thX + 4 * 32, thWallY + 3 * 32);
    
    // Audience Seating (Rows of chairs for the announcement)
    for (let r = 0; r < 3; r++) {
      for (let c = -2; c <= 2; c++) {
        place('chair-up', thX + c * 48, thWallY + 6 * 32 + r * 48, 40);
      }
    }
    
    // VIP Lounge Seating (Left and Right Wings)
    const lx = thX - 9 * 32;
    place('couch-blue-right', lx - 64, thY);
    place('couch-blue-up', lx, thY + 64, 32);
    place('pouf-brown', lx, thY - 64);
    place('table-small', lx, thY);
    
    const rx = thX + 9 * 32;
    place('couch-blue-left', rx + 64, thY);
    place('couch-blue-up', rx, thY + 64, 32);
    place('pouf-brown', rx, thY - 64);
    place('table-small', rx, thY);
    
    // Plants scattered in Townhall
    place('plant-small-cyan', lx - 32, thY - 64);
    place('plant-small', rx + 32, thY - 64);

    // ── Character & Setup ──
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);
    // Spawn CEO in Cabin 1
    this.createCEOCharacter(5 * 32, 5 * 32);
    this.createNPCs();
    this.createRoomLabels();

    // Camera Configuration
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);
    this.cameras.main.startFollow(this.playerContainer, true, 0.08, 0.08);
    this.cameras.main.setZoom(1.3); // Slightly zoomed out to see more of the larger map
    this.cameras.main.setRoundPixels(true);

    // Minimap Configuration
    const mmW = 240;
    const mmH = Math.round((WORLD_H / WORLD_W) * mmW);
    this.minimap = this.cameras.add(this.scale.width - mmW - 14, this.scale.height - mmH - 14, mmW, mmH);
    this.minimap.setZoom(mmW / WORLD_W);
    this.minimap.setBounds(0, 0, WORLD_W, WORLD_H);
    this.minimap.setBackgroundColor(0x0B0F19);
    this.minimap.startFollow(this.playerContainer);
    this.minimap.setAlpha(0.9);

    const border = this.add.rectangle(0, 0, mmW + 4, mmH + 4);
    border.setStrokeStyle(2, 0x334155, 0.7);
    border.setFillStyle(0x000000, 0);
    border.setScrollFactor(0);
    border.setPosition(this.scale.width - mmW / 2 - 14, this.scale.height - mmH / 2 - 14);
    border.setDepth(1000);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,A,S,D');

    this._handleSpawnAgent = this.handleSpawnAgent.bind(this);
    this._handleMapReload = this.handleMapReload.bind(this);
    EventBus.on('spawn_agent', this._handleSpawnAgent);
    EventBus.on('map_reload', this._handleMapReload);

    // Ensure listeners are cleaned up when the scene stops or the game is destroyed
    this.events.once('shutdown', this.shutdown, this);
    this.events.once('destroy', this.shutdown, this);

    EventBus.emit('game_ready', true);
  }

  processSpritesheetTexture() {
    const rawTexture = this.textures.get('ceo-sprite-raw');
    const source = rawTexture.getSourceImage();
    const sw = source.naturalWidth || source.width;
    const sh = source.naturalHeight || source.height;

    const canvasTex = this.textures.createCanvas('ceo-sprite', sw, sh);
    const ctx = canvasTex.context;
    ctx.drawImage(source, 0, 0);

    const imageData = ctx.getImageData(0, 0, sw, sh);
    const data = imageData.data;
    
    // 1. Remove white background (brightness > 215)
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const brightness = (r + g + b) / 3;
      if (brightness > 210) data[i + 3] = 0;
      else if (brightness > 185) data[i + 3] = Math.max(0, Math.round(255 * (1 - (brightness - 185) / 25)));
    }

    // 1.5. DESTROY thin floating grid lines & text BEFORE flood fill!
    // This perfectly severs grid lines from the character body.
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 5; col++) {
        const startX = col * FRAME_W;
        const startY = row * FRAME_H;
        for (let fy = 0; fy < FRAME_H; fy++) {
           for (let fx = 0; fx < FRAME_W; fx++) {
              const dataIdx = ((startY + fy) * sw + (startX + fx)) * 4;
              if (data[dataIdx + 3] === 0) continue; // already transparent
              
              const r = data[dataIdx], g = data[dataIdx + 1], b = data[dataIdx + 2];
              const diff = Math.max(r, g, b) - Math.min(r, g, b);
              
              // Target neutral greyish/black colors (grids and text)
              if (diff <= 35) {
                 let isThinHorizontal = false;
                 let isThinVertical = false;
                 
                 // If pixels 2 spaces above AND below are empty, it's a thin horizontal line!
                 if (fy > 2 && fy < FRAME_H - 3) {
                     const upA = data[((startY + fy - 2) * sw + (startX + fx)) * 4 + 3];
                     const downA = data[((startY + fy + 2) * sw + (startX + fx)) * 4 + 3];
                     if (upA === 0 && downA === 0) isThinHorizontal = true;
                 }
                 // If pixels 2 spaces left AND right are empty, it's a thin vertical line!
                 if (fx > 2 && fx < FRAME_W - 3) {
                     const leftA = data[((startY + fy) * sw + (startX + fx - 2)) * 4 + 3];
                     const rightA = data[((startY + fy) * sw + (startX + fx + 2)) * 4 + 3];
                     if (leftA === 0 && rightA === 0) isThinVertical = true;
                 }
                 
                 if (isThinHorizontal || isThinVertical) {
                     data[dataIdx + 3] = 0; // Erase the grid line!
                 }
              }
           }
        }
      }
    }

    // 2. Flood fill to keep ONLY the main character blob in each frame!
    // This perfectly erases floating text and disconnected grid lines regardless of animation frames.
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 5; col++) {
        const startX = col * FRAME_W;
        const startY = row * FRAME_H;
        const cx = startX + Math.floor(FRAME_W / 2);
        const cy = startY + Math.floor(FRAME_H / 2);
        
        let startPixel = null;
        for (let dy = -30; dy <= 30; dy++) {
          for (let dx = -30; dx <= 30; dx++) {
             const idx = ((cy + dy) * sw + (cx + dx)) * 4;
             if (data[idx + 3] > 200) { // Find a fully solid pixel near center (torso)
                 startPixel = { x: cx + dx, y: cy + dy };
                 break;
             }
          }
          if (startPixel) break;
        }

        if (startPixel) {
            const keep = new Uint8Array(FRAME_W * FRAME_H);
            const q = [startPixel];
            keep[(startPixel.y - startY) * FRAME_W + (startPixel.x - startX)] = 1;
            let head = 0;
            
            // 8-way BFS Flood fill
            while(head < q.length) {
               const p = q[head++];
               const dirs = [[0,1],[0,-1],[1,0],[-1,0], [1,1], [-1,-1], [1,-1], [-1,1]];
               for(let d=0; d<dirs.length; d++) {
                  const nx = p.x + dirs[d][0];
                  const ny = p.y + dirs[d][1];
                  if (nx >= startX && nx < startX + FRAME_W && ny >= startY && ny < startY + FRAME_H) {
                      const localIdx = (ny - startY) * FRAME_W + (nx - startX);
                      if (keep[localIdx] === 0) {
                          const dataIdx = (ny * sw + nx) * 4;
                          if (data[dataIdx + 3] > 0) {
                              keep[localIdx] = 1;
                              q.push({x: nx, y: ny});
                          }
                      }
                  }
               }
            }

            // Erase floating artifacts (text, separated grids) and extreme edges
            for (let fy = 0; fy < FRAME_H; fy++) {
               for (let fx = 0; fx < FRAME_W; fx++) {
                  const isKept = keep[fy * FRAME_W + fx] === 1;
                  // Extreme outer edge protection (25px safe zone) - extremely safe for character!
                  const isFarEdge = fx < 25 || fx > FRAME_W - 25 || fy < 15 || fy > FRAME_H - 15;
                  
                  if (!isKept || isFarEdge) {
                     const dataIdx = ((startY + fy) * sw + (startX + fx)) * 4;
                     data[dataIdx + 3] = 0;
                  }
               }
            }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
    canvasTex.refresh();

    const texture = this.textures.get('ceo-sprite');
    
    // Use the full frame size to maintain perfect scaling and center of mass!
    let frameIdx = 0;
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 5; col++) {
        texture.add(frameIdx, 0, col * FRAME_W, row * FRAME_H, FRAME_W, FRAME_H);
        frameIdx++;
      }
    }
  }

  createAnimations() {
    const walkAnims = [
      { key: 'walk-down',  start: 0,  end: 4 },
      { key: 'walk-left',  start: 5,  end: 9 },
      { key: 'walk-right', start: 10, end: 14 },
      { key: 'walk-up',    start: 15, end: 19 },
    ];
    walkAnims.forEach(a => {
      if (!this.anims.exists(a.key)) {
        this.anims.create({ key: a.key, frames: this.anims.generateFrameNumbers('ceo-sprite', { start: a.start, end: a.end }), frameRate: 6, repeat: -1 });
      }
    });

    const idleAnims = [
      { key: 'idle-down',  frame: 0 },
      { key: 'idle-left',  frame: 5 },
      { key: 'idle-right', frame: 10 },
      { key: 'idle-up',    frame: 15 },
    ];
    idleAnims.forEach(a => {
      if (!this.anims.exists(a.key)) {
        this.anims.create({ key: a.key, frames: [{ key: 'ceo-sprite', frame: a.frame }], frameRate: 1, repeat: 0 });
      }
    });
  }

  createCEOCharacter(spawnX, spawnY) {
    this.playerContainer = this.add.container(spawnX, spawnY);
    const shadow = this.add.ellipse(0, 24, 30, 10, 0x000000, 0.4);
    
    this.ceoSprite = this.add.sprite(0, -10, 'ceo-sprite', 0);
    this.ceoSprite.setScale(CHAR_SCALE);
    this.ceoSprite.play('idle-down');

    const glow = this.add.circle(0, 0, 20, 0xFF5C00, 0);
    glow.setStrokeStyle(1.5, 0xE8943A, 0.5);
    this.tweens.add({ targets: glow, scaleX: { from: 1.0, to: 1.5 }, scaleY: { from: 1.0, to: 1.5 }, alpha: { from: 0.5, to: 0 }, duration: 2200, repeat: -1, ease: 'Sine.easeOut' });

    const label = this.add.text(0, 32, '  CEO  ', {
      font: 'bold 9px Inter, sans-serif', fill: '#ffffff', backgroundColor: '#FF5C00', padding: { x: 4, y: 2 }
    }).setOrigin(0.5);

    this.playerContainer.add([shadow, glow, this.ceoSprite, label]);
    this.playerContainer.setDepth(200);

    this.physics.add.existing(this.playerContainer);
    this.playerContainer.body.setCircle(14, -14, -14);
    this.playerContainer.body.setCollideWorldBounds(true);
    this.physics.add.collider(this.playerContainer, this.collisionGroup);
    this.physics.add.collider(this.playerContainer, this.propsGroup); // Prop collision
    this.player = this.playerContainer;
  }

  createNPCs() {
    this.npcs = [];
    // Colors matching domain groupings
    const DEPT_COLORS = { 'Executive': '#FF5C00', 'Frontend': '#E8943A', 'Backend': '#D4842E', 'Design': '#8B5E3C', 'AI': '#FF5C00', 'HR': '#E8943A', 'IT': '#6B4226' };

    NPC_DEFS.forEach((def) => {
      // The chair props are already placed properly by the room builder, so we don't spawn duplicate chairs here.
      
      const container = this.add.container(def.x, def.y);
      const shadow = this.add.ellipse(0, 24, 28, 9, 0x000000, 0.35);

      const sprite = this.add.sprite(0, -10, 'ceo-sprite', 0);
      sprite.setScale(CHAR_SCALE * 0.95);
      sprite.play('idle-down');
      if (def.tint) sprite.setTint(def.tint);

      const badgeColor = DEPT_COLORS[def.dept] || '#64748B';
      const label = this.add.text(0, 32, ` ${def.name} `, { font: 'bold 8px Inter, sans-serif', fill: '#ffffff', backgroundColor: badgeColor, padding: { x: 3, y: 1 } }).setOrigin(0.5);
      const deptTag = this.add.text(0, -42, def.dept, { font: '7px Inter, sans-serif', fill: '#94a3b8' }).setOrigin(0.5);
      container.add([shadow, sprite, label, deptTag]);

      if (def.isAI) {
        const aiGlow = this.add.circle(0, 0, 18, 0x10B981, 0);
        aiGlow.setStrokeStyle(1.5, 0x34D399);
        this.tweens.add({ targets: aiGlow, scaleX: 2.2, scaleY: 2.2, alpha: { from: 0.5, to: 0 }, duration: 1400, repeat: -1, ease: 'Sine.easeOut' });
        container.add(aiGlow);
        container.sendToBack(aiGlow);

        const statusDot = this.add.circle(16, -30, 3, 0x10B981, 1);
        this.tweens.add({ targets: statusDot, alpha: { from: 1, to: 0.3 }, duration: 800, yoyo: true, repeat: -1 });
        container.add(statusDot);
      }

      this.physics.add.existing(container);
      container.body.setCircle(12, -12, -12);
      container.body.setCollideWorldBounds(true);
      this.physics.add.collider(container, this.collisionGroup);
      this.physics.add.collider(container, this.propsGroup); // Prop collision
      container.setDepth(def.y);

      this.npcs.push({
        container, sprite, def,
        state: def.sitting ? 'SITTING' : 'IDLE',
        timer: Phaser.Math.Between(2000, 6000),
        targetX: def.x, targetY: def.y, homeX: def.x, homeY: def.y,
        walkSpeed: Phaser.Math.Between(35, 65),
        facingDir: 'down', lookTimer: 0,
      });
    });
  }

  createRoomLabels() {
    ROOM_LABELS.forEach((room) => {
      const bg = this.add.rectangle(room.x, room.y, 0, 0, 0x0B0F19, 0.7);
      bg.setStrokeStyle(1, 0x1E293B, 0.4);
      const text = this.add.text(room.x, room.y, room.text, { font: 'bold 11px Inter, sans-serif', fill: '#94A3B8', padding: { x: 8, y: 4 } }).setOrigin(0.5);
      bg.setSize(text.width + 16, text.height + 8);
      bg.setOrigin(0.5);
      bg.setDepth(150);
      text.setDepth(151);
    });
  }

  update(time, delta) {
    if (!this.player || !this.player.body) return;
    this.updatePlayerMovement();
    this.updateNPCs(delta);
    this.player.setDepth(this.player.y);

    if (this.game.getFrame() % 10 === 0) {
      EventBus.emit('player_moved', { x: Math.round(this.player.x), y: Math.round(this.player.y) });
    }
  }

  updatePlayerMovement() {
    const speed = this.moveSpeed;
    let vx = 0, vy = 0;

    if (this.cursors.left.isDown || this.wasd.A.isDown) vx = -1;
    else if (this.cursors.right.isDown || this.wasd.D.isDown) vx = 1;

    if (this.cursors.up.isDown || this.wasd.W.isDown) vy = -1;
    else if (this.cursors.down.isDown || this.wasd.S.isDown) vy = 1;

    if (vx !== 0 && vy !== 0) { const n = 1 / Math.SQRT2; vx *= n; vy *= n; }

    const body = this.player.body;
    body.setVelocity(Phaser.Math.Linear(body.velocity.x, vx * speed, 0.25), Phaser.Math.Linear(body.velocity.y, vy * speed, 0.25));

    const isMoving = Math.abs(body.velocity.x) > 8 || Math.abs(body.velocity.y) > 8;
    if (isMoving) {
      if (Math.abs(vx) > Math.abs(vy)) this.facingDirection = vx > 0 ? 'right' : 'left';
      else if (vy !== 0) this.facingDirection = vy > 0 ? 'down' : 'up';
      const anim = `walk-${this.facingDirection}`;
      if (this.ceoSprite.anims.currentAnim?.key !== anim) this.ceoSprite.play(anim, true);
    } else {
      const anim = `idle-${this.facingDirection}`;
      if (this.ceoSprite.anims.currentAnim?.key !== anim) this.ceoSprite.play(anim, true);
    }
  }

  updateNPCs(delta) {
    this.npcs.forEach((npc) => {
      npc.timer -= delta;
      switch (npc.state) {
        case 'SITTING':
        case 'IDLE': {
          if (npc.container.body) npc.container.body.setVelocity(0, 0);
          npc.lookTimer -= delta;
          if (npc.lookTimer <= 0) {
            npc.facingDir = ['down', 'left', 'right', 'up'][Phaser.Math.Between(0, 3)];
            const anim = `idle-${npc.facingDir}`;
            if (npc.sprite.anims.currentAnim?.key !== anim) npc.sprite.play(anim, true);
            npc.lookTimer = Phaser.Math.Between(2000, 5000);
          }
          if (npc.timer <= 0) {
            if (npc.def.patrol) {
              npc.targetX = Phaser.Math.Between(npc.def.patrol.x1, npc.def.patrol.x2);
              npc.targetY = Phaser.Math.Between(npc.def.patrol.y1, npc.def.patrol.y2);
              npc.state = 'WALKING';
              npc.timer = Phaser.Math.Between(4000, 10000);
            } else {
              // If they don't have a patrol route, just reset the timer and stay sitting/idle
              npc.timer = Phaser.Math.Between(4000, 10000);
            }
          }
          break;
        }
        case 'WALKING': {
          if (!npc.container.body) break;
          const dx = npc.targetX - npc.container.x, dy = npc.targetY - npc.container.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 10 || npc.timer <= 0) {
            npc.container.body.setVelocity(0, 0);
            npc.state = npc.def.sitting ? 'SITTING' : 'IDLE';
            npc.timer = Phaser.Math.Between(3000, 8000);
            const anim = `idle-${npc.facingDir}`;
            if (npc.sprite.anims.currentAnim?.key !== anim) npc.sprite.play(anim, true);
          } else {
            const angle = Math.atan2(dy, dx);
            npc.container.body.setVelocity(Math.cos(angle) * npc.walkSpeed, Math.sin(angle) * npc.walkSpeed);
            if (Math.abs(dx) > Math.abs(dy)) npc.facingDir = dx > 0 ? 'right' : 'left';
            else npc.facingDir = dy > 0 ? 'down' : 'up';
            const anim = `walk-${npc.facingDir}`;
            if (npc.sprite.anims.currentAnim?.key !== anim) npc.sprite.play(anim, true);
          }
          break;
        }
      }
      npc.container.setDepth(200 + npc.container.y);
    });
  }

  handleSpawnAgent(data) {
    const { x, y } = data;
    const spawnX = x * 32 + 16, spawnY = y * 32 + 16;
    const container = this.add.container(spawnX, spawnY);
    const shadow = this.add.ellipse(0, 24, 28, 9, 0x000000, 0.35);
    const sprite = this.add.sprite(0, -10, 'ceo-sprite', 0);
    sprite.setScale(CHAR_SCALE * 0.9);
    sprite.setTint(0xFF5C00);
    sprite.play('idle-down');

    const pulseRing = this.add.circle(0, 0, 18, 0xFF5C00, 0);
    pulseRing.setStrokeStyle(1.5, 0xE8943A);
    this.tweens.add({ targets: pulseRing, scaleX: 2.2, scaleY: 2.2, alpha: { from: 0.5, to: 0 }, duration: 1400, repeat: -1, ease: 'Sine.easeOut' });

    const label = this.add.text(0, 32, `AI-${String(this.agents.length + 1).padStart(2, '0')}`, { font: 'bold 8px Inter, sans-serif', fill: '#ffffff', backgroundColor: '#FF5C00', padding: { x: 3, y: 1 } }).setOrigin(0.5);
    container.add([shadow, pulseRing, sprite, label]);
    container.setDepth(200 + spawnY);
    this.agents.push(container);
  }

  handleMapReload() { this.scene.restart(); }
  shutdown() { 
    EventBus.off('spawn_agent', this._handleSpawnAgent); 
    EventBus.off('map_reload', this._handleMapReload); 
  }
}

export default function GameComponent() {
  const containerRef = useRef(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!gameInstance && containerRef.current) {
        gameInstance = new Phaser.Game({
          type: Phaser.WEBGL,
          width: window.innerWidth,
          height: window.innerHeight,
          parent: containerRef.current,
          scene: [GameScene],
          pixelArt: true,
          antialias: false,
          physics: { default: 'arcade', arcade: { debug: false, gravity: { y: 0 } } },
          scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
          render: { pixelArt: true, roundPixels: true },
        });
      }
    }, 100);
    return () => { clearTimeout(timer); if (gameInstance) { gameInstance.destroy(true); gameInstance = null; } };
  }, []);
  return <div ref={containerRef} id="phaser-game" style={{ width: '100%', height: '100%' }} />;
}
