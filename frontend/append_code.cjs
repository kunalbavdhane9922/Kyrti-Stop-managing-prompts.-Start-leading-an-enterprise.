const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const outputFile = path.join(__dirname, 'whole_code.md');

let output = '\n\n--- APPENDED LATEST CODE ---\n\n';

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else {
            if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx') || fullPath.endsWith('.css')) {
                const relativePath = path.relative(__dirname, fullPath);
                const content = fs.readFileSync(fullPath, 'utf8');
                const ext = path.extname(fullPath).slice(1);
                const codeLang = ext === 'jsx' ? 'jsx' : ext === 'css' ? 'css' : 'javascript';
                output += `### ${relativePath.replace(/\\/g, '/')}\n\`\`\`${codeLang}\n${content}\n\`\`\`\n\n`;
            }
        }
    }
}

walkDir(srcDir);
fs.appendFileSync(outputFile, output);
console.log('Successfully appended latest code to whole_code.md');
