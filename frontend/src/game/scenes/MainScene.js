/**
 * Sovereign Virtual Office — MainScene (Premium Visual Pipeline)
 * 
 * 60fps Phaser engine with:
 * - Dynamic Light2D (graceful fallback if unavailable)
 * - VisualFXManager for particles, status rings, procedural avatars
 * - Sine.easeInOut tweened tile movement (150ms)
 * - Cinematic camera with 0.08 lerp
 * - Privacy Zone dimming + camera zoom effect
 * - Delta-time bound movement loop
 */
import Phaser from 'phaser';
import { EventBus } from '../EventBus.js';
import { VisualFXManager } from '../VisualFXManager.js';

const T = 32;
const MOVE_DURATION = 150;
const PROXIMITY_INTERVAL = 200;

export class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
    this.localPlayer = null;
    this.remotePlayers = new Map();
    this.nametags = new Map();
    this.stateLabels = new Map();
    this.mapData = null;
    this.tileX = 25;
    this.tileY = 20;
    this.direction = 'down';
    this.isMoving = false;
    this.lastProximityCheck = 0;
    this.currentZoneId = null;
    this.vfx = null;
    this.lightsEnabled = false;
    this.privacyActive = false;
  }

  create() {
    this.mapData = this.registry.get('mapData');
    if (!this.mapData) {
      console.error('[MainScene] No map data found');
      return;
    }

    const { ground, collision, fringe, zones, width, height } = this.mapData;

    // Initialize VFX Manager
    this.vfx = new VisualFXManager(this);

    // === LIGHTING — graceful fallback ===
    try {
      this.lights.enable();
      this.lights.setAmbientColor(0xe2e8f0);
      this.lightsEnabled = true;
    } catch (e) {
      console.warn('[MainScene] Light2D unavailable, flat rendering mode');
      this.lightsEnabled = false;
    }

    this.cameras.main.setBackgroundColor('#faf9f6');

    // === LAYER 1: Ground ===
    const groundKeys = { 0: 'tile-floor', 1: 'tile-wall', 2: 'tile-carpet', 3: 'tile-glass' };
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const key = groundKeys[ground[y][x]] || 'tile-floor';
        const img = this.add.image(x * T + T / 2, y * T + T / 2, key).setDepth(0);
        if (this.lightsEnabled) try { img.setPipeline('Light2D'); } catch (e) { }
      }
    }

    // === LAYER 2: Collision (furniture) ===
    const furnKeys = { 10: 'tile-desk', 11: 'tile-monitor', 12: 'tile-table', 13: 'tile-plant', 14: 'tile-whiteboard' };
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const fId = collision[y][x];
        if (fId >= 10 && furnKeys[fId]) {
          const img = this.add.image(x * T + T / 2, y * T + T / 2, furnKeys[fId]).setDepth(2);
          if (this.lightsEnabled) try { img.setPipeline('Light2D'); } catch (e) { }
          // Smart Object Lights — monitors emit cyan glow
          if (fId === 11 && this.lightsEnabled) {
            try { this.vfx.createSmartObjectLight(x * T + T / 2, y * T + T / 2, 0x06b6d4, 0.2); } catch (e) { }
          }
        }
      }
    }

    // === LAYER 3: Fringe (overhead) ===
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (fringe[y][x] === 1) {
          this.add.image(x * T + T / 2, y * T + T / 2, 'tile-light').setDepth(20).setAlpha(0.5);
          if (this.lightsEnabled) {
            try { this.vfx.createSmartObjectLight(x * T + T / 2, y * T + T / 2, 0xfbbf24, 0.15); } catch (e) { }
          }
        }
      }
    }

    // === LAYER 4: Zone labels ===
    zones.forEach(zone => {
      this.add.text(
        (zone.x + zone.w / 2) * T, zone.y * T - 6,
        zone.name.toUpperCase(),
        {
          fontFamily: 'monospace', fontSize: '8px',
          color: zone.private ? '#92400e' : '#6b7280',
        }
      ).setOrigin(0.5).setDepth(5).setAlpha(0.6);

      if (zone.private) {
        this.add.rectangle(
          (zone.x + zone.w / 2) * T, (zone.y + zone.h / 2) * T,
          zone.w * T, zone.h * T
        ).setStrokeStyle(1, 0xc5a059, 0.2).setDepth(1).setFillStyle(0xc5a059, 0.015);
      }
    });

    // === CEO AVATAR ===
    this.localPlayer = this.add.image(
      this.tileX * T + T / 2, this.tileY * T + T / 2, 'avatar-ceo'
    ).setDepth(10);
    if (this.lightsEnabled) try { this.localPlayer.setPipeline('Light2D'); } catch (e) { }

    // CEO point light
    if (this.lightsEnabled) try { this.vfx.createCEOLight(this.localPlayer); } catch (e) { }

    // CEO status ring
    this.vfx.createStatusRing('ceo', this.localPlayer, 'ceo');

    // CEO nametag
    this.ceoTag = this.add.text(this.localPlayer.x, this.localPlayer.y - 24, 'CEO', {
      fontFamily: 'monospace', fontSize: '8px', color: '#111827', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(11);

    // === CINEMATIC CAMERA — 0.08 lerp ===
    this.cameras.main.startFollow(this.localPlayer, true, 0.08, 0.08);
    this.cameras.main.setZoom(1.8);
    this.cameras.main.setBounds(0, 0, width * T, height * T);

    // === INPUT ===
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    // === EVENT LISTENERS ===
    EventBus.on('remote-player-joined', d => this.addRemotePlayer(d));
    EventBus.on('remote-player-left', d => this.removeRemotePlayer(d.userId));
    EventBus.on('remote-player-moved', d => this.updateRemotePlayer(d));
    EventBus.on('room-state', d => this.handleRoomState(d));
    EventBus.on('ai-state-change', d => this.updateAgentState(d));

    EventBus.emit('scene-ready', this);
    console.log('[MainScene] Scene ready — 4-layer office rendered');
  }

  // ═══════════════════════════════════════════════════════════
  //  UPDATE LOOP
  // ═══════════════════════════════════════════════════════════
  update(time, delta) {
    if (!this.localPlayer || !this.mapData) return;

    if (!this.isMoving) {
      let dx = 0, dy = 0;
      if (this.cursors.up.isDown || this.wasd.up.isDown) { dy = -1; this.direction = 'up'; }
      else if (this.cursors.down.isDown || this.wasd.down.isDown) { dy = 1; this.direction = 'down'; }
      else if (this.cursors.left.isDown || this.wasd.left.isDown) { dx = -1; this.direction = 'left'; }
      else if (this.cursors.right.isDown || this.wasd.right.isDown) { dx = 1; this.direction = 'right'; }

      if (dx !== 0 || dy !== 0) {
        const nx = this.tileX + dx, ny = this.tileY + dy;
        if (this.canMoveTo(nx, ny)) this.moveToTile(nx, ny);
      }
    }

    // Update positions
    if (this.ceoTag) this.ceoTag.setPosition(this.localPlayer.x, this.localPlayer.y - 24);
    if (this.lightsEnabled) this.vfx.updateCEOLight(this.localPlayer);
    this.nametags.forEach((tag, uid) => { const s = this.remotePlayers.get(uid); if (s) tag.setPosition(s.x, s.y - 24); });
    this.stateLabels.forEach((lbl, uid) => { const s = this.remotePlayers.get(uid); if (s) lbl.setPosition(s.x, s.y + 20); });

    // VFX
    this.vfx.updateStatusRings(time);
    this.vfx.updateParticles();

    // Throttled checks
    if (time - this.lastProximityCheck > PROXIMITY_INTERVAL) {
      this.lastProximityCheck = time;
      this.checkProximity();
      this.checkZone();
    }

    // FPS broadcast (once per second)
    if (Math.floor(time / 1000) !== Math.floor((time - delta) / 1000)) {
      EventBus.emit('fps-update', Math.round(this.game.loop.actualFps));
    }
  }

  canMoveTo(x, y) {
    const { collision, ground, width, height } = this.mapData;
    if (x < 0 || y < 0 || x >= width || y >= height) return false;
    if (ground[y][x] === 1 || ground[y][x] === 3) return false;
    return collision[y][x] < 10 && collision[y][x] !== 1;
  }

  /** Sine.easeInOut tweened 150ms movement */
  moveToTile(nx, ny) {
    this.isMoving = true;
    this.tileX = nx;
    this.tileY = ny;

    this.tweens.add({
      targets: this.localPlayer,
      x: nx * T + T / 2,
      y: ny * T + T / 2,
      duration: MOVE_DURATION,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        this.isMoving = false;
        EventBus.emitThrottled('player-moved', {
          tileX: this.tileX, tileY: this.tileY, direction: this.direction,
        });
      },
    });
  }

  // ═══════════════════════════════════════════════════════════
  //  PRIVACY ZONES
  // ═══════════════════════════════════════════════════════════
  checkZone() {
    const { zones } = this.mapData;
    let inside = null;
    for (const z of zones) {
      if (z.private && this.tileX >= z.x && this.tileX < z.x + z.w &&
        this.tileY >= z.y && this.tileY < z.y + z.h) {
        inside = z; break;
      }
    }
    const newId = inside?.id || null;
    if (newId !== this.currentZoneId) {
      this.currentZoneId = newId;
      if (newId) {
        this.activatePrivacy(inside);
        EventBus.emit('enter-privacy-zone', { zoneId: newId, zoneName: inside.name });
      } else {
        this.deactivatePrivacy();
        EventBus.emit('exit-privacy-zone', {});
      }
    }
  }

  activatePrivacy(zone) {
    this.privacyActive = true;
    this.remotePlayers.forEach((spr, uid) => {
      const rx = spr.getData('tileX') || 0, ry = spr.getData('tileY') || 0;
      const isIn = rx >= zone.x && rx < zone.x + zone.w && ry >= zone.y && ry < zone.y + zone.h;
      this.tweens.add({ targets: spr, alpha: isIn ? 1 : 0.35, duration: 400, ease: 'Sine.easeOut' });
      const tag = this.nametags.get(uid);
      if (tag) this.tweens.add({ targets: tag, alpha: isIn ? 0.8 : 0.15, duration: 400 });
    });
    this.tweens.add({ targets: this.cameras.main, zoom: 2.2, duration: 600, ease: 'Sine.easeInOut' });
  }

  deactivatePrivacy() {
    this.privacyActive = false;
    this.remotePlayers.forEach((spr, uid) => {
      this.tweens.add({ targets: spr, alpha: 1, duration: 400, ease: 'Sine.easeOut' });
      const tag = this.nametags.get(uid);
      if (tag) this.tweens.add({ targets: tag, alpha: 0.8, duration: 400 });
    });
    this.tweens.add({ targets: this.cameras.main, zoom: 1.8, duration: 600, ease: 'Sine.easeInOut' });
  }

  checkProximity() {
    this.remotePlayers.forEach((spr, userId) => {
      const rx = spr.getData('tileX') || 0, ry = spr.getData('tileY') || 0;
      const dist = Math.sqrt((this.tileX - rx) ** 2 + (this.tileY - ry) ** 2);
      EventBus.emit('proximity-update', { userId, distance: dist });
    });
  }

  handleRoomState(data) {
    if (data.positions) data.positions.forEach(p => { if (p.userId) this.addRemotePlayer(p); });
    if (data.members) data.members.forEach(m => { if (m.userId) this.addRemotePlayer(m); });
  }

  // ═══════════════════════════════════════════════════════════
  //  REMOTE PLAYERS
  // ═══════════════════════════════════════════════════════════
  addRemotePlayer(data) {
    const { userId, displayName, avatarKey, tileX, tileY, agentState } = data;
    if (this.remotePlayers.has(userId)) return;

    const x = (tileX || 25) * T + T / 2, y = (tileY || 20) * T + T / 2;
    const state = agentState || 'idle';
    const tex = this.getAgentTexture(state) || avatarKey || 'avatar-01';

    const spr = this.add.image(x, y, tex).setDepth(9).setAlpha(0);
    spr.setData('tileX', tileX || 25);
    spr.setData('tileY', tileY || 20);
    spr.setData('agentState', state);
    if (this.lightsEnabled) try { spr.setPipeline('Light2D'); } catch (e) { }
    this.tweens.add({ targets: spr, alpha: 1, duration: 300, ease: 'Sine.easeOut' });
    this.remotePlayers.set(userId, spr);

    const tag = this.add.text(x, y - 24, displayName || 'Agent', {
      fontFamily: 'monospace', fontSize: '7px', color: '#374151',
    }).setOrigin(0.5).setDepth(11).setAlpha(0);
    this.tweens.add({ targets: tag, alpha: 0.8, duration: 300 });
    this.nametags.set(userId, tag);

    const stLbl = this.add.text(x, y + 20, state.toUpperCase(), {
      fontFamily: 'monospace', fontSize: '6px', color: this.getStateColor(state),
    }).setOrigin(0.5).setDepth(11).setAlpha(0.5);
    this.stateLabels.set(userId, stLbl);

    this.vfx.setAgentVisualState(userId, state, spr);
  }

  updateRemotePlayer(data) {
    const { userId, tileX, tileY, agentState } = data;
    const spr = this.remotePlayers.get(userId);
    if (!spr) { this.addRemotePlayer(data); return; }

    spr.setData('tileX', tileX); spr.setData('tileY', tileY);
    this.tweens.add({ targets: spr, x: tileX * T + T / 2, y: tileY * T + T / 2, duration: MOVE_DURATION + 30, ease: 'Sine.easeInOut' });

    if (agentState && agentState !== spr.getData('agentState')) {
      spr.setData('agentState', agentState);
      const newTex = this.getAgentTexture(agentState);
      if (newTex) spr.setTexture(newTex);
      const stLbl = this.stateLabels.get(userId);
      if (stLbl) { stLbl.setText(agentState.toUpperCase()); stLbl.setColor(this.getStateColor(agentState)); }
      this.vfx.setAgentVisualState(userId, agentState, spr);
    }
  }

  updateAgentState(data) {
    this.updateRemotePlayer({ userId: data.userId, agentState: data.state });
  }

  removeRemotePlayer(userId) {
    const spr = this.remotePlayers.get(userId);
    if (spr) { this.tweens.add({ targets: spr, alpha: 0, duration: 200, onComplete: () => spr.destroy() }); this.remotePlayers.delete(userId); }
    const tag = this.nametags.get(userId); if (tag) { tag.destroy(); this.nametags.delete(userId); }
    const st = this.stateLabels.get(userId); if (st) { st.destroy(); this.stateLabels.delete(userId); }
    this.vfx.removeAll(userId);
  }

  getAgentTexture(s) { return { planning: 'agent-planning', executing: 'agent-executing', blocked: 'agent-blocked', idle: 'agent-idle' }[s] || 'agent-idle'; }
  getStateColor(s) { return { planning: '#FF5C00', executing: '#22c55e', blocked: '#E8943A', idle: '#9ca3af' }[s] || '#9ca3af'; }
}
