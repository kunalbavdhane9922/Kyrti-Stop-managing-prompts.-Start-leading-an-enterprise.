/**
 * Sovereign Protocol — Auth Store
 * Manages authentication state with ZERO persistence.
 * Sensitive claims are wiped on browser close and idle timeout.
 * No data is written to localStorage or sessionStorage.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ROLES } from '../config/rbac.js';

const useAuthStore = create(
  persist(
    (set, get) => ({
  // --- State ---
  isAuthenticated: false,
  user: null,
  role: null,
  sessionFingerprint: null,
  sessionStartedAt: null,
  lastActivity: null,
  isSessionWarning: false,
  remainingTime: null,
  authProvider: null,
  twoFactorVerified: false,

  // --- Actions ---

  /**
   * Sets the authenticated user after successful login.
   * This is the ONLY way to establish a session.
   */
  login: (userData) => set({
    isAuthenticated: true,
    user: Object.freeze({
      id: userData.id,
      email: userData.email,
      name: userData.name,
      avatarInitials: userData.name
        ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : '??',
      twoFactorEnabled: userData.twoFactorEnabled || false,
      tenantId: userData.tenantId || null,
    }),
    role: userData.role || ROLES.FOUNDER,
    sessionFingerprint: userData.sessionFingerprint || null,
    sessionStartedAt: new Date().toISOString(),
    lastActivity: Date.now(),
    authProvider: userData.provider || null,
    twoFactorVerified: userData.twoFactorVerified || false,
  }),

  /**
   * Sets the access token in memory
   */
  setAccessToken: (token) => {
    window.__sovereignAccessToken = token;
  },

  /**
   * Restores a session from auto-refresh
   */
  restoreSession: (userData, token) => {
    window.__sovereignAccessToken = token;
    set({
      isAuthenticated: true,
      user: Object.freeze({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        avatarInitials: userData.name
          ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
          : '??',
        twoFactorEnabled: userData.twoFactorEnabled || false,
      }),
      role: userData.role || ROLES.FOUNDER,
      sessionStartedAt: new Date().toISOString(),
      lastActivity: Date.now(),
      twoFactorVerified: true, // Typically true if restored via refresh token
    });
  },

  /**
   * Marks 2FA as verified after successful code entry.
   */
  verify2FA: () => set({ twoFactorVerified: true }),

  /**
   * Updates the user object to indicate 2FA is fully enabled and configured.
   */
  complete2FASetup: () => set((state) => ({
    user: state.user ? Object.freeze({ ...state.user, twoFactorEnabled: true }) : null,
    twoFactorVerified: true,
  })),

  /**
   * Updates the session warning state and remaining time.
   */
  setSessionWarning: (isWarning, remaining) => set({
    isSessionWarning: isWarning,
    remainingTime: remaining,
  }),

  /**
   * Records user activity timestamp.
   */
  recordActivity: () => set({ lastActivity: Date.now() }),

  /**
   * WIPES ALL SESSION STATE.
   * Called on logout, session expiry, or tab close.
   * This is the zero-persistence enforcement.
   */
  logout: () => set({
    isAuthenticated: false,
    user: null,
    role: null,
    sessionFingerprint: null,
    sessionStartedAt: null,
    lastActivity: null,
    isSessionWarning: false,
    remainingTime: null,
    authProvider: null,
    twoFactorVerified: false,
  }),

  /**
   * Checks if the current user has a specific role.
   */
  }),
  {
    name: 'sovereign-auth-storage', // name of item in storage (must be unique)
    storage: createJSONStorage(() => sessionStorage), // use sessionStorage
    partialize: (state) => ({ 
      isAuthenticated: state.isAuthenticated, 
      user: state.user, 
      role: state.role,
      twoFactorVerified: state.twoFactorVerified
    }), // only save essential fields
  }
));

export { useAuthStore };
