import json
import os
from PIL import Image
import math

def color_distance(c1, c2):
    return math.sqrt(sum((a - b) ** 2 for a, b in zip(c1, c2)))

def closest_tile_type(color):
    r, g, b = color
    # Define our known blueprint colors and their corresponding Tile IDs
    palette = {
        "WALL": ((0, 0, 0), {"floor": 201, "walls": 58, "furniture": 0, "collision": 443}),
        "FLOOR": ((70, 80, 90), {"floor": 201, "walls": 0, "furniture": 0, "collision": 0}),
        "DESK": ((70, 30, 20), {"floor": 201, "walls": 0, "furniture": 340, "collision": 443}),
        "PLANT": ((20, 80, 60), {"floor": 201, "walls": 0, "furniture": 351, "collision": 443}),
        "CARPET": ((100, 110, 120), {"floor": 223, "walls": 0, "furniture": 0, "collision": 0})
    }
    
    best_dist = float('inf')
    best_type = "FLOOR"
    for name, (pal_color, tiles) in palette.items():
        dist = color_distance(color, pal_color)
        if dist < best_dist:
            best_dist = dist
            best_type = name
            
    return palette[best_type][1]

def build_map():
    img = Image.open('office.png').convert('RGB')
    width, height = img.size
    
    tile_w, tile_h = 32, 32
    grid_w = width // tile_w
    grid_h = height // tile_h
    
    floor_data = [0] * (grid_w * grid_h)
    walls_data = [0] * (grid_w * grid_h)
    furn_data = [0] * (grid_w * grid_h)
    coll_data = [0] * (grid_w * grid_h)
    start_data = [0] * (grid_w * grid_h)
    
    for gy in range(grid_h):
        for gx in range(grid_w):
            idx = gy * grid_w + gx
            px = gx * tile_w + (tile_w // 2)
            py = gy * tile_h + (tile_h // 2)
            color = img.getpixel((px, py))
            
            tiles = closest_tile_type(color)
            floor_data[idx] = tiles["floor"]
            walls_data[idx] = tiles["walls"]
            furn_data[idx] = tiles["furniture"]
            coll_data[idx] = tiles["collision"]
            
            # Place a spawn point near the center if it's empty floor
            if gx == grid_w // 2 and gy == grid_h // 2:
                start_data[idx] = 444
    
    def create_layer(name, data):
        return {
            "data": data, "height": grid_h, "name": name, "opacity": 1, 
            "type": "tilelayer", "visible": True, "width": grid_w, "x": 0, "y": 0
        }

    map_json = {
        "width": grid_w,
        "height": grid_h,
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

    with open(r'd:\College\Projects\AI BUSSINESS\git_hub_branch\virtual office\virtual-office-web\public\assets\custom-office.json', 'w') as f:
        json.dump(map_json, f)

    print("custom-office.json successfully compiled from office.png!")

if __name__ == "__main__":
    build_map()
