/**
 * Sovereign Virtual Office — Boot Scene
 * 
 * Generates premium tileset + avatar textures using CanvasTexture API.
 * Cross-browser safe — no ctx.roundRect() dependency.
 */
import Phaser from 'phaser';
import { VisualFXManager } from '../VisualFXManager.js';

const T = 32;

/** Cross-browser rounded rectangle helper */
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }); }

  preload() {
    const { width, height } = this.cameras.main;
    this.loadTitle = this.add.text(width / 2, height / 2 - 10, 'SOVEREIGN PROTOCOL', {
      fontFamily: 'Georgia, serif', fontSize: '18px', color: '#111827',
    }).setOrigin(0.5);
    this.loadSub = this.add.text(width / 2, height / 2 + 16, 'Initializing Spatial Workspace...', {
      fontFamily: 'monospace', fontSize: '10px', color: '#6b7280',
    }).setOrigin(0.5);
  }

  create() {
    if (this.loadTitle) this.loadTitle.destroy();
    if (this.loadSub) this.loadSub.destroy();

    this.generateTileTextures();

    // Generate premium avatar textures via VFX Manager
    try {
      const vfx = new VisualFXManager(this);
      vfx.generateAvatarTextures();
    } catch (e) {
      console.warn('[BootScene] Avatar generation fallback:', e.message);
      this.generateFallbackAvatars();
    }

    this.generateOfficeMap();
    this.scene.start('MainScene');
  }

  /** Create a CanvasTexture safely */
  tex(key, drawFn) {
    try {
      const canvas = this.textures.createCanvas(key, T, T);
      const ctx = canvas.getContext();
      drawFn(ctx);
      canvas.refresh();
    } catch (e) {
      // Fallback: create a simple colored texture via graphics
      console.warn(`[BootScene] Texture "${key}" fallback:`, e.message);
      const g = this.make.graphics({ add: false });
      g.fillStyle(0xcccccc); g.fillRect(0, 0, T, T);
      g.generateTexture(key, T, T);
      g.destroy();
    }
  }

  generateTileTextures() {
    // Marble floor
    this.tex('tile-floor', ctx => {
      ctx.fillStyle = '#faf9f6'; ctx.fillRect(0, 0, T, T);
      ctx.strokeStyle = 'rgba(210,205,196,0.3)'; ctx.lineWidth = 0.5; ctx.strokeRect(0, 0, T, T);
      ctx.fillStyle = 'rgba(200,195,185,0.08)';
      ctx.fillRect(7, 11, 1, 1); ctx.fillRect(21, 6, 1, 1); ctx.fillRect(13, 23, 1, 1);
    });

    // Carpet
    this.tex('tile-carpet', ctx => {
      ctx.fillStyle = '#f0ebe3'; ctx.fillRect(0, 0, T, T);
      ctx.strokeStyle = 'rgba(200,190,175,0.2)'; ctx.lineWidth = 0.5; ctx.strokeRect(0, 0, T, T);
    });

    // Wall
    this.tex('tile-wall', ctx => {
      ctx.fillStyle = '#374151'; ctx.fillRect(0, 0, T, T);
      ctx.strokeStyle = 'rgba(75,85,99,0.5)'; ctx.lineWidth = 1; ctx.strokeRect(1, 1, T - 2, T - 2);
    });

    // Glass wall
    this.tex('tile-glass', ctx => {
      ctx.fillStyle = 'rgba(180,195,210,0.5)'; ctx.fillRect(0, 0, T, T);
      ctx.strokeStyle = 'rgba(148,163,184,0.6)'; ctx.lineWidth = 1.5; ctx.strokeRect(0, 0, T, T);
      ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(2, 2, 8, T - 4);
    });

    // Walnut desk
    this.tex('tile-desk', ctx => {
      const g = ctx.createLinearGradient(2, 6, T - 2, T - 4);
      g.addColorStop(0, '#8b6f47'); g.addColorStop(1, '#6d563a');
      ctx.fillStyle = g;
      roundRect(ctx, 2, 6, T - 4, T - 10, 3); ctx.fill();
    });

    // Monitor
    this.tex('tile-monitor', ctx => {
      ctx.fillStyle = '#1f2937';
      roundRect(ctx, 7, 3, T - 14, T - 12, 2); ctx.fill();
      ctx.fillStyle = 'rgba(59,130,246,0.12)'; ctx.fillRect(9, 5, T - 18, T - 16);
      ctx.fillStyle = '#4b5563'; ctx.fillRect(T / 2 - 1, T - 8, 2, 5);
      ctx.fillStyle = '#6b7280'; ctx.fillRect(T / 2 - 4, T - 4, 8, 2);
    });

    // Executive table
    this.tex('tile-table', ctx => {
      const g = ctx.createLinearGradient(1, 1, T - 2, T - 2);
      g.addColorStop(0, '#44403c'); g.addColorStop(1, '#292524');
      ctx.fillStyle = g;
      roundRect(ctx, 1, 1, T - 2, T - 2, 4); ctx.fill();
    });

    // Plant
    this.tex('tile-plant', ctx => {
      ctx.fillStyle = 'rgba(22,101,52,0.7)'; ctx.beginPath(); ctx.arc(T / 2, T / 2 - 4, 9, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(21,128,61,0.5)'; ctx.beginPath(); ctx.arc(T / 2 + 4, T / 2 - 2, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#78716c'; ctx.fillRect(T / 2 - 3, T / 2 + 4, 6, 8);
    });

    // Whiteboard
    this.tex('tile-whiteboard', ctx => {
      ctx.fillStyle = '#ffffff'; ctx.fillRect(2, 3, T - 4, T - 6);
      ctx.strokeStyle = '#9ca3af'; ctx.lineWidth = 1.5; ctx.strokeRect(2, 3, T - 4, T - 6);
      ctx.fillStyle = 'rgba(59,130,246,0.1)';
      ctx.fillRect(5, 6, 8, 1); ctx.fillRect(5, 10, 14, 1); ctx.fillRect(5, 14, 10, 1);
    });

    // Overhead light glow
    this.tex('tile-light', ctx => {
      const g = ctx.createRadialGradient(T / 2, T / 2, 2, T / 2, T / 2, 14);
      g.addColorStop(0, 'rgba(251,191,36,0.12)'); g.addColorStop(1, 'transparent');
      ctx.fillStyle = g; ctx.fillRect(0, 0, T, T);
    });
  }

  /** Fallback simple avatars if VisualFXManager fails */
  generateFallbackAvatars() {
    const avatars = [
      { key: 'avatar-ceo', color: 0xc5a059 },
      { key: 'agent-planning', color: 0x3b82f6 },
      { key: 'agent-executing', color: 0x22c55e },
      { key: 'agent-blocked', color: 0xef4444 },
      { key: 'agent-idle', color: 0x9ca3af },
      { key: 'avatar-01', color: 0x6366f1 },
      { key: 'avatar-02', color: 0xec4899 },
      { key: 'avatar-03', color: 0xf59e0b },
      { key: 'avatar-04', color: 0x06b6d4 },
    ];
    avatars.forEach(({ key, color }) => {
      const g = this.make.graphics({ add: false });
      g.fillStyle(color); g.fillCircle(T / 2, T / 2, 12);
      g.lineStyle(2, 0xffffff, 0.6); g.strokeCircle(T / 2, T / 2, 12);
      g.generateTexture(key, T, T);
      g.destroy();
    });
  }

  generateOfficeMap() {
    const W = 50, H = 40;
    const ground = Array.from({ length: H }, () => Array(W).fill(0));
    const collision = Array.from({ length: H }, () => Array(W).fill(0));
    const fringe = Array.from({ length: H }, () => Array(W).fill(-1));
    const zones = [];

    // Outer walls
    for (let x = 0; x < W; x++) { ground[0][x] = 1; collision[0][x] = 1; ground[H - 1][x] = 1; collision[H - 1][x] = 1; }
    for (let y = 0; y < H; y++) { ground[y][0] = 1; collision[y][0] = 1; ground[y][W - 1] = 1; collision[y][W - 1] = 1; }

    // Boardroom (glass walls, top-left)
    for (let x = 2; x <= 12; x++) { ground[2][x] = 3; collision[2][x] = 1; ground[10][x] = 3; collision[10][x] = 1; }
    for (let y = 2; y <= 10; y++) { ground[y][2] = 3; collision[y][2] = 1; ground[y][12] = 3; collision[y][12] = 1; }
    ground[10][7] = 2; collision[10][7] = 0; // Door
    for (let y = 3; y <= 9; y++) for (let x = 3; x <= 11; x++) ground[y][x] = 2;
    for (let x = 5; x <= 9; x++) for (let y = 5; y <= 7; y++) collision[y][x] = 12;
    collision[3][7] = 14;
    zones.push({ id: 'boardroom', name: 'The Boardroom', x: 3, y: 3, w: 9, h: 7, private: true });

    // Meeting Room B (top-right)
    for (let x = 36; x <= 47; x++) { ground[2][x] = 3; collision[2][x] = 1; ground[10][x] = 3; collision[10][x] = 1; }
    for (let y = 2; y <= 10; y++) { ground[y][36] = 3; collision[y][36] = 1; ground[y][47] = 3; collision[y][47] = 1; }
    ground[10][41] = 2; collision[10][41] = 0;
    for (let y = 3; y <= 9; y++) for (let x = 37; x <= 46; x++) ground[y][x] = 2;
    for (let x = 40; x <= 43; x++) for (let y = 5; y <= 7; y++) collision[y][x] = 12;
    zones.push({ id: 'meeting-room-b', name: 'Meeting Room B', x: 37, y: 3, w: 10, h: 7, private: true });

    // Open office desks (4 rows × 6 columns)
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 6; col++) {
        const bx = 5 + col * 7, by = 14 + row * 5;
        collision[by][bx] = 10; collision[by][bx + 1] = 11;
        collision[by + 1][bx] = 10; collision[by + 1][bx + 1] = 11;
      }
    }

    // Lounge (bottom-left)
    for (let x = 2; x <= 16; x++) { ground[32][x] = 1; collision[32][x] = 1; }
    ground[32][9] = 0; collision[32][9] = 0;
    for (let y = 32; y <= 38; y++) { ground[y][2] = 1; collision[y][2] = 1; ground[y][16] = 1; collision[y][16] = 1; }
    for (let x = 2; x <= 16; x++) { ground[38][x] = 1; collision[38][x] = 1; }
    for (let y = 33; y <= 37; y++) for (let x = 3; x <= 15; x++) ground[y][x] = 2;
    zones.push({ id: 'lounge', name: 'Lounge', x: 3, y: 33, w: 13, h: 5, private: false });

    // Plants
    [[1, 1], [13, 1], [1, 11], [25, 1], [35, 1], [48, 1], [48, 11], [1, 31], [48, 38], [25, 38], [20, 12], [30, 12]].forEach(([x, y]) => {
      if (y < H && x < W && collision[y][x] === 0) collision[y][x] = 13;
    });

    // Overhead lights (fringe layer)
    for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) {
      const lx = 8 + c * 8, ly = 15 + r * 5;
      if (ly < H && lx < W) fringe[ly][lx] = 1;
    }

    zones.push({ id: 'main-office', name: 'Main Office', x: 0, y: 11, w: 50, h: 21, private: false });
    this.registry.set('mapData', { ground, collision, fringe, zones, width: W, height: H });
  }
}
