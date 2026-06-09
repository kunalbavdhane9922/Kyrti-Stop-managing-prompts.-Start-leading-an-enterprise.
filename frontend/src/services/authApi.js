/**
 * Sovereign Protocol — Auth API Client
 * 
 * Real API client for the Sovereign Protocol backend.
 * Replaces the old mockApi auth methods with actual HTTP calls.
 * 
 * All auth endpoints hit: POST /api/v1/auth/*
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3002';
const AUTH_BASE = `${API_BASE}/api/v1/auth`;

/**
 * Makes an authenticated or unauthenticated request to the backend.
 * @param {string} url 
 * @param {object} options 
 * @returns {Promise<object>}
 */
async function request(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Attach access token if available (stored in memory via Zustand)
  const accessToken = window.__sovereignAccessToken;
  if (accessToken && !options.skipAuth) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Send httpOnly cookies (refresh token)
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.error?.message || 'Request failed');
    error.code = data.error?.code || 'UNKNOWN_ERROR';
    error.status = response.status;
    error.details = data.error?.details;
    error.violations = data.error?.violations;
    throw error;
  }

  return data;
}

const authApi = {
  /**
   * Registers a new user account.
   * @param {{ email: string, password: string, name: string }} params
   * @returns {Promise<{ success: boolean, data: { userId: string, email: string } }>}
   */
  async register({ email, password, name }) {
    return request(`${AUTH_BASE}/register`, {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
      skipAuth: true,
    });
  },

  /**
   * Authenticates a user with email and password.
   * @param {{ email: string, password: string, fingerprint?: string }} params
   * @returns {Promise<{ success: boolean, data: { requires2FA: boolean, partialToken?: string, accessToken?: string, user: object } }>}
   */
  async login({ email, password, fingerprint }) {
    const result = await request(`${AUTH_BASE}/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password, fingerprint }),
      skipAuth: true,
    });

    // Store access token in memory (zero-persistence)
    if (result.data?.accessToken) {
      window.__sovereignAccessToken = result.data.accessToken;
    }

    return result;
  },

  /**
   * Verifies a 2FA code after login.
   * @param {{ partialToken: string, code: string }} params
   * @returns {Promise<{ success: boolean, data: { accessToken: string, user: object } }>}
   */
  async verify2FA({ partialToken, code }) {
    const result = await request(`${AUTH_BASE}/verify-2fa`, {
      method: 'POST',
      body: JSON.stringify({ partialToken, code }),
      skipAuth: true,
    });

    // Store access token in memory
    if (result.data?.accessToken) {
      window.__sovereignAccessToken = result.data.accessToken;
    }

    return result;
  },

  /**
   * Refreshes the access token using the httpOnly refresh cookie.
   */
  async refresh() {
    const result = await request(`${AUTH_BASE}/refresh`, {
      method: 'POST',
      skipAuth: true,
    });

    if (result.data?.accessToken) {
      window.__sovereignAccessToken = result.data.accessToken;
    }

    return result;
  },

  /**
   * Gets the currently authenticated user.
   */
  async me() {
    return request(`${AUTH_BASE}/me`, { method: 'GET' });
  },

  /**
   * Initiates 2FA setup (get setupToken, secret, uri).
   */
  async setup2FA() {
    return request(`${AUTH_BASE}/setup-2fa`, { method: 'POST' });
  },

  /**
   * Confirms 2FA setup by verifying a code.
   */
  async confirm2FA({ code }) {
    return request(`${AUTH_BASE}/confirm-2fa`, {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  },

  /**
   * Disables 2FA (requires password and current code).
   */
  async disable2FA({ password, code }) {
    return request(`${AUTH_BASE}/disable-2fa`, {
      method: 'POST',
      body: JSON.stringify({ password, code }),
    });
  },

  /**
   * Selects a tenant using Level 2 token.
   */
  async selectTenant({ tenantSelectionToken, tenantId, fingerprint }) {
    const result = await request(`${AUTH_BASE}/select-tenant`, {
      method: 'POST',
      body: JSON.stringify({ tenantSelectionToken, tenantId, fingerprint }),
      skipAuth: true,
    });

    if (result.data?.accessToken) {
      window.__sovereignAccessToken = result.data.accessToken;
    }

    return result;
  },

  /**
   * Verifies a recovery code.
   */
  async verifyRecoveryCode({ partialToken, code }) {
    return request(`${AUTH_BASE}/verify-recovery-code`, {
      method: 'POST',
      body: JSON.stringify({ partialToken, code }),
      skipAuth: true,
    });
  },

  /**
   * Logs out and revokes the current session.
   */
  async logout() {
    const result = await request(`${AUTH_BASE}/logout`, { method: 'POST' });
    window.__sovereignAccessToken = null;
    return result;
  },

  /**
   * Logs out from all devices (force kill).
   */
  async logoutAll() {
    const result = await request(`${AUTH_BASE}/logout-all`, { method: 'POST' });
    window.__sovereignAccessToken = null;
    return result;
  },

  /**
   * Gets all active sessions.
   */
  async getSessions() {
    return request(`${AUTH_BASE}/sessions`, { method: 'GET' });
  },

  /**
   * Terminates a specific session.
   */
  async deleteSession(sessionId) {
    return request(`${AUTH_BASE}/sessions/${sessionId}`, { method: 'DELETE' });
  },

  /**
   * Clears the in-memory access token (called on session wipe).
   */
  clearToken() {
    window.__sovereignAccessToken = null;
  },
};

export { authApi };
