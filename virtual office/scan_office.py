import os
from PIL import Image
from collections import Counter

try:
    img = Image.open('office.png').convert('RGB')
    width, height = img.size
    print(f'Image size: {width}x{height}')
    
    tile_w, tile_h = 32, 32
    grid_w = width // tile_w
    grid_h = height // tile_h
    
    colors = []
    # Sample the center pixel of every 32x32 block
    for gy in range(grid_h):
        for gx in range(grid_w):
            px = gx * tile_w + (tile_w // 2)
            py = gy * tile_h + (tile_h // 2)
            r, g, b = img.getpixel((px, py))
            # Quantize color slightly to group similar ones
            r = (r // 10) * 10
            g = (g // 10) * 10
            b = (b // 10) * 10
            colors.append((r, g, b))
            
    c = Counter(colors)
    print('Most common quantized block colors:')
    for color, count in c.most_common(10):
        print(f'{color}: {count} blocks')
except Exception as e:
    print('Error:', e)
