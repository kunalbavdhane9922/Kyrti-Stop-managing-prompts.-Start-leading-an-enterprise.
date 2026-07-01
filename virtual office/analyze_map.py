import json
from collections import Counter

map_path = r'd:\College\Projects\AI BUSSINESS\git_hub_branch\virtual office\virtual-office-web\public\assets\workadventure-map.json'
try:
    map_data = json.load(open(map_path, encoding='utf-8'))
    print('Tilesets:')
    for ts in map_data.get('tilesets', []):
        print(f"  {ts['name']}: firstgid={ts['firstgid']}, image={ts['image']}")

    print('\nMost common tiles per layer:')
    for layer in map_data.get('layers', []):
        if 'data' in layer:
            c = Counter([x for x in layer['data'] if x > 0])
            print(f"Layer {layer['name']}: {c.most_common(5)}")
except Exception as e:
    print('Error:', e)
