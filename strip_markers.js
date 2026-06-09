const fs = require('fs');

const filePaths = [
  'd:\\College\\Projects\\Kyrti-Stop-managing-prompts.-Start-leading-an-enterprise\\frontend\\src\\components\\layout\\PublicNavbar.jsx'
];

function revertColors(content) {
  return content
    // Revert primary colors
    .replace(/#E4E2DD/gi, '__TEMP_BLACK__')
    .replace(/#000000/gi, '__TEMP_CREAM__')
    .replace(/__TEMP_BLACK__/g, '#000000')
    .replace(/__TEMP_CREAM__/g, '#E4E2DD')

    // Revert secondary color
    .replace(/#D5D3CE/gi, '#0A0A0A')

    // Revert RGBA swaps
    .replace(/rgba\(255,255,255/g, '__TEMP_RGB_BLACK__')
    .replace(/rgba\(255, 255, 255/g, '__TEMP_RGB_BLACK_SPACE__')
    .replace(/rgba\(0,0,0/g, 'rgba(255,255,255')
    .replace(/rgba\(0, 0, 0/g, 'rgba(255, 255, 255')
    .replace(/__TEMP_RGB_BLACK__/g, 'rgba(0,0,0')
    .replace(/__TEMP_RGB_BLACK_SPACE__/g, 'rgba(0, 0, 0')

    // Revert cream alpha replacements
    .replace(/rgba\(0,0,0/g, '__TEMP_CREAM_RGBA__')
    .replace(/rgba\(0, 0, 0/g, '__TEMP_CREAM_RGBA_SPACE__')
    .replace(/__TEMP_CREAM_RGBA__/g, 'rgba(228,226,221')
    .replace(/__TEMP_CREAM_RGBA_SPACE__/g, 'rgba(228, 226, 221');
}

for (const path of filePaths) {
  if (fs.existsSync(path)) {
    let content = fs.readFileSync(path, 'utf8');
    const reverted = revertColors(content);
    fs.writeFileSync(path, reverted);
    console.log(`Reverted theme for ${path}`);
  } else {
    console.log(`File not found: ${path}`);
  }
}