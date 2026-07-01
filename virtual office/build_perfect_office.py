import json

# ============================================================================
# SOVEREIGN PROTOCOL: ENTERPRISE OFFICE MAP BUILDER
# Recreates the office.png layout using real WorkAdventure tileset GIDs
# Map: 80 x 50 tiles (2560 x 1600 pixels)
# ============================================================================

W = 80
H = 50

# --- TILE ID REFERENCE (from tileset analysis) ---

# FLOORS (tileset1, firstgid=201)
FLOOR_WOOD    = 201   # Main wooden floor
FLOOR_CARPET  = 223   # Blue/grey carpet
FLOOR_TILE_W  = 141   # Warm tile floor (cafeteria)

# WALLS (tileset5_export, firstgid=1)
WALL_TOP      = 58    # Top horizontal wall
WALL_BOTTOM   = 63    # Bottom horizontal wall  
WALL_LEFT     = 45    # Left vertical wall
WALL_RIGHT    = 73    # Right vertical wall
WALL_TL       = 57    # Top-left corner
WALL_TR       = 59    # Top-right corner (approx)
WALL_BL       = 67    # Bottom-left corner (approx)
WALL_BR       = 69    # Bottom-right corner (approx)

# FURNITURE (tileset1-repositioning, firstgid=322)
DESK_TL       = 338   # Desk top-left (warm brown, 100% fill)
DESK_TR       = 339   # Desk top-right
DESK_BL       = 349   # Desk bottom-left
DESK_BR       = 350   # Desk bottom-right
DESK_SINGLE   = 340   # Single desk tile
BOOKSHELF_T   = 327   # Bookshelf top
BOOKSHELF_B   = 338   # Bookshelf bottom
CHAIR_L       = 325   # Chair facing left
CHAIR_R       = 326   # Chair facing right
CABINET_TL    = 356   # Filing cabinet (blue/cool)
CABINET_TR    = 357
CABINET_BL    = 367   # Filing cabinet bottom  
CABINET_BR    = 368
PLANT_POT     = 351   # Potted plant
LAMP          = 342   # Yellow lamp/light
MONITOR_L     = 363   # Computer monitor
MONITOR_R     = 374
TABLE_TL      = 394   # Table/whiteboard piece (white)
TABLE_TR      = 397
TABLE_BL      = 405
TABLE_BR      = 408
SERVER_T      = 392   # Server rack top
SERVER_B      = 393   # Server rack bottom
VENDING_T     = 433   # Vending/shelf top
VENDING_B     = 434   # Vending/shelf bottom
SOFA_L        = 371   # Sofa/couch piece
SOFA_R        = 372

# ABOVE-PLAYER ELEMENTS
WALL_DECO     = 384   # Wall decoration (above player)

# SPECIAL ZONES (Special_Zones.png, firstgid=443)
COLLISION     = 443   # Invisible collision block
SPAWN         = 444   # Player spawn point
JITSI_ZONE    = 454   # Jitsi meeting trigger zone

# --- EMPTY ---
E = 0

def idx(x, y):
    return y * W + x

# Initialize all layers
floor_data     = [FLOOR_WOOD] * (W * H)
walls_data     = [E] * (W * H)
furniture_data = [E] * (W * H)
above_data     = [E] * (W * H)
collision_data = [E] * (W * H)
start_data     = [E] * (W * H)
jitsi_data     = [E] * (W * H)

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def fill_floor(x1, y1, x2, y2, tile=FLOOR_WOOD):
    for y in range(y1, y2):
        for x in range(x1, x2):
            floor_data[idx(x, y)] = tile

def build_walls(x1, y1, x2, y2, door_positions=None):
    """Build walls around a rectangular room with optional doors."""
    if door_positions is None:
        door_positions = []
    
    for x in range(x1, x2):
        if (x, y1) not in door_positions:
            walls_data[idx(x, y1)] = WALL_TOP
            collision_data[idx(x, y1)] = COLLISION
        if (x, y2-1) not in door_positions:
            walls_data[idx(x, y2-1)] = WALL_BOTTOM
            collision_data[idx(x, y2-1)] = COLLISION
    
    for y in range(y1, y2):
        if (x1, y) not in door_positions:
            walls_data[idx(x1, y)] = WALL_LEFT
            collision_data[idx(x1, y)] = COLLISION
        if (x2-1, y) not in door_positions:
            walls_data[idx(x2-1, y)] = WALL_RIGHT
            collision_data[idx(x2-1, y)] = COLLISION

def place_desk_pair(x, y):
    """Place a 2x2 desk cluster with chairs."""
    furniture_data[idx(x, y)]     = DESK_TL
    furniture_data[idx(x+1, y)]   = DESK_TR
    furniture_data[idx(x, y+1)]   = DESK_BL
    furniture_data[idx(x+1, y+1)] = DESK_BR
    collision_data[idx(x, y)]     = COLLISION
    collision_data[idx(x+1, y)]   = COLLISION
    collision_data[idx(x, y+1)]   = COLLISION
    collision_data[idx(x+1, y+1)] = COLLISION

def place_single_desk(x, y, with_chair=True):
    """Place a single desk tile with optional chair below."""
    furniture_data[idx(x, y)] = DESK_SINGLE
    collision_data[idx(x, y)] = COLLISION
    if with_chair:
        furniture_data[idx(x, y+1)] = CHAIR_L
        collision_data[idx(x, y+1)] = COLLISION

def place_monitor_desk(x, y):
    """Place a desk with a monitor on it."""
    furniture_data[idx(x, y)]     = DESK_TL
    furniture_data[idx(x+1, y)]   = DESK_TR
    above_data[idx(x, y)]         = MONITOR_L
    collision_data[idx(x, y)]     = COLLISION
    collision_data[idx(x+1, y)]   = COLLISION
    furniture_data[idx(x, y+1)]   = CHAIR_L
    furniture_data[idx(x+1, y+1)] = CHAIR_R

def place_conference_table(cx, cy, size=3):
    """Place a round/large conference table."""
    for dy in range(-size//2, size//2+1):
        for dx in range(-size//2, size//2+1):
            furniture_data[idx(cx+dx, cy+dy)] = TABLE_TL if (dx+dy) % 2 == 0 else TABLE_TR
            collision_data[idx(cx+dx, cy+dy)] = COLLISION
    # Chairs around it
    for dx in range(-size//2-1, size//2+2):
        if cx+dx > 0 and cx+dx < W-1:
            if cy-size//2-1 > 0:
                furniture_data[idx(cx+dx, cy-size//2-1)] = CHAIR_L
            if cy+size//2+1 < H-1:
                furniture_data[idx(cx+dx, cy+size//2+1)] = CHAIR_R

def place_plant(x, y):
    furniture_data[idx(x, y)] = PLANT_POT
    collision_data[idx(x, y)] = COLLISION

def place_server_rack(x, y):
    furniture_data[idx(x, y)]   = SERVER_T
    furniture_data[idx(x, y+1)] = SERVER_B
    collision_data[idx(x, y)]   = COLLISION
    collision_data[idx(x, y+1)] = COLLISION

def place_cabinet(x, y):
    furniture_data[idx(x, y)]     = CABINET_TL
    furniture_data[idx(x+1, y)]   = CABINET_TR
    furniture_data[idx(x, y+1)]   = CABINET_BL
    furniture_data[idx(x+1, y+1)] = CABINET_BR
    collision_data[idx(x, y)]     = COLLISION
    collision_data[idx(x+1, y)]   = COLLISION
    collision_data[idx(x, y+1)]   = COLLISION
    collision_data[idx(x+1, y+1)] = COLLISION

def place_whiteboard(x, y, w=4):
    for dx in range(w):
        above_data[idx(x+dx, y)] = WALL_DECO
        collision_data[idx(x+dx, y)] = COLLISION

def place_vending(x, y):
    furniture_data[idx(x, y)]   = VENDING_T
    furniture_data[idx(x, y+1)] = VENDING_B
    collision_data[idx(x, y)]   = COLLISION
    collision_data[idx(x, y+1)] = COLLISION

def place_sofa(x, y, length=3):
    for dx in range(length):
        furniture_data[idx(x+dx, y)] = SOFA_L if dx == 0 else (SOFA_R if dx == length-1 else DESK_SINGLE)
        collision_data[idx(x+dx, y)] = COLLISION

def place_lamp(x, y):
    furniture_data[idx(x, y)] = LAMP
    collision_data[idx(x, y)] = COLLISION

def fill_jitsi_zone(x1, y1, x2, y2):
    for y in range(y1, y2):
        for x in range(x1, x2):
            jitsi_data[idx(x, y)] = JITSI_ZONE

# ============================================================================
# BUILD THE OUTER WALLS
# ============================================================================
build_walls(0, 0, W, H)

# ============================================================================
# ZONE 1: CEO EXECUTIVE SUITE (Top-Left, 1,1 to 20,14)
# ============================================================================
fill_floor(1, 1, 20, 14, FLOOR_CARPET)
build_walls(1, 1, 20, 14, door_positions=[(10, 13), (11, 13)])

# CEO's large executive desk
place_desk_pair(8, 6)
place_desk_pair(10, 6)
place_desk_pair(12, 6)

# Monitors on CEO desk
above_data[idx(9, 6)]  = MONITOR_L
above_data[idx(11, 6)] = MONITOR_L
above_data[idx(13, 6)] = MONITOR_R

# Filing cabinets along left wall
place_cabinet(2, 2)
place_cabinet(2, 5)
place_cabinet(2, 8)

# World map / whiteboard on back wall
place_whiteboard(6, 2, 8)

# Plants in corners
place_plant(18, 2)
place_plant(18, 12)
place_plant(5, 2)
place_plant(5, 12)

# Lamp
place_lamp(16, 3)

# Chairs in front of CEO desk
furniture_data[idx(9, 9)]  = CHAIR_L
furniture_data[idx(11, 9)] = CHAIR_R
furniture_data[idx(13, 9)] = CHAIR_L

# ============================================================================
# ZONE 2: CONFERENCE ROOM A (Top-Left, 1,16 to 18,28)
# ============================================================================
fill_floor(1, 16, 18, 28, FLOOR_CARPET)
build_walls(1, 16, 18, 28, door_positions=[(9, 27), (10, 27)])

# Round conference table
place_conference_table(9, 22, 3)

# Whiteboard on wall
place_whiteboard(3, 17, 5)

# Filing cabinets
place_cabinet(2, 18)
place_cabinet(15, 18)

# Plants
place_plant(2, 26)
place_plant(16, 26)
place_plant(2, 20)
place_plant(16, 20)

# Jitsi meeting zone
fill_jitsi_zone(4, 19, 14, 26)

# ============================================================================
# ZONE 3: CONFERENCE ROOM B (Bottom-Left, 1,30 to 18,43)
# ============================================================================
fill_floor(1, 30, 18, 43, FLOOR_CARPET)
build_walls(1, 30, 18, 43, door_positions=[(9, 42), (10, 42)])

# Round conference table
place_conference_table(9, 36, 3)

# Whiteboard
place_whiteboard(3, 31, 5)

# Cabinets and plants
place_cabinet(2, 32)
place_cabinet(15, 32)
place_plant(2, 41)
place_plant(16, 41)
place_plant(2, 34)
place_plant(16, 34)

# Jitsi meeting zone
fill_jitsi_zone(4, 33, 14, 40)

# ============================================================================
# ZONE 4: CENTRAL HUB / MAIN LOBBY (Center, 20,1 to 50,25)
# ============================================================================
fill_floor(20, 1, 50, 25, FLOOR_WOOD)
build_walls(20, 1, 50, 25, door_positions=[
    (20, 7), (20, 8),     # Door to CEO suite corridor
    (35, 24), (36, 24),   # Door to bottom corridor
    (49, 7), (49, 8),     # Door to server room
])

# "AI BUSINESS NETWORK - CENTRAL HUB" sign (whiteboard)
place_whiteboard(28, 2, 14)

# Executive work desks (3 rows of paired desks)
for row in range(3):
    for col in range(4):
        place_monitor_desk(24 + col*6, 6 + row*5)

# Plants around the hub
for px in [22, 47]:
    for py in [3, 12, 20]:
        place_plant(px, py)

# Lamps
place_lamp(26, 3)
place_lamp(44, 3)

# ============================================================================
# ZONE 5: SERVER ROOM (Top-Right, 52,1 to 68,15)
# ============================================================================
fill_floor(52, 1, 68, 15, FLOOR_TILE_W)
build_walls(52, 1, 68, 15, door_positions=[(52, 7), (52, 8)])

# Server racks in rows
for sx in range(55, 66, 3):
    for sy in range(3, 12, 3):
        place_server_rack(sx, sy)

# Monitoring desk
place_monitor_desk(53, 12)

# Plant
place_plant(66, 2)
place_plant(66, 13)

# ============================================================================
# ZONE 6: BREAK ROOM / GAME ROOM (Top-Right, 52,17 to 68,28)
# ============================================================================
fill_floor(52, 17, 68, 28, FLOOR_WOOD)
build_walls(52, 17, 68, 28, door_positions=[(52, 22), (52, 23)])

# Pool table (large 4x2 table)
for dx in range(4):
    for dy in range(2):
        furniture_data[idx(58+dx, 21+dy)] = TABLE_TL if (dx+dy) % 2 == 0 else TABLE_TR
        collision_data[idx(58+dx, 21+dy)] = COLLISION

# Vending machines along right wall
place_vending(66, 18)
place_vending(66, 21)
place_vending(66, 24)

# Sofa
place_sofa(53, 19, 4)
place_sofa(53, 26, 4)

# Plants
place_plant(53, 18)
place_plant(64, 18)
place_plant(53, 27)

# ============================================================================
# ZONE 7: ENGINEERING BULLPEN (Bottom-Center, 20,27 to 50,48)
# ============================================================================
fill_floor(20, 27, 50, 48, FLOOR_WOOD)
build_walls(20, 27, 50, 48, door_positions=[
    (35, 27), (36, 27),   # Door to central hub
    (49, 35), (49, 36),   # Door to right wing
])

# Developer workstations - rows of individual desks with monitors
for row in range(4):
    for col in range(5):
        x = 23 + col * 5
        y = 30 + row * 4
        place_single_desk(x, y)
        place_single_desk(x+2, y)
        above_data[idx(x, y)] = MONITOR_L
        above_data[idx(x+2, y)] = MONITOR_R

# Plants scattered
place_plant(21, 28)
place_plant(48, 28)
place_plant(21, 46)
place_plant(48, 46)
place_plant(34, 28)

# ============================================================================
# ZONE 8: MARKETING / SALES WING (Bottom-Right, 52,27 to 68,43)
# ============================================================================
fill_floor(52, 27, 68, 43, FLOOR_CARPET)
build_walls(52, 27, 68, 43, door_positions=[(52, 35), (52, 36)])

# Desk clusters
for row in range(3):
    for col in range(2):
        place_monitor_desk(55 + col*6, 30 + row*4)

# Filing cabinets
place_cabinet(53, 28)
place_cabinet(65, 28)

# Plants
place_plant(53, 41)
place_plant(66, 41)

# ============================================================================
# ZONE 9: CAFETERIA / LOUNGE (Bottom-Right, 70,1 to 79,48)
# ============================================================================
fill_floor(70, 1, 79, 48, FLOOR_TILE_W)
build_walls(70, 1, 79, 48, door_positions=[(70, 10), (70, 11)])

# Long cafeteria tables
for ty in range(5, 44, 6):
    for dx in range(3):
        furniture_data[idx(72+dx, ty)]   = DESK_TL if dx == 0 else (DESK_TR if dx == 2 else DESK_SINGLE)
        collision_data[idx(72+dx, ty)]   = COLLISION
    furniture_data[idx(71, ty)] = CHAIR_L
    furniture_data[idx(76, ty)] = CHAIR_R

# Vending machines along right wall
place_vending(77, 3)
place_vending(77, 8)
place_vending(77, 13)

# Plants
for py in range(3, 46, 8):
    place_plant(71, py)

# ============================================================================
# CORRIDORS: Connect all zones
# ============================================================================

# Vertical corridor (center spine, x=19-20)
fill_floor(18, 14, 22, 30, FLOOR_WOOD)

# Horizontal corridor (bottom connector)
fill_floor(18, 43, 70, 48, FLOOR_WOOD)

# Right-side corridor connecting server/break/marketing
fill_floor(50, 14, 52, 28, FLOOR_WOOD)

# Right-side vertical connector to cafeteria
fill_floor(68, 1, 70, 48, FLOOR_WOOD)

# ============================================================================
# SPAWN POINT (Center of the central hub)
# ============================================================================
start_data[idx(35, 15)] = SPAWN

# ============================================================================
# LAYER CONSTRUCTION
# ============================================================================

def create_layer(name, data, visible=True):
    return {
        "data": data[:],
        "height": H,
        "id": hash(name) % 1000,
        "name": name,
        "opacity": 1,
        "type": "tilelayer",
        "visible": visible,
        "width": W,
        "x": 0,
        "y": 0
    }

map_json = {
    "compressionlevel": -1,
    "width": W,
    "height": H,
    "infinite": False,
    "orientation": "orthogonal",
    "renderorder": "right-down",
    "tilewidth": 32,
    "tileheight": 32,
    "type": "map",
    "version": "1.10",
    "layers": [
        create_layer("start", start_data),
        create_layer("jitsiMeetingRoom", jitsi_data),
        create_layer("floor", floor_data),
        create_layer("walls", walls_data),
        create_layer("furniture", furniture_data),
        create_layer("aboveFurniture", above_data),
        create_layer("collisions", collision_data, visible=False),
    ],
    "tilesets": [
        {
            "columns": 10, "firstgid": 1,
            "image": "tileset5_export.png",
            "imageheight": 320, "imagewidth": 320,
            "name": "tileset5_export",
            "tilecount": 100, "tileheight": 32, "tilewidth": 32
        },
        {
            "columns": 10, "firstgid": 101,
            "image": "tileset6_export.png",
            "imageheight": 320, "imagewidth": 320,
            "name": "tileset6_export",
            "tilecount": 100, "tileheight": 32, "tilewidth": 32
        },
        {
            "columns": 11, "firstgid": 201,
            "image": "tileset1.png",
            "imageheight": 352, "imagewidth": 352,
            "name": "tileset1",
            "tilecount": 121, "tileheight": 32, "tilewidth": 32
        },
        {
            "columns": 11, "firstgid": 322,
            "image": "tileset1-repositioning.png",
            "imageheight": 352, "imagewidth": 352,
            "name": "tileset1-repositioning",
            "tilecount": 121, "tileheight": 32, "tilewidth": 32
        },
        {
            "columns": 6, "firstgid": 443,
            "image": "Special_Zones.png",
            "imageheight": 64, "imagewidth": 192,
            "name": "Special_Zones",
            "tilecount": 12, "tileheight": 32, "tilewidth": 32
        }
    ]
}

output_path = r'd:\College\Projects\AI BUSSINESS\git_hub_branch\virtual office\virtual-office-web\public\assets\perfect-office.json'
with open(output_path, 'w') as f:
    json.dump(map_json, f)

print(f"Perfect office map generated: {W}x{H} tiles ({W*32}x{H*32} pixels)")
print(f"Zones: CEO Suite, 2x Conference Rooms, Central Hub, Server Room, Break Room, Engineering Bullpen, Marketing Wing, Cafeteria")
print(f"Output: {output_path}")
