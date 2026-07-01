import Phaser from 'phaser';

export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene', active: false });
  }

  create() {
    console.log('UIScene: Initializing WebGL UI overlays...');
    
    // Listen for custom events to display hovering names or interaction hints
    window.addEventListener('SHOW_INTERACT_HINT', (e: any) => {
      this.add.text(400, 300, 'Press E to Interact', {
        fontSize: '16px',
        color: '#10B981', // Sovereign Emerald
        fontFamily: 'Inter, sans-serif'
      }).setOrigin(0.5).setAlpha(0.8);
    });
  }
}
