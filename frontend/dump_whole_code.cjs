const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const outputFile = path.join(__dirname, 'wholecode.md');

let output = '# Sovereign Protocol Complete Codebase\n\n';

const INCLUDE_EXTS = ['.js', '.jsx', '.css', '.html', '.json', '.md'];
const EXCLUDE_DIRS = ['node_modules', 'dist', '.git', 'public'];
const EXCLUDE_FILES = ['package-lock.json', 'wholecode.md', 'whole_code.md', 'append_code.cjs', 'dump_whole_code.cjs'];

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            if (!EXCLUDE_DIRS.includes(file)) {
                walkDir(fullPath);
            }
        } else {
            const ext = path.extname(fullPath);
            if (INCLUDE_EXTS.includes(ext) && !EXCLUDE_FILES.includes(file)) {
                const relativePath = path.relative(__dirname, fullPath);
                try {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    const codeLang = ext.slice(1);
                    output += `### ${relativePath.replace(/\\/g, '/')}\n\`\`\`${codeLang}\n${content}\n\`\`\`\n\n`;
                } catch (e) {
                    console.error(`Skipping ${relativePath} due to read error.`);
                }
            }
        }
    }
}

walkDir(rootDir);
fs.writeFileSync(outputFile, output, 'utf8');
console.log('Successfully wrote entire codebase to wholecode.md');
