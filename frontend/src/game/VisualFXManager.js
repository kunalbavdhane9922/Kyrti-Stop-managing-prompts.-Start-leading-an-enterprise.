/**
 * Sovereign Virtual Office — VisualFXManager
 * 
 * Manages all premium visual effects:
 * - Procedural high-end avatar textures with gradient fills & metallic sheen
 * - Pulsing status rings beneath avatars
 * - Particle emitters for AI state observability
 * - Dynamic point lights for avatars and smart objects
 */
import Phaser from 'phaser';

const T = 32;

export class VisualFXManager {
  constructor(scene) {
    this.scene = scene;
    this.particles = new Map();    // userId -> emitter
    this.statusRings = new Map();  // userId -> graphics object
    this.pointLights = new Map();  // userId -> light
  }

  // ═══════════════════════════════════════════════════════════
  //  1. PROCEDURAL HIGH-END AVATAR TEXTURES
  // ═══════════════════════════════════════════════════════════

  /**
   * Generate all avatar textures as premium "Monolith" pawns
   * with gradient fills, drop shadows, and metallic sheen.
   */
  generateAvatarTextures() {
    // CEO — Gold/Emerald gradient monolith
    this.createMonolithAvatar('avatar-ceo', {
      bodyGradient: [0xc5a059, 0x92702a],
      sheenColor: 0xfef3c7,
      crownColor: 0xc5a059,
      shadowColor: 0x78350f,
    });

    // AI Agent States
    this.createMonolithAvatar('agent-planning', {
      bodyGradient: [0x3b82f6, 0x1d4ed8],
      sheenColor: 0xdbeafe,
      crownColor: 0x60a5fa,
      shadowColor: 0x1e3a5f,
    });

    this.createMonolithAvatar('agent-executing', {
      bodyGradient: [0x22c55e, 0x15803d],
      sheenColor: 0xdcfce7,
      crownColor: 0x4ade80,
      shadowColor: 0x14532d,
    });

    this.createMonolithAvatar('agent-blocked', {
      bodyGradient: [0xef4444, 0xb91c1c],
      sheenColor: 0xfee2e2,
      crownColor: 0xf87171,
      shadowColor: 0x7f1d1d,
    });

    this.createMonolithAvatar('agent-idle', {
      bodyGradient: [0x9ca3af, 0x6b7280],
      sheenColor: 0xf3f4f6,
      crownColor: 0xd1d5db,
      shadowColor: 0x374151,
    });

    // Human user avatars
    const userColors = [
      { key: 'avatar-01', body: [0x6366f1, 0x4338ca], sheen: 0xe0e7ff, crown: 0x818cf8, shadow: 0x312e81 },
      { key: 'avatar-02', body: [0xec4899, 0xbe185d], sheen: 0xfce7f3, crown: 0xf472b6, shadow: 0x831843 },
      { key: 'avatar-03', body: [0xf59e0b, 0xd97706], sheen: 0xfef3c7, crown: 0xfbbf24, shadow: 0x78350f },
      { key: 'avatar-04', body: [0x06b6d4, 0x0891b2], sheen: 0xcffafe, crown: 0x22d3ee, shadow: 0x164e63 },
    ];
    userColors.forEach(c => {
      this.createMonolithAvatar(c.key, {
        bodyGradient: c.body,
        sheenColor: c.sheen,
        crownColor: c.crown,
        shadowColor: c.shadow,
      });
    });
  }

  /**
   * Draw a sleek "Monolith" pawn avatar with:
   * - Gradient body fill (tall rounded rectangle)
   * - Metallic sheen highlight
   * - Drop shadow
   * - Crown accent dot
   */
  createMonolithAvatar(key, { bodyGradient, sheenColor, crownColor, shadowColor }) {
    const canvas = this.scene.textures.createCanvas(key, T, T);
    const ctx = canvas.getContext();

    ctx.clearRect(0, 0, T, T);

    const cx = T / 2;
    const bodyW = 16;
    const bodyH = 22;
    const bodyX = cx - bodyW / 2;
    const bodyY = T - bodyH - 2;
    const radius = 5;

    // Drop shadow
    ctx.fillStyle = `rgba(0, 0, 0, 0.15)`;
    ctx.beginPath();
    ctx.ellipse(cx, T - 1, 10, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body gradient fill
    const grad = ctx.createLinearGradient(bodyX, bodyY, bodyX + bodyW, bodyY + bodyH);
    grad.addColorStop(0, this.hexToCSS(bodyGradient[0]));
    grad.addColorStop(1, this.hexToCSS(bodyGradient[1]));
    ctx.fillStyle = grad;
    this.roundRect(ctx, bodyX, bodyY, bodyW, bodyH, radius);
    ctx.fill();

    // Metallic sheen (left-side highlight)
    const sheenGrad = ctx.createLinearGradient(bodyX, bodyY, bodyX + bodyW * 0.4, bodyY);
    sheenGrad.addColorStop(0, this.hexToCSS(sheenColor, 0.35));
    sheenGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = sheenGrad;
    this.roundRect(ctx, bodyX, bodyY, bodyW * 0.45, bodyH, radius);
    ctx.fill();

    // Crown accent (small circle at top)
    ctx.fillStyle = this.hexToCSS(crownColor);
    ctx.beginPath();
    ctx.arc(cx, bodyY + 5, 4, 0, Math.PI * 2);
    ctx.fill();

    // Inner crown highlight
    ctx.fillStyle = this.hexToCSS(sheenColor, 0.6);
    ctx.beginPath();
    ctx.arc(cx - 1, bodyY + 4, 1.5, 0, Math.PI * 2);
    ctx.fill();

    canvas.refresh();
  }

  // ═══════════════════════════════════════════════════════════
  //  2. STATUS RINGS (Floating beneath avatars)
  // ═══════════════════════════════════════════════════════════

  /**
   * Create a pulsing status ring beneath an avatar.
   * @param {string} userId
   * @param {Phaser.GameObjects.Image} sprite
   * @param {string} type - 'ceo' | 'executing' | 'blocked' | 'planning' | 'idle'
   */
  createStatusRing(userId, sprite, type) {
    this.removeStatusRing(userId);

    const gfx = this.scene.add.graphics().setDepth(8);
    this.statusRings.set(userId, { gfx, type, sprite, phase: 0 });
  }

  updateStatusRings(time) {
    this.statusRings.forEach(({ gfx, type, sprite, phase }, userId) => {
      if (!sprite || !sprite.active) { this.removeStatusRing(userId); return; }

      gfx.clear();
      const x = sprite.x;
      const y = sprite.y + 14;

      if (type === 'ceo') {
        // Solid Gold/Emerald ring
        gfx.lineStyle(2, 0xc5a059, 0.7 + Math.sin(time / 600) * 0.2);
        gfx.strokeEllipse(x, y, 22, 8);
        gfx.lineStyle(1, 0x22c55e, 0.3 + Math.sin(time / 800) * 0.2);
        gfx.strokeEllipse(x, y, 26, 10);
      } else if (type === 'executing') {
        // Spinning cyan dashed ring
        const segments = 8;
        const dashAngle = (Math.PI * 2) / segments;
        const rotation = (time / 500) % (Math.PI * 2);
        gfx.lineStyle(1.5, 0x06b6d4, 0.7);
        for (let i = 0; i < segments; i += 2) {
          const startAngle = rotation + i * dashAngle;
          const endAngle = startAngle + dashAngle * 0.7;
          gfx.beginPath();
          gfx.arc(x, y, 12, startAngle, endAngle);
          gfx.strokePath();
        }
      } else if (type === 'blocked') {
        // Pulsing amber/crimson ring
        const pulse = 0.4 + Math.sin(time / 300) * 0.4;
        gfx.lineStyle(2, 0xef4444, pulse);
        gfx.strokeEllipse(x, y, 22, 8);
        gfx.lineStyle(1, 0xf59e0b, pulse * 0.6);
        gfx.strokeEllipse(x, y, 26, 10);
      } else if (type === 'planning') {
        // Gentle blue pulse
        gfx.lineStyle(1.5, 0x3b82f6, 0.4 + Math.sin(time / 700) * 0.2);
        gfx.strokeEllipse(x, y, 22, 8);
      } else {
        // Idle — very faint
        gfx.lineStyle(1, 0xd1d5db, 0.2);
        gfx.strokeEllipse(x, y, 20, 7);
      }
    });
  }

  removeStatusRing(userId) {
    const ring = this.statusRings.get(userId);
    if (ring) { ring.gfx.destroy(); this.statusRings.delete(userId); }
  }

  // ═══════════════════════════════════════════════════════════
  //  3. PARTICLE SYSTEMS FOR AI OBSERVABILITY
  // ═══════════════════════════════════════════════════════════

  /**
   * Create a "data stream" particle effect above an executing AI agent.
   * Tiny 1×1 cyan pixels floating upward and fading.
   */
  createDataStreamParticles(userId, sprite) {
    this.removeParticles(userId);

    // Generate 1×1 pixel texture for particles
    if (!this.scene.textures.exists('particle-cyan')) {
      const c = this.scene.textures.createCanvas('particle-cyan', 2, 2);
      const cx = c.getContext();
      cx.fillStyle = '#FF5C00';
      cx.fillRect(0, 0, 2, 2);
      c.refresh();
    }

    const emitter = this.scene.add.particles(sprite.x, sprite.y - 12, 'particle-cyan', {
      speed: { min: 8, max: 20 },
      angle: { min: 260, max: 280 },
      scale: { start: 0.8, end: 0 },
      alpha: { start: 0.6, end: 0 },
      lifespan: { min: 600, max: 1200 },
      frequency: 100,
      quantity: 1,
      blendMode: 'ADD',
    }).setDepth(15);

    this.particles.set(userId, { emitter, type: 'datastream' });
  }

  /**
   * Create "sparks/smoke" particles for a blocked AI agent.
   * Amber sparks to visually flag human intervention needed.
   */
  createBlockedParticles(userId, sprite) {
    this.removeParticles(userId);

    if (!this.scene.textures.exists('particle-amber')) {
      const c = this.scene.textures.createCanvas('particle-amber', 2, 2);
      const cx = c.getContext();
      cx.fillStyle = '#6B4226';
      cx.fillRect(0, 0, 2, 2);
      c.refresh();
    }

    const emitter = this.scene.add.particles(sprite.x, sprite.y - 8, 'particle-amber', {
      speed: { min: 5, max: 15 },
      angle: { min: 230, max: 310 },
      scale: { start: 1, end: 0 },
      alpha: { start: 0.7, end: 0 },
      lifespan: { min: 400, max: 800 },
      frequency: 200,
      quantity: 1,
      tint: [0xf59e0b, 0xef4444],
      blendMode: 'ADD',
    }).setDepth(15);

    this.particles.set(userId, { emitter, type: 'blocked' });
  }

  /**
   * Update particle emitter positions to follow their avatar.
   */
  updateParticles() {
    this.particles.forEach(({ emitter, type }, userId) => {
      const sprite = this.scene.remotePlayers?.get(userId);
      if (sprite && sprite.active) {
        emitter.setPosition(sprite.x, sprite.y - (type === 'datastream' ? 12 : 8));
      }
    });
  }

  removeParticles(userId) {
    const p = this.particles.get(userId);
    if (p) { p.emitter.destroy(); this.particles.delete(userId); }
  }

  // ═══════════════════════════════════════════════════════════
  //  4. DYNAMIC POINT LIGHTS
  // ═══════════════════════════════════════════════════════════

  /**
   * Create a point light attached to the CEO avatar.
   */
  createCEOLight(sprite) {
    try {
      const light = this.scene.lights.addLight(sprite.x, sprite.y, 200, 0xf0f4ff, 0.6);
      this.pointLights.set('ceo', light);
    } catch (e) {
      // Light2D not available — graceful fallback
      console.warn('[VFX] Light2D not available, skipping CEO light');
    }
  }

  /**
   * Create emanation glow for smart objects (terminals, servers).
   */
  createSmartObjectLight(x, y, color, intensity) {
    try {
      return this.scene.lights.addLight(x, y, 120, color, intensity || 0.4);
    } catch (e) {
      return null;
    }
  }

  updateCEOLight(sprite) {
    const light = this.pointLights.get('ceo');
    if (light) { light.x = sprite.x; light.y = sprite.y; }
  }

  // ═══════════════════════════════════════════════════════════
  //  5. UTILITY HELPERS
  // ═══════════════════════════════════════════════════════════

  hexToCSS(hex, alpha) {
    const r = (hex >> 16) & 0xff;
    const g = (hex >> 8) & 0xff;
    const b = hex & 0xff;
    if (alpha !== undefined) return `rgba(${r},${g},${b},${alpha})`;
    return `rgb(${r},${g},${b})`;
  }

  roundRect(ctx, x, y, w, h, r) {
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

  /**
   * Set AI agent visual state — swaps particles and rings.
   */
  setAgentVisualState(userId, state, sprite) {
    // Status ring
    this.createStatusRing(userId, sprite, state);

    // Particles
    if (state === 'executing') {
      this.createDataStreamParticles(userId, sprite);
    } else if (state === 'blocked') {
      this.createBlockedParticles(userId, sprite);
    } else {
      this.removeParticles(userId);
    }
  }

  /**
   * Cleanup everything for a user.
   */
  removeAll(userId) {
    this.removeStatusRing(userId);
    this.removeParticles(userId);
    const light = this.pointLights.get(userId);
    if (light) { this.scene.lights.removeLight(light); this.pointLights.delete(userId); }
  }

  destroy() {
    this.statusRings.forEach((_, uid) => this.removeStatusRing(uid));
    this.particles.forEach((_, uid) => this.removeParticles(uid));
    this.pointLights.clear();
  }
}
