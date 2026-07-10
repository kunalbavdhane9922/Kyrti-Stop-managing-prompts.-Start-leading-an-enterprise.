import { useAuthStore } from '../store/authStore.js';
import { API_BASE_URL } from '../config/constants.js';

const GATEWAY_URL = `${API_BASE_URL}/api/v1`;

/**
 * Retry config for handling Render free-tier cold starts (502/503/504).
 */
const RETRY_STATUS_CODES = [502, 503, 504];
const MAX_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 2000; // 2 seconds, doubles each retry

export async function fetchWithAuth(endpoint, options = {}) {
  const state = useAuthStore.getState();
  const token = state.token;
  const tenantId = state.user?.tenantId || '';

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (tenantId) {
    headers['X-Tenant-Id'] = tenantId;
  }

  let response;
  const maxAttempts = MAX_RETRIES + 1;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      response = await fetch(`${GATEWAY_URL}${endpoint}`, {
        ...options,
        headers,
      });

      // Retry on gateway errors (Render cold start)
      if (RETRY_STATUS_CODES.includes(response.status) && attempt < MAX_RETRIES) {
        const delay = RETRY_BASE_DELAY_MS * Math.pow(2, attempt);
        console.warn(`[Kyrti] Server waking up (HTTP ${response.status}), retrying in ${delay / 1000}s... (attempt ${attempt + 1}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      break;
    } catch (fetchError) {
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_BASE_DELAY_MS * Math.pow(2, attempt);
        console.warn(`[Kyrti] Network error, retrying in ${delay / 1000}s... (attempt ${attempt + 1}/${MAX_RETRIES})`, fetchError.message);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw fetchError;
    }
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      // Optional: useAuthStore.getState().logout()
    }
    const errorBody = await response.text().catch(() => '');
    throw new Error(`API Error ${response.status}: ${errorBody}`);
  }

  // Some endpoints might return 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
}
