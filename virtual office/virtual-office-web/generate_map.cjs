const fs = require('fs');

// We will build a map 40 tiles wide by 30 tiles high (32x32 pixels per tile -> 1280x960 map)
const width = 40;
const height = 30;

const floorTile = 1;
const wallTile = 2;
const deskTile = 3;
const plantTile = 4;

let mapData = [];

// Helper to get 1D index from 2D x,y
function idx(x, y) { return y * width + x; }

// Initialize with floor
for (let i = 0; i < width * height; i++) {
    mapData.push(floorTile);
}

// Build exterior walls
for (let x = 0; x < width; x++) {
    mapData[idx(x, 0)] = wallTile;
    mapData[idx(x, height - 1)] = wallTile;
}
for (let y = 0; y < height; y++) {
    mapData[idx(0, y)] = wallTile;
    mapData[idx(width - 1, y)] = wallTile;
}

// Helper to build a cabin
function buildCabin(startX, startY, w, h, doorX) {
    for (let x = startX; x < startX + w; x++) {
        mapData[idx(x, startY)] = wallTile;
        mapData[idx(x, startY + h - 1)] = wallTile;
    }
    for (let y = startY; y < startY + h; y++) {
        mapData[idx(startX, y)] = wallTile;
        mapData[idx(startX + w - 1, y)] = wallTile;
    }
    // Make a door
    mapData[idx(doorX, startY + h - 1)] = floorTile;
    
    // Add a desk
    mapData[idx(startX + 2, startY + 2)] = deskTile;
    mapData[idx(startX + 3, startY + 2)] = deskTile;
    // Add a plant
    mapData[idx(startX + w - 2, startY + 1)] = plantTile;
}

// CEO Cabin (Top Left, large)
buildCabin(1, 1, 12, 10, 6);

// HR Cabin (Top Right)
buildCabin(25, 1, 10, 8, 28);

// Sales Cabin (Bottom Right)
buildCabin(25, 20, 10, 9, 28);

// Marketing Cabin (Bottom Left)
buildCabin(1, 20, 10, 9, 6);

// Main Lobby Desks
mapData[idx(15, 12)] = deskTile;
mapData[idx(16, 12)] = deskTile;
mapData[idx(18, 12)] = deskTile;
mapData[idx(19, 12)] = deskTile;

mapData[idx(15, 16)] = deskTile;
mapData[idx(16, 16)] = deskTile;
mapData[idx(18, 16)] = deskTile;
mapData[idx(19, 16)] = deskTile;

// Lobby plants
mapData[idx(12, 14)] = plantTile;
mapData[idx(22, 14)] = plantTile;

const tilemapJSON = {
    width: width,
    height: height,
    tilewidth: 32,
    tileheight: 32,
    orientation: "orthogonal",
    layers: [
        {
            data: mapData,
            name: "World",
            type: "tilelayer",
            width: width,
            height: height,
            x: 0,
            y: 0,
            opacity: 1,
            visible: true
        }
    ],
    tilesets: [
        {
            firstgid: 1,
            image: "office_tileset.png",
            name: "office_tileset",
            tilewidth: 32,
            tileheight: 32,
            imagewidth: 512, // assuming 512x512 image
            imageheight: 512
        }
    ]
};

fs.writeFileSync('public/assets/office-map.json', JSON.stringify(tilemapJSON));
console.log("Map generated successfully.");
