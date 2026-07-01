import Phaser from 'phaser';
import { createWorld, addEntity, addComponent } from 'bitecs';
import { Position } from '../components/Position';
import { AIController } from '../components/AIController';
import { createMovementSystem } from '../systems/MovementSystem';
import { createAIPathfindingSystem } from '../systems/AIPathfindingSystem';

export default class MainOffice extends Phaser.Scene {
  private ecsWorld: any;
  private movementSystem: any;
  private aiSystem: any;
  public entityMap: Map<number, Phaser.GameObjects.Sprite>;

  constructor() {
    super('MainOffice');
    this.entityMap = new Map();
  }

  preload() {
    this.load.image('office-tiles', 'assets/tileset1.png');
    this.load.tilemapTiledJSON('office-map', 'assets/office-map.json');
    this.load.spritesheet('player', 'assets/player_spritesheet.png', { frameWidth: 32, frameHeight: 32 });
  }

  create() {
    // 1. Initialize ECS World
    this.ecsWorld = createWorld();
    
    // 2. Render Tilemap (Culled for performance)
    const map = this.make.tilemap({ key: 'office-map' });
    const tileset = map.addTilesetImage('office', 'office-tiles');
    if (tileset) {
      const floor = map.createLayer('floor', tileset, 0, 0);
      if (floor) floor.setDepth(0);
      
      const walls = map.createLayer('walls', tileset, 0, 0);
      if (walls) walls.setDepth(20);
    }

    // 3. Initialize ECS Systems
    this.movementSystem = createMovementSystem(this);
    this.aiSystem = createAIPathfindingSystem(this);

    // 4. Listen to React Zustand Bridge for network entities
    window.addEventListener('SPATIAL_SYNC', (e: any) => this.syncEntities(e.detail));
  }

  update(time: number, delta: number) {
    if (!this.ecsWorld) return;
    
    // Run ECS Systems
    this.aiSystem(this.ecsWorld);
    this.movementSystem(this.ecsWorld);
  }

  private syncEntities(serverState: Record<string, any>) {
    // Logic to reconcile server state with local ECS entities
    // ...
  }
}
