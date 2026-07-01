import json
import os

class MapExpander:
    def __init__(self, map_path):
        self.map_path = map_path

    def validate_schema(self, map_data):
        if "width" not in map_data or "height" not in map_data or "layers" not in map_data:
            raise ValueError("Invalid map schema")
        return True

    def inject_desk_cluster(self, req_width=10, req_height=10):
        if not os.path.exists(self.map_path):
            raise FileNotFoundError("Map not found")
            
        with open(self.map_path, 'r', encoding='utf-8') as f:
            map_data = json.load(f)
            
        self.validate_schema(map_data)
        
        old_w = map_data["width"]
        old_h = map_data["height"]
        new_w = old_w + req_width
        new_h = old_h + req_height
        
        map_data["width"] = new_w
        map_data["height"] = new_h
        
        for layer in map_data["layers"]:
            if "data" in layer:
                old_data = layer["data"]
                new_data = [0] * (new_w * new_h)
                for y in range(old_h):
                    for x in range(old_w):
                        new_data[y * new_w + x] = old_data[y * old_w + x]
                layer["data"] = new_data
                layer["width"] = new_w
                layer["height"] = new_h
                
        with open(self.map_path, 'w', encoding='utf-8') as f:
            json.dump(map_data, f)
            
        return {"success": True, "new_width": new_w, "new_height": new_h}
