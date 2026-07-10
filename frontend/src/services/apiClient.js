import { useAuthStore } from '../store/authStore.js';
import { API_BASE_URL } from '../config/constants.js';

const GATEWAY_URL = `${API_BASE_URL}/api/v1`;

/**
 * Retry config for handling Render free-tier cold starts (502/503/504).
 * Each failed request takes ~26s (Netlify proxy timeout), so the first
 * attempt triggers the backend wake-up. We retry with fixed 10s delays
 * to give the service enough time to finish booting (~60-120s total).
 */
const RETRY_STATUS_CODES = [502, 503, 504];
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 10000; // Fixed 10-second delay between retries

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
        console.warn(`[Kyrti] Server waking up (HTTP ${response.status}), retrying in ${RETRY_DELAY_MS / 1000}s... (attempt ${attempt + 1}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
        continue;
      }

      break;
    } catch (fetchError) {
      if (attempt < MAX_RETRIES) {
        console.warn(`[Kyrti] Network error, retrying in ${RETRY_DELAY_MS / 1000}s... (attempt ${attempt + 1}/${MAX_RETRIES})`, fetchError.message);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
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
