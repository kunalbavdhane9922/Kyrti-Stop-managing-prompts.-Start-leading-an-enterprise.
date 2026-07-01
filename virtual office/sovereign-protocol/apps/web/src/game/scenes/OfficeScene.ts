import Phaser from 'phaser';

export default class OfficeScene extends Phaser.Scene {
  constructor() {
    super({ key: 'OfficeScene' });
  }

  preload() {
    // Load environment assets
    this.load.image('tiles', 'assets/premium_office_tiles.png');
    this.load.tilemapTiledJSON('map', 'assets/level_1_office.json');
  }

  create() {
    console.log('OfficeScene: Initializing physics world...');
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('PremiumOffice', 'tiles');
    
    if (tileset) {
      map.createLayer('Floor', tileset, 0, 0)?.setDepth(0);
      map.createLayer('Walls', tileset, 0, 0)?.setDepth(10);
    }
    
    // Launch parallel scenes
    this.scene.launch('UIScene');
    this.scene.launch('InteractionScene');
  }

  update(time: number, delta: number) {
    // ECS Systems will run here
  }
}
