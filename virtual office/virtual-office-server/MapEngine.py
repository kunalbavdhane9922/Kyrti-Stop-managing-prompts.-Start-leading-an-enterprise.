import json
import os
import copy

MAP_PATH = r"D:\College\Projects\AI BUSSINESS\git_hub_branch\virtual-office-web\public\assets\office-map.json"

# Tile IDs
FLOOR_TILE = 30
CARPET_TILE = 65
WALL_TOP = 15
WALL_SIDE = 16
DESK_TILE = 142
CHAIR_TILE = 148
COLLISION_TILE = 1
EMPTY_TILE = 0 # Fixed: Phaser requires 0 for transparent empty tiles

def calculate_optimal_expansion(map_data, req_width, req_height):
    width = map_data["width"]
    height = map_data["height"]
    collisions = next(l for l in map_data["layers"] if l["name"] == "collisions")["data"]
    
    max_x, max_y = 0, 0
    for idx, tile_val in enumerate(collisions):
        if tile_val not in [-1, 0, EMPTY_TILE]: # Valid collision
            x = idx % width
            y = idx // width
            max_x = max(max_x, x)
            max_y = max(max_y, y)
            
    padding_x = 2
    padding_y = 2
    target_width = max_x + req_width + padding_x
    target_height = max_y + req_height + padding_y
    
    add_width = max(0, target_width - width)
    add_height = max(0, target_height - height)
    
    return add_width, add_height, max_x + 1, max_y + 1

def expand_map_perfectly(map_data, req_width, req_height):
    add_w, add_h, append_x, append_y = calculate_optimal_expansion(map_data, req_width, req_height)
    
    if add_w > 0 or add_h > 0:
        new_width = map_data["width"] + add_w
        new_height = map_data["height"] + add_h
        
        for layer in map_data["layers"]:
            if "data" not in layer: continue
            
            old_data = layer["data"]
            fill_tile = FLOOR_TILE if layer["name"] == "floor" else EMPTY_TILE
            new_data = [fill_tile] * (new_width * new_height)
            
            for y in range(map_data["height"]):
                for x in range(map_data["width"]):
                    old_idx = y * map_data["width"] + x
                    # Pad safely preserving arrays by ignoring corrupted invalid old lengths
                    if old_idx < len(old_data):
                        new_data[y * new_width + x] = old_data[old_idx]
                    
            layer["data"] = new_data
            layer["width"] = new_width
            layer["height"] = new_height
            
        map_data["width"] = new_width
        map_data["height"] = new_height
        
    return append_x, append_y, (add_w > 0 or add_h > 0)

def find_empty_region(collisions_data, map_width, map_height, req_width, req_height):
    PAD = 2
    for sy in range(PAD, map_height - req_height - PAD):
        for sx in range(PAD, map_width - req_width - PAD):
            fits = True
            for dy in range(req_height):
                for dx in range(req_width):
                    idx = (sy + dy) * map_width + (sx + dx)
                    if idx >= len(collisions_data) or collisions_data[idx] not in [-1, 0, EMPTY_TILE]:
                        fits = False
                        break
                if not fits:
                    break
            if fits:
                return (sx, sy)
    return None

def stamp_office_cabin(map_width, floor_layer, walls_layer, furniture_layer, collisions_layer, start_x, start_y, width, height, chairs):
    desk_positions = []
    for y in range(start_y, start_y + height):
        for x in range(start_x, start_x + width):
            idx = y * map_width + x
            floor_layer["data"][idx] = CARPET_TILE
            
            if y == start_y or y == start_y + height - 1 or x == start_x or x == start_x + width - 1:
                if y == start_y + height - 1 and x == start_x + width // 2:
                    walls_layer["data"][idx] = EMPTY_TILE
                    collisions_layer["data"][idx] = EMPTY_TILE
                else:
                    walls_layer["data"][idx] = WALL_TOP
                    collisions_layer["data"][idx] = COLLISION_TILE
            else:
                walls_layer["data"][idx] = EMPTY_TILE
                collisions_layer["data"][idx] = EMPTY_TILE
                
            if furniture_layer:
                furniture_layer["data"][idx] = EMPTY_TILE
                
    if furniture_layer:
        cx, cy = start_x + width // 2, start_y + height // 2
        idx = cy * map_width + cx
        furniture_layer["data"][idx] = DESK_TILE
        collisions_layer["data"][idx] = COLLISION_TILE
        if chairs >= 1: 
            furniture_layer["data"][idx + map_width] = CHAIR_TILE
        desk_positions.append({"x": cx, "y": cy + 1})
        
    return desk_positions

def stamp_desk_cluster(map_width, floor_layer, walls_layer, furniture_layer, collisions_layer, start_x, start_y, width, height):
    desk_positions = []
    for y in range(start_y, start_y + height):
        for x in range(start_x, start_x + width):
            idx = y * map_width + x
            floor_layer["data"][idx] = FLOOR_TILE
            walls_layer["data"][idx] = EMPTY_TILE
            collisions_layer["data"][idx] = EMPTY_TILE
            if furniture_layer: furniture_layer["data"][idx] = EMPTY_TILE
            
    if furniture_layer:
        for dx, dy in [(1,1), (3,1), (1,3), (3,3)]:
            cx, cy = start_x + dx, start_y + dy
            idx = cy * map_width + cx
            furniture_layer["data"][idx] = DESK_TILE
            collisions_layer["data"][idx] = COLLISION_TILE
            furniture_layer["data"][idx + map_width] = CHAIR_TILE
            desk_positions.append({"x": cx, "y": cy + 1})
            
    return desk_positions

def build_infrastructure(item_type="office_cabin", config=None):
    if config is None:
        config = {}
        
    width = config.get("width", 8)
    height = config.get("height", 6)
    chairs = config.get("chairs", 1)
    
    if item_type == "desk_cluster":
        width = 6
        height = 5
    elif item_type == "ai_agent":
        width = 2
        height = 2

    if not os.path.exists(MAP_PATH):
        return {"success": False, "reason": "Map not found"}
        
    with open(MAP_PATH, "r", encoding="utf-8") as f:
        map_data = json.load(f)
        
    floor_layer = next((l for l in map_data["layers"] if l["name"] == "floor"), None)
    walls_layer = next((l for l in map_data["layers"] if l["name"] == "walls"), None)
    furniture_layer = next((l for l in map_data["layers"] if l["name"] == "furniture"), None)
    collisions_layer = next((l for l in map_data["layers"] if l["name"] == "collisions"), None)
    
    if not floor_layer or not walls_layer or not collisions_layer:
        return {"success": False, "reason": "Required layers missing"}

    map_expanded = False
    pos = find_empty_region(collisions_layer["data"], map_data["width"], map_data["height"], width, height)
    
    if not pos:
        pos_x, pos_y, map_expanded = expand_map_perfectly(map_data, width, height)
        pos = (pos_x, pos_y)

    if not pos:
        return {"success": False, "reason": "Could not allocate space mathematically."}
        
    start_x, start_y = pos
    map_width = map_data["width"]
    map_height = map_data["height"]
    
    desk_positions = []
    zones = []
    
    if item_type == "office_cabin":
        desk_positions = stamp_office_cabin(map_width, floor_layer, walls_layer, furniture_layer, collisions_layer, start_x, start_y, width, height, chairs)
        zones.append({
            "id": f"cabin_{start_x}_{start_y}",
            "name": "Private Cabin",
            "x": start_x, "y": start_y, "w": width, "h": height,
            "private": True
        })
        
    elif item_type == "desk_cluster":
        desk_positions = stamp_desk_cluster(map_width, floor_layer, walls_layer, furniture_layer, collisions_layer, start_x, start_y, width, height)
                
    elif item_type == "ai_agent":
        desk_positions.append({"x": start_x, "y": start_y})

    # CRITICAL MATH VALIDATION STEP
    # Validate that every layer's data array length EXACTLY matches new_width * new_height
    expected_length = map_width * map_height
    for layer in map_data["layers"]:
        if "data" in layer:
            if len(layer["data"]) != expected_length:
                # Pad out arrays to fix the length mismatch corruption
                fill_tile = FLOOR_TILE if layer["name"] == "floor" else EMPTY_TILE
                if len(layer["data"]) > expected_length:
                    layer["data"] = layer["data"][:expected_length]
                else:
                    layer["data"].extend([fill_tile] * (expected_length - len(layer["data"])))

    with open(MAP_PATH, "w", encoding="utf-8") as f:
        json.dump(map_data, f)

    return {
        "success": True,
        "fullReload": map_expanded,
        "changes": [], 
        "zones": zones,
        "deskPositions": desk_positions
    }
