import json
import os

WIDTH = 88
HEIGHT = 48

def create_layer(name, data):
    return {
        "data": data,
        "height": HEIGHT,
        "name": name,
        "opacity": 1,
        "type": "tilelayer",
        "visible": True,
        "width": WIDTH,
        "x": 0,
        "y": 0
    }

def idx(x, y):
    return y * WIDTH + x

floor_data = [201] * (WIDTH * HEIGHT)
walls_data = [0] * (WIDTH * HEIGHT)
furn_data = [0] * (WIDTH * HEIGHT)
coll_data = [0] * (WIDTH * HEIGHT)
start_data = [0] * (WIDTH * HEIGHT)

# Create outer walls
for x in range(WIDTH):
    walls_data[idx(x, 0)] = 58
    coll_data[idx(x, 0)] = 443
    walls_data[idx(x, HEIGHT - 1)] = 63
    coll_data[idx(x, HEIGHT - 1)] = 443
for y in range(HEIGHT):
    walls_data[idx(0, y)] = 45
    coll_data[idx(0, y)] = 443
    walls_data[idx(WIDTH - 1, y)] = 73
    coll_data[idx(WIDTH - 1, y)] = 443

def build_room(start_x, start_y, w, h, door_x, door_y):
    for x in range(start_x, start_x + w):
        walls_data[idx(x, start_y)] = 58
        coll_data[idx(x, start_y)] = 443
        walls_data[idx(x, start_y + h - 1)] = 63
        coll_data[idx(x, start_y + h - 1)] = 443
    for y in range(start_y, start_y + h):
        walls_data[idx(start_x, y)] = 45
        coll_data[idx(start_x, y)] = 443
        walls_data[idx(start_x + w - 1, y)] = 73
        coll_data[idx(start_x + w - 1, y)] = 443
    
    # Door
    walls_data[idx(door_x, door_y)] = 0
    coll_data[idx(door_x, door_y)] = 0

def stamp_desk(x, y):
    furn_data[idx(x, y)] = 340
    coll_data[idx(x, y)] = 443
    furn_data[idx(x+1, y)] = 325
    coll_data[idx(x+1, y)] = 443

# Build Executive Suites (Top Left)
build_room(2, 2, 20, 15, 12, 16)
stamp_desk(10, 8)
stamp_desk(14, 8)

# Build Engineering Bullpen (Top Right)
build_room(40, 2, 40, 25, 40, 15)
for dx in range(45, 75, 5):
    for dy in range(6, 20, 4):
        stamp_desk(dx, dy)

# Build Marketing / Sales (Bottom Left)
build_room(2, 25, 30, 20, 32, 35)
for dx in range(6, 25, 5):
    for dy in range(30, 40, 4):
        stamp_desk(dx, dy)

# Build Cafeteria / Lounge (Bottom Right)
build_room(50, 30, 35, 15, 50, 35)
for dx in range(55, 80, 8):
    for dy in range(35, 42, 6):
        stamp_desk(dx, dy) # use desks as tables for now

start_data[idx(35, 25)] = 444 # Spawn in center lobby

map_json = {
    "width": WIDTH,
    "height": HEIGHT,
    "tilewidth": 32,
    "tileheight": 32,
    "orientation": "orthogonal",
    "layers": [
        create_layer("start", start_data),
        create_layer("floor", floor_data),
        create_layer("walls", walls_data),
        create_layer("furniture", furn_data),
        create_layer("collisions", coll_data)
    ],
    "tilesets": [
        {"firstgid": 1, "image": "../assets/tileset5_export.png", "name": "tileset5_export", "tilewidth": 32, "tileheight": 32, "imagewidth": 512, "imageheight": 512},
        {"firstgid": 101, "image": "../assets/tileset6_export.png", "name": "tileset6_export", "tilewidth": 32, "tileheight": 32, "imagewidth": 512, "imageheight": 512},
        {"firstgid": 201, "image": "../assets/tileset1.png", "name": "tileset1", "tilewidth": 32, "tileheight": 32, "imagewidth": 512, "imageheight": 512},
        {"firstgid": 322, "image": "../assets/tileset1-repositioning.png", "name": "tileset1-repositioning", "tilewidth": 32, "tileheight": 32, "imagewidth": 512, "imageheight": 512},
        {"firstgid": 443, "image": "../assets/Special_Zones.png", "name": "Special_Zones", "tilewidth": 32, "tileheight": 32, "imagewidth": 512, "imageheight": 512}
    ]
}

with open(r'd:\College\Projects\AI BUSSINESS\git_hub_branch\virtual office\virtual-office-web\public\assets\big-office.json', 'w') as f:
    json.dump(map_json, f)

print("big-office.json successfully generated!")
