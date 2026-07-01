import Phaser from 'phaser';

export default class InteractionScene extends Phaser.Scene {
  constructor() {
    super({ key: 'InteractionScene', active: false });
  }

  create() {
    console.log('InteractionScene: Initializing raycasting...');
    
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      // Raycast logic to detect clicks on AI Agents or Desks
      console.log(`Pointer clicked at: ${pointer.x}, ${pointer.y}`);
    });
  }
}
