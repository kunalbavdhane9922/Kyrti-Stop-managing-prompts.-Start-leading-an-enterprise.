/**
 * Sovereign Virtual Office — Phaser Game Configuration
 * 
 * WebGL-first renderer. Light2D enabled per-scene via this.lights.enable().
 * Orthographic 32×32 grid, arcade physics, 60fps target.
 */
import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene.js';
import { MainScene } from './scenes/MainScene.js';

export function createGameConfig(parent) {
  return {
    type: Phaser.WEBGL,
    parent,
    width: 800,
    height: 600,
    pixelArt: true,
    roundPixels: true,
    backgroundColor: '#faf9f6',
    physics: {
      default: 'arcade',
      arcade: { gravity: { y: 0 }, debug: false },
    },
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [BootScene, MainScene],
    fps: { target: 60, forceSetTimeOut: false },
  };
}
