/**
 * EventBus — Singleton event emitter for React ↔ Phaser communication.
 * Replaces raw window.addEventListener patterns with a clean, testable API.
 *
 * Usage:
 *   EventBus.emit('spawn_agent', { x: 10, y: 5 });
 *   EventBus.on('spawn_agent', (data) => { ... });
 *   EventBus.off('spawn_agent', handler);
 */

const listeners = {};

const EventBus = {
  on(event, callback) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(callback);
  },

  off(event, callback) {
    if (!listeners[event]) return;
    listeners[event] = listeners[event].filter((cb) => cb !== callback);
  },

  emit(event, data) {
    if (!listeners[event]) return;
    listeners[event].forEach((cb) => cb(data));
  },

  removeAllListeners(event) {
    if (event) {
      delete listeners[event];
    } else {
      Object.keys(listeners).forEach((key) => delete listeners[key]);
    }
  },
};

export default EventBus;
