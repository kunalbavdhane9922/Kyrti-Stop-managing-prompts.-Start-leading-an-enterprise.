import os

files_to_include = [
    ('virtual-office-web/src/App.jsx', 'jsx'),
    ('virtual-office-web/src/GameComponent.jsx', 'jsx'),
    ('virtual-office-web/src/index.css', 'css'),
    ('virtual-office-server/MapEngine.py', 'python'),
    ('compile_office.py', 'python'),
    ('generate_big_office.py', 'python')
]

md_content = "# Virtual Office Source Code\n\nThis file contains the complete, updated source code for the requested components of the Sovereign Virtual Office.\n\n"

for idx, (filepath, lang) in enumerate(files_to_include, 1):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        md_content += f"## {idx}. {filepath}\n`{lang}\n{content}\n`\n\n"
    except Exception as e:
        md_content += f"## {idx}. {filepath}\nError reading file: {e}\n\n"

with open('officecode.md', 'w', encoding='utf-8') as f:
    f.write(md_content)

print("officecode.md updated successfully.")
