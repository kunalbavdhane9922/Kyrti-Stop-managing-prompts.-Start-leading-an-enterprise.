/**
 * Sovereign Protocol — Spatial Audio Engine (Module 3)
 * Web Audio API service for directional notifications.
 *
 * SECURITY: Output-only audio. No microphone access.
 * No recording capability. No external audio streams.
 */

class SpatialAudioEngineService {
  constructor() {
    this._ctx = null;
    this._masterGain = null;
    this._enabled = false;
    this._initialized = false;
  }

  /**
   * Initializes the Web Audio API context.
   * Must be called after a user gesture (browser requirement).
   */
  init() {
    if (this._initialized) return;
    try {
      this._ctx = new (window.AudioContext || window.webkitAudioContext)();
      this._masterGain = this._ctx.createGain();
      this._masterGain.gain.value = 0.3;
      this._masterGain.connect(this._ctx.destination);
      this._initialized = true;
    } catch (e) {
      console.warn('[SpatialAudio] Web Audio API not available.');
    }
  }

  /**
   * Enables or disables audio output.
   */
  setEnabled(enabled) {
    this._enabled = enabled;
    if (this._ctx && this._ctx.state === 'suspended' && enabled) {
      this._ctx.resume();
    }
  }

  /**
   * Plays a directional notification sound at a 3D position.
   * @param {string} type - 'blocked', 'executing', 'idle'
   * @param {Object} position - { x, y, z } in scene coordinates
   */
  playNotification(type, position) {
    if (!this._enabled || !this._initialized || !this._ctx) return;

    const osc = this._ctx.createOscillator();
    const gain = this._ctx.createGain();
    const panner = this._ctx.createStereoPanner();

    // Map 3D x-position to stereo pan (-1 to 1)
    const panValue = Math.max(-1, Math.min(1, (position.x || 0) / 5));
    panner.pan.value = panValue;

    // Sound profiles per type
    const profiles = {
      blocked: { freq: 440, duration: 0.3, wave: 'square', vol: 0.4 },
      executing: { freq: 220, duration: 0.15, wave: 'sine', vol: 0.1 },
      idle: { freq: 180, duration: 0.1, wave: 'sine', vol: 0.05 },
    };

    const profile = profiles[type] || profiles.idle;
    const now = this._ctx.currentTime;

    osc.type = profile.wave;
    osc.frequency.setValueAtTime(profile.freq, now);
    gain.gain.setValueAtTime(profile.vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + profile.duration);

    osc.connect(gain);
    gain.connect(panner);
    panner.connect(this._masterGain);

    osc.start(now);
    osc.stop(now + profile.duration);
  }

  /**
   * Plays ambient work hum — subtle background audio.
   */
  playAmbient() {
    if (!this._enabled || !this._initialized || !this._ctx) return;

    const osc = this._ctx.createOscillator();
    const gain = this._ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = 60;
    gain.gain.value = 0.02;

    osc.connect(gain);
    gain.connect(this._masterGain);

    osc.start();

    // Store reference for cleanup
    this._ambientOsc = osc;
    this._ambientGain = gain;
  }

  /**
   * Stops ambient audio.
   */
  stopAmbient() {
    if (this._ambientOsc) {
      try { this._ambientOsc.stop(); } catch (e) { /* already stopped */ }
      this._ambientOsc = null;
    }
  }

  /**
   * Sets master volume (0.0 to 1.0).
   */
  setVolume(vol) {
    if (this._masterGain) {
      this._masterGain.gain.value = Math.max(0, Math.min(1, vol));
    }
  }

  /**
   * Cleans up all audio resources.
   */
  destroy() {
    this.stopAmbient();
    if (this._ctx && this._ctx.state !== 'closed') {
      this._ctx.close();
    }
    this._ctx = null;
    this._masterGain = null;
    this._initialized = false;
    this._enabled = false;
  }
}

// Singleton instance
const SpatialAudioEngine = new SpatialAudioEngineService();

export { SpatialAudioEngine };
