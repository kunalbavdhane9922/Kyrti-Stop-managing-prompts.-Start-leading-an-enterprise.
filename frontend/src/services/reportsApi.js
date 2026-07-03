/**
 * Sovereign Protocol — Reports API
 * Abstraction layer for operational and intelligence reports.
 */

import { API_BASE_URL } from '../config/constants.js';

const REPORTS_BASE = `${API_BASE_URL}/api/v1/reports`;

async function request(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const accessToken = options.token || window.__sovereignAccessToken;
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

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

  if (!response.ok) {
    throw new Error(data.error?.message || data.message || `HTTP ${response.status}`);
  }

  return { data, status: response.status };
}

export const reportsApi = {
  getOperationalMetrics: async (companyId) => {
    try {
      const { fetchWithAuth } = await import('./apiClient.js');
      const data = await fetchWithAuth('/metrics/operational');
      return { data };
    } catch (error) {
      console.warn("Metrics API failed, falling back to mock data.", error);
      return Promise.resolve({
        data: {
          activeAgents: 142,
          activeWorkflows: 89,
          completedTasks: 12540,
          errorRate: 0.8,
        }
      });
    }
  },

  getWorkforceMetrics: async (companyId) => {
    try {
      const { fetchWithAuth } = await import('./apiClient.js');
      const data = await fetchWithAuth('/metrics/workforce');
      return { data };
    } catch (error) {
      console.warn("Metrics API failed, falling back to mock data.", error);
      return Promise.resolve({
        data: {
          utilization: {
            Engineering: 92,
            Marketing: 72,
            Finance: 85,
            Operations: 88
          },
          capacity: 100,
          humanVsAiSplit: { human: 15, ai: 85 }
        }
      });
    }
  },

  getRecommendations: async (companyId) => {
    // Return mock promise until backend is ready
    return Promise.resolve({
      data: [
        { id: 1, type: 'optimization', text: 'Engineering department is operating at 92% utilization. Consider deploying additional agents.' },
        { id: 2, type: 'warning', text: 'Marketing workforce is underutilized by 28%. Review active task queues.' },
        { id: 3, type: 'insight', text: 'Allocating 2 more Agents to Finance could reduce SLA times by 40% based on current backlog.' }
      ]
    });
    // return request(`${REPORTS_BASE}/${companyId}/recommendations`, { method: 'GET' });
  }
};
