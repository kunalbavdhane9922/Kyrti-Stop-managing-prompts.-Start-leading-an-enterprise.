/**
 * Sovereign Protocol — Company API
 * Handles interactions with the saep-company microservice.
 */

import { CompanyDto } from '../dto/CompanyDto.js';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const COMPANY_BASE = `${API_BASE}/api/v1/companies`;

async function request(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const accessToken = options.token || window.__sovereignAccessToken;
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  // Remove custom token property so it doesn't get passed to fetch options directly
  const fetchOptions = { ...options };
  delete fetchOptions.token;

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
    credentials: 'include',
  });

  let data = {};
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { message: text };
    }
  }

  if (response.status === 401 && !options._retry) {
    try {
      options._retry = true;
      const refreshResponse = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        window.__sovereignAccessToken = refreshData.data?.accessToken;
        
        // Remove old token from fetchOptions so it picks up the new global one
        return await request(url, fetchOptions);
      }
    } catch (refreshErr) {
      // Refresh failed
    }
  }

  if (!response.ok) {
    const error = new Error(data?.error?.message || `Request failed (HTTP ${response.status})`);
    error.code = data?.error?.code || 'UNKNOWN_ERROR';
    error.status = response.status;
    error.details = data?.error?.details;
    
    if (response.status === 401) {
      window.__sovereignAccessToken = null;
      window.dispatchEvent(new Event('sovereign_unauthorized'));
    }
    
    throw error;
  }

  return { data, status: response.status };
}

export const companyApi = {
  /**
   * Creates a new company/workspace.
   * @param {Object} payload { name, domain }
   */
  createCompany: async (payload, options = {}) => {
    const res = await request(COMPANY_BASE, {
      method: 'POST',
      body: JSON.stringify(payload),
      ...options
    });
    if (res.data) res.data = CompanyDto.fromApi(res.data);
    return res;
  },

  /**
   * Initializes the organizational structure of a company.
   * @param {String} tenantId
   * @param {Object} payload { tenantId, schemaVersion, payload }
   */
  initializeCompany: async (tenantId, payload, options = {}) => {
    const res = await request(`${COMPANY_BASE}/${tenantId}/initialize`, {
      method: 'POST',
      body: JSON.stringify(payload),
      ...options
    });
    if (res.data) res.data = CompanyDto.fromApi(res.data);
    return res;
  },

  getMembers: async (tenantId, status = '') => {
    const url = `${COMPANY_BASE}/${tenantId}/members${status ? `?status=${status}` : ''}`;
    return request(url, { method: 'GET' });
  },

  removeMember: async (tenantId, membershipId) => {
    return request(`${COMPANY_BASE}/${tenantId}/members/${membershipId}`, { method: 'DELETE' });
  },

  suspendMember: async (tenantId, membershipId) => {
    return request(`${COMPANY_BASE}/${tenantId}/members/${membershipId}/suspend`, { method: 'PUT' });
  },

  inviteMember: async (tenantId, email) => {
    return request(`${COMPANY_BASE}/${tenantId}/invites`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  getInvitation: async (token) => {
    return request(`${API_BASE}/api/v1/invites/${token}`, { method: 'GET' });
  },

  acceptInvitation: async (token) => {
    return request(`${API_BASE}/api/v1/invites/${token}/accept`, { method: 'POST' });
  },

  getHierarchy: async (companyId) => {
    return request(`${COMPANY_BASE}/${companyId}/hierarchy`, { method: 'GET' });
  }
};
