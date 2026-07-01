from PIL import Image
import os

assets_dir = r'd:\College\Projects\AI BUSSINESS\git_hub_branch\virtual office\virtual-office-web\public\assets'

# Analyze each tile's average color to understand what each GID looks like
tilesets = [
    ('tileset1.png', 201, 11),
    ('tileset5_export.png', 1, 10),
    ('tileset6_export.png', 101, 10),
    ('tileset1-repositioning.png', 322, 11),
]

for ts_name, firstgid, cols in tilesets:
    path = os.path.join(assets_dir, ts_name)
    img = Image.open(path).convert('RGBA')
    w, h = img.size
    rows = h // 32
    
    print(f'\n=== {ts_name} (firstgid={firstgid}) ===')
    for row in range(rows):
        for col in range(cols):
            gid = firstgid + row * cols + col
            tile = img.crop((col*32, row*32, col*32+32, row*32+32))
            pixels = list(tile.getdata())
            
            # Check transparency
            transparent = sum(1 for p in pixels if p[3] < 128)
            total = len(pixels)
            
            if transparent > total * 0.9:
                continue  # Skip mostly transparent tiles
            
            avg_r = sum(p[0] for p in pixels if p[3] > 128) // max(1, total - transparent)
            avg_g = sum(p[1] for p in pixels if p[3] > 128) // max(1, total - transparent)
            avg_b = sum(p[2] for p in pixels if p[3] > 128) // max(1, total - transparent)
            
            # Classify by color
            brightness = (avg_r + avg_g + avg_b) / 3
            if avg_r > 150 and avg_g < 100: tag = 'RED'
            elif avg_g > 120 and avg_r < 100: tag = 'GREEN'
            elif avg_b > 150 and avg_r < 100: tag = 'BLUE'
            elif brightness > 200: tag = 'WHITE'
            elif brightness < 50: tag = 'DARK'
            elif avg_r > avg_g and avg_r > avg_b: tag = 'WARM'
            elif avg_g > avg_r and avg_g > avg_b: tag = 'NATURE'
            elif avg_b > avg_r and avg_b > avg_g: tag = 'COOL'
            else: tag = 'NEUTRAL'
            
            print(f'  GID {gid}: row={row} col={col} avg=({avg_r},{avg_g},{avg_b}) fill={100-int(transparent/total*100)}% [{tag}]')
