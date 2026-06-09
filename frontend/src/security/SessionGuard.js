/**
 * Sovereign Protocol — Session Guard
 * Enforces the 5-minute idle timeout and tab-close wipe policy.
 * When triggered, ALL sensitive state is purged from memory.
 * The Human Presence token is wiped, requiring re-authentication.
 */

import { SESSION_TIMEOUT_MS, SESSION_WARNING_MS } from '../config/constants.js';

/**
 * @typedef {Object} SessionGuardConfig
 * @property {Function} onExpire - Callback when session expires
 * @property {Function} onWarning - Callback when session is about to expire
 * @property {Function} onActivity - Callback when user activity is detected
 */

class SessionGuardService {
  constructor() {
    this._timerId = null;
    this._warningTimerId = null;
    this._lastActivity = Date.now();
    this._isActive = false;
    this._onExpire = null;
    this._onWarning = null;
    this._onActivity = null;
    this._boundHandleActivity = this._handleActivity.bind(this);
    this._boundHandleVisibility = this._handleVisibilityChange.bind(this);
    this._boundHandleBeforeUnload = this._handleBeforeUnload.bind(this);
  }

  /**
   * Starts the session guard with the provided callbacks.
   * Monitors user activity and enforces idle timeout.
   * 
   * @param {SessionGuardConfig} config
   */
  start(config) {
    if (this._isActive) this.stop();

    this._onExpire = config.onExpire;
    this._onWarning = config.onWarning;
    this._onActivity = config.onActivity;
    this._lastActivity = Date.now();
    this._isActive = true;

    // Monitor user activity events
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
    activityEvents.forEach(event => {
      document.addEventListener(event, this._boundHandleActivity, { passive: true });
    });

    // Monitor tab visibility
    document.addEventListener('visibilitychange', this._boundHandleVisibility);

    // Wipe on tab/browser close
    window.addEventListener('beforeunload', this._boundHandleBeforeUnload);

    // Start the idle check timer
    this._startIdleCheck();
  }

  /**
   * Stops the session guard and removes all listeners.
   */
  stop() {
    this._isActive = false;

    if (this._timerId) {
      clearInterval(this._timerId);
      this._timerId = null;
    }

    if (this._warningTimerId) {
      clearTimeout(this._warningTimerId);
      this._warningTimerId = null;
    }

    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
    activityEvents.forEach(event => {
      document.removeEventListener(event, this._boundHandleActivity);
    });

    document.removeEventListener('visibilitychange', this._boundHandleVisibility);
    window.removeEventListener('beforeunload', this._boundHandleBeforeUnload);
  }

  /**
   * Returns the remaining session time in milliseconds.
   * @returns {number} Remaining time in ms
   */
  getRemainingTime() {
    const elapsed = Date.now() - this._lastActivity;
    return Math.max(0, SESSION_TIMEOUT_MS - elapsed);
  }

  /**
   * Returns whether the session is currently in warning state.
   * @returns {boolean}
   */
  isInWarningState() {
    return this.getRemainingTime() <= SESSION_WARNING_MS;
  }

  /**
   * Resets the idle timer on user activity.
   */
  resetTimer() {
    this._lastActivity = Date.now();
  }

  // --- Private Methods ---

  _handleActivity() {
    this._lastActivity = Date.now();
    if (this._onActivity) this._onActivity();
  }

  _handleVisibilityChange() {
    if (document.visibilityState === 'hidden') {
      // Tab is hidden — start accelerated countdown
      // When tab returns, check if session expired
    } else if (document.visibilityState === 'visible') {
      const elapsed = Date.now() - this._lastActivity;
      if (elapsed >= SESSION_TIMEOUT_MS) {
        this._expire();
      }
    }
  }

  _handleBeforeUnload() {
    // Wipe all sensitive state on tab/browser close
    if (this._onExpire) {
      this._onExpire('tab_close');
    }
  }

  _startIdleCheck() {
    // Check every second for idle timeout
    this._timerId = setInterval(() => {
      const remaining = this.getRemainingTime();

      if (remaining <= 0) {
        this._expire();
        return;
      }

      if (remaining <= SESSION_WARNING_MS && this._onWarning) {
        this._onWarning(remaining);
      }
    }, 1000);
  }

  _expire() {
    this.stop();
    if (this._onExpire) {
      this._onExpire('idle_timeout');
    }
  }
}

// Singleton instance
const SessionGuard = new SessionGuardService();

export { SessionGuard };
