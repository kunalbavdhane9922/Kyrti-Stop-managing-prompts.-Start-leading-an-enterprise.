// ============================================================================
// SOVEREIGN PROTOCOL: HQ OFFICE MAP GENERATOR
// Generates a 100×80 tile Tiled-format JSON map for Phaser
// Inspired by Gather Town / WorkAdventure / Modern Silicon Valley HQ
// ============================================================================

const fs = require('fs');
const path = require('path');

const W = 100;
const H = 80;

// ============================================================================
// TILE ID REFERENCE (from tileset analysis — matches existing tilesets)
// ============================================================================

// FLOORS (tileset1, firstgid=201)
const FLOOR_WOOD   = 201;  // Main wooden floor
const FLOOR_CARPET = 223;  // Blue/grey carpet (executive/meeting rooms)
const FLOOR_TILE   = 141;  // Warm tile floor (break room, corridors)

// WALLS (tileset5_export, firstgid=1)
const WALL_TOP    = 58;   // Top horizontal wall
const WALL_BOTTOM = 63;   // Bottom horizontal wall
const WALL_LEFT   = 45;   // Left vertical wall
const WALL_RIGHT  = 73;   // Right vertical wall

// FURNITURE (tileset1-repositioning, firstgid=322)
const DESK_TL      = 338;  // Desk top-left
const DESK_TR      = 339;  // Desk top-right
const DESK_BL      = 349;  // Desk bottom-left
const DESK_BR      = 350;  // Desk bottom-right
const DESK_SINGLE  = 340;  // Single desk tile
const BOOKSHELF_T  = 327;  // Bookshelf top
const BOOKSHELF_B  = 338;  // Bookshelf bottom
const CHAIR_L      = 325;  // Chair facing left
const CHAIR_R      = 326;  // Chair facing right
const CABINET_TL   = 356;  // Filing cabinet top-left
const CABINET_TR   = 357;
const CABINET_BL   = 367;  // Filing cabinet bottom-left
const CABINET_BR   = 368;
const PLANT_POT    = 351;  // Potted plant
const LAMP         = 342;  // Yellow lamp
const MONITOR_L    = 363;  // Computer monitor left
const MONITOR_R    = 374;  // Computer monitor right
const TABLE_TL     = 394;  // Table piece
const TABLE_TR     = 397;
const TABLE_BL     = 405;
const TABLE_BR     = 408;
const SERVER_T     = 392;  // Server rack top
const SERVER_B     = 393;  // Server rack bottom
const VENDING_T    = 433;  // Vending/shelf top
const VENDING_B    = 434;  // Vending/shelf bottom
const SOFA_L       = 371;  // Sofa left
const SOFA_R       = 372;  // Sofa right
const WALL_DECO    = 384;  // Wall decoration (above player)

// SPECIAL ZONES (Special_Zones.png, firstgid=443)
const COLLISION  = 443;
const SPAWN      = 444;
const JITSI_ZONE = 454;

const E = 0;

// ============================================================================
// LAYER DATA ARRAYS
// ============================================================================
const floor_data     = new Array(W * H).fill(FLOOR_WOOD);
const walls_data     = new Array(W * H).fill(E);
const furniture_data = new Array(W * H).fill(E);
const above_data     = new Array(W * H).fill(E);
const collision_data = new Array(W * H).fill(E);
const start_data     = new Array(W * H).fill(E);
const jitsi_data     = new Array(W * H).fill(E);
const glass_data     = new Array(W * H).fill(E);

function idx(x, y) {
  if (x < 0 || x >= W || y < 0 || y >= H) return -1;
  return y * W + x;
}

function safeSet(arr, x, y, val) {
  const i = idx(x, y);
  if (i >= 0 && i < arr.length) arr[i] = val;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function fillFloor(x1, y1, x2, y2, tile = FLOOR_WOOD) {
  for (let y = y1; y < y2; y++) {
    for (let x = x1; x < x2; x++) {
      safeSet(floor_data, x, y, tile);
    }
  }
}

function buildWalls(x1, y1, x2, y2, doorPositions = []) {
  const isDoor = (dx, dy) => doorPositions.some(([px, py]) => px === dx && py === dy);

  // Top and bottom walls
  for (let x = x1; x < x2; x++) {
    if (!isDoor(x, y1)) {
      safeSet(walls_data, x, y1, WALL_TOP);
      safeSet(collision_data, x, y1, COLLISION);
    }
    if (!isDoor(x, y2 - 1)) {
      safeSet(walls_data, x, y2 - 1, WALL_BOTTOM);
      safeSet(collision_data, x, y2 - 1, COLLISION);
    }
  }
  // Left and right walls
  for (let y = y1; y < y2; y++) {
    if (!isDoor(x1, y)) {
      safeSet(walls_data, x1, y, WALL_LEFT);
      safeSet(collision_data, x1, y, COLLISION);
    }
    if (!isDoor(x2 - 1, y)) {
      safeSet(walls_data, x2 - 1, y, WALL_RIGHT);
      safeSet(collision_data, x2 - 1, y, COLLISION);
    }
  }
}

function placeDeskPair(x, y) {
  safeSet(furniture_data, x, y, DESK_TL);
  safeSet(furniture_data, x + 1, y, DESK_TR);
  safeSet(furniture_data, x, y + 1, DESK_BL);
  safeSet(furniture_data, x + 1, y + 1, DESK_BR);
  safeSet(collision_data, x, y, COLLISION);
  safeSet(collision_data, x + 1, y, COLLISION);
  safeSet(collision_data, x, y + 1, COLLISION);
  safeSet(collision_data, x + 1, y + 1, COLLISION);
}

function placeMonitorDesk(x, y) {
  safeSet(furniture_data, x, y, DESK_TL);
  safeSet(furniture_data, x + 1, y, DESK_TR);
  safeSet(above_data, x, y, MONITOR_L);
  safeSet(collision_data, x, y, COLLISION);
  safeSet(collision_data, x + 1, y, COLLISION);
  safeSet(furniture_data, x, y + 1, CHAIR_L);
  safeSet(furniture_data, x + 1, y + 1, CHAIR_R);
}

function placeSingleDesk(x, y, withChair = true) {
  safeSet(furniture_data, x, y, DESK_SINGLE);
  safeSet(collision_data, x, y, COLLISION);
  if (withChair) {
    safeSet(furniture_data, x, y + 1, CHAIR_L);
  }
}

function placeConferenceTable(cx, cy, halfW, halfH) {
  // Rectangular conference table
  for (let dy = -halfH; dy <= halfH; dy++) {
    for (let dx = -halfW; dx <= halfW; dx++) {
      const tile = (dx + dy) % 2 === 0 ? TABLE_TL : TABLE_TR;
      safeSet(furniture_data, cx + dx, cy + dy, tile);
      safeSet(collision_data, cx + dx, cy + dy, COLLISION);
    }
  }
  // Chairs on sides
  for (let dx = -halfW; dx <= halfW; dx++) {
    safeSet(furniture_data, cx + dx, cy - halfH - 1, CHAIR_L);
    safeSet(furniture_data, cx + dx, cy + halfH + 1, CHAIR_R);
  }
}

function placePlant(x, y) {
  safeSet(furniture_data, x, y, PLANT_POT);
  safeSet(collision_data, x, y, COLLISION);
}

function placeLamp(x, y) {
  safeSet(furniture_data, x, y, LAMP);
  safeSet(collision_data, x, y, COLLISION);
}

function placeCabinet(x, y) {
  safeSet(furniture_data, x, y, CABINET_TL);
  safeSet(furniture_data, x + 1, y, CABINET_TR);
  safeSet(furniture_data, x, y + 1, CABINET_BL);
  safeSet(furniture_data, x + 1, y + 1, CABINET_BR);
  safeSet(collision_data, x, y, COLLISION);
  safeSet(collision_data, x + 1, y, COLLISION);
  safeSet(collision_data, x, y + 1, COLLISION);
  safeSet(collision_data, x + 1, y + 1, COLLISION);
}

function placeWhiteboard(x, y, w = 4) {
  for (let dx = 0; dx < w; dx++) {
    safeSet(above_data, x + dx, y, WALL_DECO);
    safeSet(collision_data, x + dx, y, COLLISION);
  }
}

function placeServerRack(x, y) {
  safeSet(furniture_data, x, y, SERVER_T);
  safeSet(furniture_data, x, y + 1, SERVER_B);
  safeSet(collision_data, x, y, COLLISION);
  safeSet(collision_data, x, y + 1, COLLISION);
}

function placeVending(x, y) {
  safeSet(furniture_data, x, y, VENDING_T);
  safeSet(furniture_data, x, y + 1, VENDING_B);
  safeSet(collision_data, x, y, COLLISION);
  safeSet(collision_data, x, y + 1, COLLISION);
}

function placeSofa(x, y, length = 3) {
  for (let dx = 0; dx < length; dx++) {
    const tile = dx === 0 ? SOFA_L : (dx === length - 1 ? SOFA_R : DESK_SINGLE);
    safeSet(furniture_data, x + dx, y, tile);
    safeSet(collision_data, x + dx, y, COLLISION);
  }
}

function fillJitsiZone(x1, y1, x2, y2) {
  for (let y = y1; y < y2; y++) {
    for (let x = x1; x < x2; x++) {
      safeSet(jitsi_data, x, y, JITSI_ZONE);
    }
  }
}

function placeGlassWall(x1, y1, x2, y2, doorPositions = []) {
  const isDoor = (dx, dy) => doorPositions.some(([px, py]) => px === dx && py === dy);
  // Glass walls are on the glass layer (semi-transparent rendering)
  for (let x = x1; x < x2; x++) {
    if (!isDoor(x, y1)) { safeSet(glass_data, x, y1, WALL_TOP); safeSet(collision_data, x, y1, COLLISION); }
    if (!isDoor(x, y2 - 1)) { safeSet(glass_data, x, y2 - 1, WALL_BOTTOM); safeSet(collision_data, x, y2 - 1, COLLISION); }
  }
  for (let y = y1; y < y2; y++) {
    if (!isDoor(x1, y)) { safeSet(glass_data, x1, y, WALL_LEFT); safeSet(collision_data, x1, y, COLLISION); }
    if (!isDoor(x2 - 1, y)) { safeSet(glass_data, x2 - 1, y, WALL_RIGHT); safeSet(collision_data, x2 - 1, y, COLLISION); }
  }
}

// ============================================================================
// BUILD OUTER WALLS & DEFAULT FLOOR
// ============================================================================
buildWalls(0, 0, W, H);

// ============================================================================
// ██████  EXECUTIVE WING (Top section, rows 1-14)
// ============================================================================

// ─── CEO Executive Office (Top-Left, 1,1 to 18,14) — LARGEST ───
fillFloor(1, 1, 18, 14, FLOOR_CARPET);
buildWalls(1, 1, 18, 14, [[9, 13], [10, 13]]);

// CEO's grand executive desk (3 desk pairs = 6 tiles wide)
placeDeskPair(7, 6);
placeDeskPair(9, 6);
placeDeskPair(11, 6);
// Monitors on desk
safeSet(above_data, 8, 6, MONITOR_L);
safeSet(above_data, 10, 6, MONITOR_L);
safeSet(above_data, 12, 6, MONITOR_R);

// Filing cabinets along left wall
placeCabinet(2, 2);
placeCabinet(2, 5);
placeCabinet(2, 8);

// Whiteboard / awards wall
placeWhiteboard(6, 2, 8);

// Meeting corner (chairs in front of desk)
safeSet(furniture_data, idx(8, 9), CHAIR_L);
safeSet(furniture_data, idx(10, 9), CHAIR_R);
safeSet(furniture_data, idx(12, 9), CHAIR_L);

// Premium plants in corners
placePlant(16, 2);
placePlant(16, 12);
placePlant(5, 2);
placePlant(5, 12);

// Lamps
placeLamp(15, 4);

// Bookshelf (awards display)
safeSet(furniture_data, idx(14, 2), BOOKSHELF_T);
safeSet(collision_data, idx(14, 2), COLLISION);

// CEO spawn point
safeSet(start_data, 10, 10, SPAWN);


// ─── CTO Office (Top-Center, 20,1 to 33,14) ───
fillFloor(20, 1, 33, 14, FLOOR_CARPET);
buildWalls(20, 1, 33, 14, [[26, 13], [27, 13]]);

// CTO desk with dual monitors
placeDeskPair(24, 5);
placeDeskPair(26, 5);
safeSet(above_data, 25, 5, MONITOR_L);
safeSet(above_data, 27, 5, MONITOR_R);

// Whiteboard (tech roadmap)
placeWhiteboard(22, 2, 6);

// Tech bookshelves
placeCabinet(30, 2);
placeCabinet(30, 5);

// Chair in front
safeSet(furniture_data, idx(25, 8), CHAIR_L);
safeSet(furniture_data, idx(27, 8), CHAIR_R);

// Plants
placePlant(21, 2);
placePlant(21, 12);
placePlant(31, 12);


// ─── CFO Office (Top-Center-Right, 35,1 to 48,14) ───
fillFloor(35, 1, 48, 14, FLOOR_CARPET);
buildWalls(35, 1, 48, 14, [[41, 13], [42, 13]]);

// CFO desk
placeDeskPair(39, 5);
placeDeskPair(41, 5);
safeSet(above_data, 40, 5, MONITOR_L);
safeSet(above_data, 42, 5, MONITOR_R);

// Filing cabinets (financial records)
placeCabinet(36, 2);
placeCabinet(36, 5);
placeCabinet(36, 8);

// Whiteboard
placeWhiteboard(39, 2, 5);

// Awards
safeSet(furniture_data, idx(45, 2), BOOKSHELF_T);
safeSet(collision_data, idx(45, 2), COLLISION);

// Plants
placePlant(46, 2);
placePlant(46, 12);
placePlant(37, 12);

// Chairs
safeSet(furniture_data, idx(40, 8), CHAIR_L);
safeSet(furniture_data, idx(42, 8), CHAIR_R);


// ─── Reception Area (Top-Right, 50,1 to 74,14) ───
fillFloor(50, 1, 74, 14, FLOOR_WOOD);
buildWalls(50, 1, 74, 14, [[62, 13], [63, 13], [50, 7], [50, 8]]);

// Reception desk (large L-shape)
placeDeskPair(58, 5);
placeDeskPair(60, 5);
placeDeskPair(62, 5);
placeDeskPair(64, 5);
safeSet(above_data, 59, 5, MONITOR_L);
safeSet(above_data, 63, 5, MONITOR_R);

// Visitor seating
placeSofa(52, 9, 4);
placeSofa(52, 11, 4);
placeSofa(68, 9, 4);
placeSofa(68, 11, 4);

// Plants (lush reception)
placePlant(51, 2);
placePlant(57, 2);
placePlant(66, 2);
placePlant(72, 2);
placePlant(51, 12);
placePlant(72, 12);

// Company sign on wall
placeWhiteboard(55, 2, 12);

// Lamp
placeLamp(56, 9);
placeLamp(67, 9);


// ─── Server Room (Top-Far-Right, 76,1 to 88,14) ───
fillFloor(76, 1, 88, 14, FLOOR_TILE);
buildWalls(76, 1, 88, 14, [[76, 7], [76, 8]]);

// Server racks in organized rows
for (let sx = 79; sx <= 85; sx += 3) {
  for (let sy = 3; sy <= 10; sy += 3) {
    placeServerRack(sx, sy);
  }
}

// Monitoring desk
placeMonitorDesk(77, 11);

// Plants
placePlant(86, 2);
placePlant(86, 12);


// ============================================================================
// ██████  EXECUTIVE CORRIDOR (Row 14-16, full width)
// ============================================================================
fillFloor(1, 14, 98, 17, FLOOR_TILE);


// ============================================================================
// ██████  BOARDROOM — Visual Centerpiece (Center, rows 17-30)
// ============================================================================
fillFloor(1, 17, 40, 30, FLOOR_CARPET);
placeGlassWall(1, 17, 40, 30, [[20, 29], [21, 29], [1, 22], [1, 23]]);

// Long conference table (10 seats)
placeConferenceTable(20, 23, 6, 1);

// Additional chairs on the sides
for (let dy of [-1, 1]) {
  safeSet(furniture_data, idx(12, 23 + dy * 3), CHAIR_L);
  safeSet(furniture_data, idx(28, 23 + dy * 3), CHAIR_R);
}

// Presentation screen (whiteboard on north wall)
placeWhiteboard(8, 18, 10);

// Video meeting setup (another whiteboard/screen)
placeWhiteboard(24, 18, 8);

// Plants at corners
placePlant(2, 18);
placePlant(38, 18);
placePlant(2, 28);
placePlant(38, 28);

// Lamps
placeLamp(5, 18);
placeLamp(34, 18);

// Jitsi zone in boardroom
fillJitsiZone(5, 20, 35, 28);


// ============================================================================
// ██████  MEETING ROOM A (Right of boardroom, rows 17-26)
// ============================================================================
fillFloor(42, 17, 56, 27, FLOOR_CARPET);
buildWalls(42, 17, 56, 27, [[48, 26], [49, 26]]);

// Small conference table
placeConferenceTable(49, 21, 2, 1);

// Whiteboard
placeWhiteboard(44, 18, 5);

// Plants
placePlant(43, 18);
placePlant(54, 18);
placePlant(43, 25);
placePlant(54, 25);

// Jitsi zone
fillJitsiZone(44, 19, 54, 25);


// ============================================================================
// ██████  MEETING ROOM B (Far right, rows 17-26)
// ============================================================================
fillFloor(58, 17, 72, 27, FLOOR_CARPET);
buildWalls(58, 17, 72, 27, [[64, 26], [65, 26]]);

// Small conference table
placeConferenceTable(65, 21, 2, 1);

// Whiteboard
placeWhiteboard(60, 18, 5);

// Plants
placePlant(59, 18);
placePlant(70, 18);
placePlant(59, 25);
placePlant(70, 25);

// Jitsi zone
fillJitsiZone(60, 19, 70, 25);


// ============================================================================
// ██████  BREAK ROOM (Far right, rows 17-30)
// ============================================================================
fillFloor(74, 17, 98, 30, FLOOR_TILE);
buildWalls(74, 17, 98, 30, [[74, 22], [74, 23]]);

// Coffee station
placeVending(76, 18);
placeVending(79, 18);

// Casual tables
placeDeskPair(82, 20);
placeDeskPair(88, 20);
placeDeskPair(82, 24);
placeDeskPair(88, 24);

// Chairs around tables
safeSet(furniture_data, idx(81, 20), CHAIR_L);
safeSet(furniture_data, idx(84, 20), CHAIR_R);
safeSet(furniture_data, idx(87, 20), CHAIR_L);
safeSet(furniture_data, idx(90, 20), CHAIR_R);
safeSet(furniture_data, idx(81, 24), CHAIR_L);
safeSet(furniture_data, idx(84, 24), CHAIR_R);
safeSet(furniture_data, idx(87, 24), CHAIR_L);
safeSet(furniture_data, idx(90, 24), CHAIR_R);

// Sofas (casual seating)
placeSofa(93, 19, 4);
placeSofa(93, 22, 4);
placeSofa(93, 25, 4);

// Plants (lush break room)
placePlant(75, 18);
placePlant(75, 28);
placePlant(96, 18);
placePlant(96, 28);
placePlant(85, 18);
placePlant(91, 18);


// ============================================================================
// ██████  OPERATIONS CORRIDOR (Row 30-32)
// ============================================================================
fillFloor(1, 30, 98, 33, FLOOR_TILE);


// ============================================================================
// ██████  OPERATIONS FLOOR (Center, rows 33-55)
// ============================================================================

// ─── Product Team Area (Left, 1,33 to 24,48) ───
fillFloor(1, 33, 24, 48, FLOOR_WOOD);
buildWalls(1, 33, 24, 48, [[12, 33], [13, 33], [12, 47], [13, 47]]);

// Product team desk clusters (3 rows × 3 columns)
for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 3; col++) {
    placeMonitorDesk(4 + col * 6, 36 + row * 4);
  }
}

// Plants
placePlant(2, 34);
placePlant(22, 34);
placePlant(2, 46);
placePlant(22, 46);


// ─── Engineering Team Area (Center-Left, 26,33 to 49,48) ───
fillFloor(26, 33, 49, 48, FLOOR_WOOD);
buildWalls(26, 33, 49, 48, [[37, 33], [38, 33], [37, 47], [38, 47]]);

// Engineering desk clusters (3 rows × 3 columns)
for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 3; col++) {
    placeMonitorDesk(29 + col * 6, 36 + row * 4);
  }
}

// Plants
placePlant(27, 34);
placePlant(47, 34);
placePlant(27, 46);
placePlant(47, 46);


// ─── Design Team Area (Center-Right, 51,33 to 74,48) ───
fillFloor(51, 33, 74, 48, FLOOR_WOOD);
buildWalls(51, 33, 74, 48, [[62, 33], [63, 33], [62, 47], [63, 47]]);

// Design desk clusters (3 rows × 3 columns)
for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 3; col++) {
    placeMonitorDesk(54 + col * 6, 36 + row * 4);
  }
}

// Plants
placePlant(52, 34);
placePlant(72, 34);
placePlant(52, 46);
placePlant(72, 46);


// ─── AI Workforce Area (Right, 76,33 to 98,48) ───
fillFloor(76, 33, 98, 48, FLOOR_WOOD);
buildWalls(76, 33, 98, 48, [[86, 33], [87, 33], [86, 47], [87, 47]]);

// AI workforce desk clusters (3 rows × 3 columns)
for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 3; col++) {
    placeMonitorDesk(79 + col * 6, 36 + row * 4);
  }
}

// Plants
placePlant(77, 34);
placePlant(96, 34);
placePlant(77, 46);
placePlant(96, 46);


// ============================================================================
// ██████  LOWER CORRIDOR (Row 48-50)
// ============================================================================
fillFloor(1, 48, 98, 51, FLOOR_TILE);


// ============================================================================
// ██████  TRAINING ROOM (Bottom-Left, 1,51 to 20,63)
// ============================================================================
fillFloor(1, 51, 20, 63, FLOOR_CARPET);
buildWalls(1, 51, 20, 63, [[10, 51], [11, 51]]);

// Projector screen
placeWhiteboard(4, 52, 10);

// Rows of chairs (training seats facing forward)
for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 6; col++) {
    safeSet(furniture_data, idx(4 + col * 2, 55 + row * 2), CHAIR_L);
  }
}

// Podium desk
placeSingleDesk(9, 53);

// Plants
placePlant(2, 52);
placePlant(18, 52);
placePlant(2, 61);
placePlant(18, 61);


// ============================================================================
// ██████  PODCAST STUDIO (Bottom, 22,51 to 35,63)
// ============================================================================
fillFloor(22, 51, 35, 63, FLOOR_CARPET);
buildWalls(22, 51, 35, 63, [[28, 51], [29, 51]]);

// Podcast desk (microphone setup)
placeDeskPair(26, 55);
placeDeskPair(28, 55);
safeSet(above_data, 27, 55, MONITOR_L);
safeSet(above_data, 29, 55, MONITOR_R);

// Sound panels (whiteboards as acoustic panels)
placeWhiteboard(23, 52, 5);
placeWhiteboard(30, 52, 4);

// Guest chairs
safeSet(furniture_data, idx(27, 58), CHAIR_L);
safeSet(furniture_data, idx(29, 58), CHAIR_R);

// Plants
placePlant(23, 61);
placePlant(33, 61);


// ============================================================================
// ██████  OPERATIONS CENTER (Bottom-Center, 37,51 to 54,63)
// ============================================================================
fillFloor(37, 51, 54, 63, FLOOR_TILE);
buildWalls(37, 51, 54, 63, [[45, 51], [46, 51]]);

// Dashboard screens (multiple whiteboards)
placeWhiteboard(39, 52, 6);
placeWhiteboard(47, 52, 5);

// Monitoring desks
placeMonitorDesk(40, 55);
placeMonitorDesk(46, 55);
placeMonitorDesk(40, 58);
placeMonitorDesk(46, 58);

// Plants
placePlant(38, 52);
placePlant(52, 52);
placePlant(38, 61);
placePlant(52, 61);


// ============================================================================
// ██████  AI COMMAND CENTER (Bottom-Right, 56,51 to 73,63)
// ============================================================================
fillFloor(56, 51, 73, 63, FLOOR_CARPET);
buildWalls(56, 51, 73, 63, [[64, 51], [65, 51]]);

// Multiple AI monitoring screens
placeWhiteboard(58, 52, 12);

// AI workstations
placeMonitorDesk(59, 55);
placeMonitorDesk(65, 55);
placeMonitorDesk(59, 58);
placeMonitorDesk(65, 58);

// Server racks (edge AI servers)
placeServerRack(71, 53);
placeServerRack(71, 56);
placeServerRack(71, 59);

// Plants
placePlant(57, 52);
placePlant(57, 61);
placePlant(69, 61);


// ============================================================================
// ██████  MARKETPLACE ROOM (Bottom-Far-Right, 75,51 to 98,63)
// ============================================================================
fillFloor(75, 51, 98, 63, FLOOR_WOOD);
buildWalls(75, 51, 98, 63, [[86, 51], [87, 51]]);

// Display stands (product showcases)
for (let col = 0; col < 3; col++) {
  placeDeskPair(78 + col * 7, 54);
  placePlant(78 + col * 7, 53);
}

// Interactive zones (small desk + monitor stations)
placeMonitorDesk(80, 58);
placeMonitorDesk(86, 58);
placeMonitorDesk(92, 58);

// Sofas for browsing
placeSofa(76, 61, 4);
placeSofa(82, 61, 4);

// Plants
placePlant(76, 52);
placePlant(96, 52);
placePlant(96, 61);


// ============================================================================
// ██████  BOTTOM WING — Extra rooms (rows 65-78)
// ============================================================================

// ─── Lower corridor (Row 63-65) ───
fillFloor(1, 63, 98, 66, FLOOR_TILE);

// ─── Expansion Zone Left (1,66 to 48,78) — Open workspace for expansion ───
fillFloor(1, 66, 48, 78, FLOOR_WOOD);
buildWalls(1, 66, 48, 78, [[24, 66], [25, 66]]);

// Open plan desks — expansion ready
for (let row = 0; row < 2; row++) {
  for (let col = 0; col < 7; col++) {
    placeMonitorDesk(4 + col * 6, 69 + row * 4);
  }
}

// Plants along perimeter
for (let px = 2; px < 46; px += 10) {
  placePlant(px, 67);
  placePlant(px, 76);
}


// ─── Expansion Zone Right (50,66 to 98,78) — Future rooms ───
fillFloor(50, 66, 98, 78, FLOOR_WOOD);
buildWalls(50, 66, 98, 78, [[73, 66], [74, 66]]);

// Open plan desks — expansion ready
for (let row = 0; row < 2; row++) {
  for (let col = 0; col < 7; col++) {
    placeMonitorDesk(53 + col * 6, 69 + row * 4);
  }
}

// Plants along perimeter
for (let px = 51; px < 96; px += 10) {
  placePlant(px, 67);
  placePlant(px, 76);
}


// ============================================================================
// LAYER CONSTRUCTION
// ============================================================================

let layerId = 1;
function createLayer(name, data, visible = true) {
  return {
    data: [...data],
    height: H,
    id: layerId++,
    name: name,
    opacity: 1,
    type: "tilelayer",
    visible: visible,
    width: W,
    x: 0,
    y: 0
  };
}

const mapJson = {
  compressionlevel: -1,
  width: W,
  height: H,
  infinite: false,
  orientation: "orthogonal",
  renderorder: "right-down",
  tilewidth: 32,
  tileheight: 32,
  type: "map",
  version: "1.10",
  layers: [
    createLayer("start", start_data),
    createLayer("jitsiMeetingRoom", jitsi_data),
    createLayer("floor", floor_data),
    createLayer("walls", walls_data),
    createLayer("glassWalls", glass_data),
    createLayer("furniture", furniture_data),
    createLayer("aboveFurniture", above_data),
    createLayer("collisions", collision_data, false),
  ],
  tilesets: [
    {
      columns: 10, firstgid: 1,
      image: "tileset5_export.png",
      imageheight: 320, imagewidth: 320,
      name: "tileset5_export",
      tilecount: 100, tileheight: 32, tilewidth: 32
    },
    {
      columns: 10, firstgid: 101,
      image: "tileset6_export.png",
      imageheight: 320, imagewidth: 320,
      name: "tileset6_export",
      tilecount: 100, tileheight: 32, tilewidth: 32
    },
    {
      columns: 11, firstgid: 201,
      image: "tileset1.png",
      imageheight: 352, imagewidth: 352,
      name: "tileset1",
      tilecount: 121, tileheight: 32, tilewidth: 32
    },
    {
      columns: 11, firstgid: 322,
      image: "tileset1-repositioning.png",
      imageheight: 352, imagewidth: 352,
      name: "tileset1-repositioning",
      tilecount: 121, tileheight: 32, tilewidth: 32
    },
    {
      columns: 6, firstgid: 443,
      image: "Special_Zones.png",
      imageheight: 64, imagewidth: 192,
      name: "Special_Zones",
      tilecount: 12, tileheight: 32, tilewidth: 32
    }
  ]
};

// ============================================================================
// OUTPUT
// ============================================================================

const outputPath = path.join(__dirname, 'public', 'assets', 'hq-office.json');
fs.writeFileSync(outputPath, JSON.stringify(mapJson));

console.log(`\n✅ HQ Office map generated successfully!`);
console.log(`   Size: ${W}×${H} tiles (${W * 32}×${H * 32} pixels)`);
console.log(`   Layers: ${mapJson.layers.length}`);
console.log(`   Tilesets: ${mapJson.tilesets.length}`);
console.log(`   Output: ${outputPath}`);
console.log(`\n   Rooms:`);
console.log(`   ├── Executive Wing: CEO Office, CTO Office, CFO Office`);
console.log(`   ├── Reception Area`);
console.log(`   ├── Server Room`);
console.log(`   ├── Boardroom (glass walls, centerpiece)`);
console.log(`   ├── Meeting Room A & B`);
console.log(`   ├── Break Room (coffee, sofas)`);
console.log(`   ├── Operations: Product, Engineering, Design, AI Workforce`);
console.log(`   ├── Training Room`);
console.log(`   ├── Podcast Studio`);
console.log(`   ├── Operations Center`);
console.log(`   ├── AI Command Center`);
console.log(`   ├── Marketplace Room`);
console.log(`   └── Expansion Zones (×2)`);
