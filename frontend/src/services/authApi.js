/**
 * Sovereign Protocol — Auth API Client
 * 
 * Real API client for the Sovereign Protocol backend.
 * Replaces the old mockApi auth methods with actual HTTP calls.
 * 
 * All auth endpoints hit: POST /api/v1/auth/*
 */

import { AuthDto } from '../dto/AuthDto.js';
import { API_BASE_URL } from '../config/constants.js';

const AUTH_BASE = `${API_BASE_URL}/api/v1/auth`;

/**
 * Makes an authenticated or unauthenticated request to the backend.
 * @param {string} url 
 * @param {object} options 
 * @returns {Promise<object>}
 */
/**
 * Retry config for handling Render free-tier cold starts (502/503/504).
 * Retries up to 3 times with exponential backoff before giving up.
 */
const RETRY_STATUS_CODES = [502, 503, 504];
const MAX_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 2000; // 2 seconds, doubles each retry

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

  let response;
  let lastError;
  const maxAttempts = MAX_RETRIES + 1; // 1 initial + 3 retries

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // Send httpOnly cookies (refresh token)
      });

      // If it's a gateway error (cold start), retry with backoff
      if (RETRY_STATUS_CODES.includes(response.status) && attempt < MAX_RETRIES) {
        const delay = RETRY_BASE_DELAY_MS * Math.pow(2, attempt); // 2s, 4s, 8s
        console.warn(`[Kyrti] Server waking up (HTTP ${response.status}), retrying in ${delay / 1000}s... (attempt ${attempt + 1}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      break; // Success or non-retryable error
    } catch (fetchError) {
      // Network errors (e.g., DNS failure, connection refused) — also retry
      lastError = fetchError;
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_BASE_DELAY_MS * Math.pow(2, attempt);
        console.warn(`[Kyrti] Network error, retrying in ${delay / 1000}s... (attempt ${attempt + 1}/${MAX_RETRIES})`, fetchError.message);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw fetchError;
    }
  }

  let data = {};
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (e) {
      // Non-JSON response (e.g., empty 401)
    }
  }

  if (response.status === 401 && !url.includes('/auth/refresh') && !options._retry) {
    try {
      // Avoid infinite loops
      options._retry = true;
      
      // Request a new token via refresh endpoint
      const refreshResponse = await fetch(`${AUTH_BASE}/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        const refreshDto = AuthDto.fromApi(refreshData.data);
        window.__sovereignAccessToken = refreshDto.token;
        
        // Retry original request
        return await request(url, options);
      }
    } catch (refreshErr) {
      // Refresh failed, fall through to throw original 401
    }
  }

  if (!response.ok) {
    const error = new Error(data?.error?.message || `Authentication failed (HTTP ${response.status})`);
    error.code = data?.error?.code || 'UNKNOWN_ERROR';
    error.status = response.status;
    error.details = data?.error?.details;
    error.violations = data?.error?.violations;
    
    // Auto logout if refresh fails
    if (response.status === 401) {
      window.__sovereignAccessToken = null;
      // Trigger logout via event to avoid circular imports with store
      if (!options.ignoreAuthError) {
        window.dispatchEvent(new Event('sovereign_unauthorized'));
      }
    }
    
    throw error;
  }

  return data;
}

const authApi = {
  /**
   * Registers a new user account.
   * @param {{ email: string, password: string, name: string }} params
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
   */
  async login({ email, password, fingerprint }) {
    const result = await request(`${AUTH_BASE}/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password, fingerprint }),
      skipAuth: true,
    });

    if (result.data && !result.data.requires2FA && !result.data.requiresTenantSelection) {
      result.data = AuthDto.fromApi(result.data);
      window.__sovereignAccessToken = result.data.token;
    }

    return result;
  },

  /**
   * Verifies a 2FA code after login.
   * @param {{ partialToken: string, code: string }} params
   */
  async verify2FA({ partialToken, code, trustDevice, fingerprint }) {
    const result = await request(`${AUTH_BASE}/verify-2fa`, {
      method: 'POST',
      body: JSON.stringify({ partialToken, code, trustDevice, fingerprint }),
      skipAuth: true,
    });

    // Only parse through AuthDto when we have a final token (not tenant-selection step)
    if (result.data && !result.data.requiresTenantSelection && !result.data.requires2FA) {
      result.data = AuthDto.fromApi(result.data);
      window.__sovereignAccessToken = result.data.token;
    }

    return result;
  },

  /**
   * Refreshes the access token using the httpOnly refresh cookie.
   */
  async refresh() {
    const { CryptoService } = await import('../security/CryptoService.js');
    const fingerprint = await CryptoService.generateSessionFingerprint();
    const result = await request(`${AUTH_BASE}/refresh`, {
      method: 'POST',
      skipAuth: true,
      ignoreAuthError: true,
      body: JSON.stringify({ fingerprint })
    });

    if (result.data) {
      result.data = AuthDto.fromApi(result.data);
      window.__sovereignAccessToken = result.data.token;
    }

    return result;
  },

  /**
   * Pings the server to keep the session alive (Heartbeat)
   * The server tracks this to detect when a tab is closed.
   */
  async heartbeat() {
    return request(`${AUTH_BASE}/heartbeat`, {
      method: 'POST',
      ignoreAuthError: true, // Don't trigger a hard logout on a single dropped packet
    });
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
  async verifyRecoveryCode(data) {
    return request(`${AUTH_BASE}/verify-recovery-code`, {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuth: true,
    });
  },

  /**
   * Resets 2FA settings.
   */
  async reset2FA(data) {
    return request(`${AUTH_BASE}/reset-2fa`, {
      method: 'POST',
      body: JSON.stringify(data),
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
