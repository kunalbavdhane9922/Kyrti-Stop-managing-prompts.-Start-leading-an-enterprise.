import os
import shutil
import struct

def get_image_info(filepath):
    try:
        with open(filepath, 'rb') as f:
            data = f.read(24)
            if data.startswith(b'\211PNG\r\n\032\n') and data[12:16] == b'IHDR':
                w, h = struct.unpack('>LL', data[16:24])
                return 'PNG', w, h
            elif data.startswith(b'\xff\xd8'):
                return 'JPEG', 0, 0
            elif data.startswith(b'GIF87a') or data.startswith(b'GIF89a'):
                w, h = struct.unpack('<HH', data[6:10])
                return 'GIF', w, h
    except Exception:
        pass
    return None, 0, 0

src_dir = r'd:\College\Projects\AI BUSSINESS\git_hub_branch\virtual office\workadventure-master'
dst_dir = r'd:\College\Projects\AI BUSSINESS\git_hub_branch\virtual office\office image components'

if not os.path.exists(dst_dir):
    os.makedirs(dst_dir)

count = 0
for root, dirs, files in os.walk(src_dir):
    if 'node_modules' in root or '.git' in root:
        continue
    for file in files:
        ext = os.path.splitext(file)[1].lower()
        if ext in ['.png', '.jpg', '.jpeg', '.gif', '.svg']:
            src_path = os.path.join(root, file)
            img_type, w, h = get_image_info(src_path)
            
            # Determine category
            if ext == '.svg':
                category = 'Vector_SVG'
            elif w > 0 and h > 0:
                if w == h and w <= 128:
                    category = 'Icons_and_Small'
                elif w % 32 == 0 and h % 32 == 0 and w >= 256:
                    category = 'Tilesets_32x'
                elif w >= 1920:
                    category = 'Large_Backgrounds'
                else:
                    category = f'Props_{w}x{h}'
            else:
                category = f'Other_{ext.replace(".", "").upper()}'

            # Avoid extremely long folder names
            category_path = os.path.join(dst_dir, category)
            if not os.path.exists(category_path):
                os.makedirs(category_path)

            dst_path = os.path.join(category_path, file)
            
            # Handle duplicates
            base, ext = os.path.splitext(file)
            counter = 1
            while os.path.exists(dst_path):
                dst_path = os.path.join(category_path, f'{base}_{counter}{ext}')
                counter += 1
                
            shutil.copy2(src_path, dst_path)
            count += 1

print(f'Successfully sorted and copied {count} images to {dst_dir}')
