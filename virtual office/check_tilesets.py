from PIL import Image
import os

tilesets = [
    ('tileset1.png', 201),
    ('tileset5_export.png', 1),
    ('tileset6_export.png', 101),
    ('tileset1-repositioning.png', 322),
    ('Special_Zones.png', 443)
]

assets_dir = r'd:\College\Projects\AI BUSSINESS\git_hub_branch\virtual office\virtual-office-web\public\assets'

for ts_name, firstgid in tilesets:
    path = os.path.join(assets_dir, ts_name)
    if os.path.exists(path):
        img = Image.open(path)
        w, h = img.size
        cols = w // 32
        rows = h // 32
        total = cols * rows
        print(f'{ts_name}: {w}x{h}px, {cols}x{rows} grid, {total} tiles (GID {firstgid}-{firstgid+total-1})')
    else:
        print(f'{ts_name}: NOT FOUND')
