import { useAuthStore } from '../store/authStore.js';
import { API_BASE_URL } from '../config/constants.js';

const GATEWAY_URL = `${API_BASE_URL}/api/v1`;

export async function fetchWithAuth(endpoint, options = {}) {
  const state = useAuthStore.getState();
  const token = state.token;
  const tenantId = state.user?.tenantId || ''; // Depending on how tenantId is structured in user

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

  const response = await fetch(`${GATEWAY_URL}${endpoint}`, {
    ...options,
    headers,
  });

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
