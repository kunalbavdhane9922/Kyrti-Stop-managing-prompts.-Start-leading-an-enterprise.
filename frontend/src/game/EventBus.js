/**
 * Sovereign Virtual Office — EventBus
 * 
 * Decoupled React ↔ Phaser communication bridge.
 * Includes 16.6ms (60fps) throttling for high-frequency events
 * to prevent flooding the signaling server.
 */

class EventBusClass {
  constructor() {
    this.listeners = new Map();
    this.throttleTimers = new Map();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  once(event, callback) {
    const wrapper = (...args) => { callback(...args); this.off(event, wrapper); };
    this.on(event, wrapper);
  }

  off(event, callback) {
    const set = this.listeners.get(event);
    if (set) { set.delete(callback); if (set.size === 0) this.listeners.delete(event); }
  }

  emit(event, data) {
    const set = this.listeners.get(event);
    if (set) {
      for (const cb of set) {
        try { cb(data); } catch (err) { console.error(`[EventBus] "${event}":`, err); }
      }
    }
  }

  /**
   * Throttled emit — enforces exactly 16.6ms (60fps) cadence.
   * Used for player-moved to prevent socket flooding.
   */
  emitThrottled(event, data) {
    if (this.throttleTimers.has(event)) return;
    this.emit(event, data);
    this.throttleTimers.set(event, setTimeout(() => {
      this.throttleTimers.delete(event);
    }, 16.6));
  }

  removeAll() {
    this.listeners.clear();
    this.throttleTimers.forEach(t => clearTimeout(t));
    this.throttleTimers.clear();
  }
}

export const EventBus = new EventBusClass();
