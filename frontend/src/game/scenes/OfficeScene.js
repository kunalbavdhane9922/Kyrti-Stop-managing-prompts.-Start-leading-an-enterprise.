/**
 * Sovereign Virtual Office — Office Scene
 * 
 * Main game scene: renders the 2D office map, handles player movement,
 * manages remote players, and runs the proximity system.
 */
import Phaser from 'phaser';
import { EventBus } from '../EventBus.js';

const TILE = 32;
const MOVE_DURATION = 180; // ms per tile movement
const POSITION_SEND_RATE = 50; // ms between position sends (20Hz)

export class OfficeScene extends Phaser.Scene {
  constructor() {
    super({ key: 'OfficeScene' });
    this.localPlayer = null;
    this.remotePlayers = new Map(); // userId -> sprite
    this.nametags = new Map();
    this.isMoving = false;
    this.mapData = null;
    this.lastPositionSend = 0;
    this.cursors = null;
    this.wasd = null;
    this.tileX = 25; // Spawn
    this.tileY = 20;
    this.direction = 'down';
  }

  create() {
    this.mapData = this.registry.get('mapData');
    if (!this.mapData) return;

    const { ground, furniture, collisions, width, height } = this.mapData;

    // --- Render ground layer ---
    const texKeys = ['tile-floor', 'tile-wall'];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const tileId = ground[y][x];
        const key = tileId === 1 ? 'tile-wall' : 'tile-floor';
        this.add.image(x * TILE + TILE / 2, y * TILE + TILE / 2, key);
      }
    }

    // --- Render furniture layer ---
    const furnitureKeys = { 2: 'tile-desk', 3: 'tile-table', 4: 'tile-plant', 5: 'tile-whiteboard', 6: 'tile-computer' };
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const fId = furniture[y][x];
        if (fId >= 0 && furnitureKeys[fId]) {
          this.add.image(x * TILE + TILE / 2, y * TILE + TILE / 2, furnitureKeys[fId]).setDepth(1);
        }
      }
    }

    // --- Render zone labels ---
    this.mapData.zones.forEach(zone => {
      const label = this.add.text(
        (zone.x + zone.w / 2) * TILE,
        zone.y * TILE - 8,
        zone.name,
        { fontFamily: 'Inter, monospace', fontSize: '10px', color: '#64748b', alpha: 0.6 }
      ).setOrigin(0.5).setDepth(5);
    });

    // --- Create local player ---
    this.localPlayer = this.add.image(
      this.tileX * TILE + TILE / 2,
      this.tileY * TILE + TILE / 2,
      'avatar-01'
    ).setDepth(10);

    // Local player nametag
    this.localNametag = this.add.text(
      this.localPlayer.x,
      this.localPlayer.y - 22,
      'You',
      { fontFamily: 'Inter, sans-serif', fontSize: '9px', color: '#38bdf8', fontStyle: 'bold' }
    ).setOrigin(0.5).setDepth(11);

    // --- Camera ---
    this.cameras.main.startFollow(this.localPlayer, true, 0.08, 0.08);
    this.cameras.main.setZoom(1.5);
    this.cameras.main.setBounds(0, 0, width * TILE, height * TILE);

    // --- Input ---
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    // --- Listen for remote player events from React/Socket ---
    EventBus.on('remote-player-joined', (data) => this.addRemotePlayer(data));
    EventBus.on('remote-player-left', (data) => this.removeRemotePlayer(data.userId));
    EventBus.on('remote-player-moved', (data) => this.updateRemotePlayer(data));
    EventBus.on('room-state', (data) => this.handleRoomState(data));
    EventBus.on('set-avatar', (data) => {
      if (this.localPlayer) this.localPlayer.setTexture(data.avatarKey);
    });

    // Notify React that scene is ready
    EventBus.emit('scene-ready', this);
  }

  update(time) {
    if (!this.localPlayer || !this.mapData) return;

    // Handle movement input
    if (!this.isMoving) {
      let dx = 0, dy = 0, dir = this.direction;

      if (this.cursors.up.isDown || this.wasd.up.isDown) { dy = -1; dir = 'up'; }
      else if (this.cursors.down.isDown || this.wasd.down.isDown) { dy = 1; dir = 'down'; }
      else if (this.cursors.left.isDown || this.wasd.left.isDown) { dx = -1; dir = 'left'; }
      else if (this.cursors.right.isDown || this.wasd.right.isDown) { dx = 1; dir = 'right'; }

      if (dx !== 0 || dy !== 0) {
        const newX = this.tileX + dx;
        const newY = this.tileY + dy;
        this.direction = dir;

        // Check collision
        if (this.canMoveTo(newX, newY)) {
          this.moveToTile(newX, newY);
        }
      }
    }

    // Update nametag positions
    if (this.localNametag) {
      this.localNametag.setPosition(this.localPlayer.x, this.localPlayer.y - 22);
    }
    this.nametags.forEach((tag, userId) => {
      const sprite = this.remotePlayers.get(userId);
      if (sprite) tag.setPosition(sprite.x, sprite.y - 22);
    });
  }

  /**
   * Check if a tile is walkable.
   */
  canMoveTo(x, y) {
    const { collisions, width, height } = this.mapData;
    if (x < 0 || y < 0 || x >= width || y >= height) return false;
    return collisions[y][x] === 0;
  }

  /**
   * Smoothly move local player to a tile.
   */
  moveToTile(newX, newY) {
    this.isMoving = true;
    this.tileX = newX;
    this.tileY = newY;

    this.tweens.add({
      targets: this.localPlayer,
      x: newX * TILE + TILE / 2,
      y: newY * TILE + TILE / 2,
      duration: MOVE_DURATION,
      ease: 'Linear',
      onComplete: () => {
        this.isMoving = false;
        this.sendPosition();
      },
    });
  }

  /**
   * Send position to server via EventBus (throttled).
   */
  sendPosition() {
    const now = Date.now();
    if (now - this.lastPositionSend < POSITION_SEND_RATE) return;
    this.lastPositionSend = now;

    EventBus.emit('player-moved', {
      tileX: this.tileX,
      tileY: this.tileY,
      direction: this.direction,
      animation: this.isMoving ? 'walk' : 'idle',
    });
  }

  /**
   * Handle initial room state (all existing players).
   */
  handleRoomState(data) {
    const { positions } = data;
    if (!positions) return;
    positions.forEach(p => {
      if (p.userId) this.addRemotePlayer(p);
    });
  }

  /**
   * Add a remote player sprite.
   */
  addRemotePlayer(data) {
    const { userId, displayName, avatarKey, tileX, tileY } = data;
    if (this.remotePlayers.has(userId)) return;

    const x = (tileX || 25) * TILE + TILE / 2;
    const y = (tileY || 20) * TILE + TILE / 2;

    const sprite = this.add.image(x, y, avatarKey || 'avatar-02').setDepth(9).setAlpha(0);

    // Fade in
    this.tweens.add({ targets: sprite, alpha: 1, duration: 400 });

    this.remotePlayers.set(userId, sprite);

    // Nametag
    const tag = this.add.text(x, y - 22, displayName || 'User', {
      fontFamily: 'Inter, sans-serif',
      fontSize: '9px',
      color: '#94a3b8',
    }).setOrigin(0.5).setDepth(11).setAlpha(0);
    this.tweens.add({ targets: tag, alpha: 1, duration: 400 });
    this.nametags.set(userId, tag);
  }

  /**
   * Update a remote player's position (with interpolation).
   */
  updateRemotePlayer(data) {
    const { userId, tileX, tileY } = data;
    const sprite = this.remotePlayers.get(userId);
    if (!sprite) {
      this.addRemotePlayer(data);
      return;
    }

    // Smooth interpolation to new position
    this.tweens.add({
      targets: sprite,
      x: tileX * TILE + TILE / 2,
      y: tileY * TILE + TILE / 2,
      duration: MOVE_DURATION + 20,
      ease: 'Linear',
    });

    // Emit proximity data for React
    const dist = Math.sqrt(
      (this.tileX - tileX) ** 2 + (this.tileY - tileY) ** 2
    );
    EventBus.emit('proximity-update', { userId, distance: dist, tileX, tileY });
  }

  /**
   * Remove a remote player sprite.
   */
  removeRemotePlayer(userId) {
    const sprite = this.remotePlayers.get(userId);
    if (sprite) {
      this.tweens.add({
        targets: sprite, alpha: 0, duration: 300,
        onComplete: () => sprite.destroy(),
      });
      this.remotePlayers.delete(userId);
    }
    const tag = this.nametags.get(userId);
    if (tag) {
      tag.destroy();
      this.nametags.delete(userId);
    }
  }
}
