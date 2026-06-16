/**
 * Sovereign Protocol — Reports API
 * Abstraction layer for operational and intelligence reports.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const REPORTS_BASE = `${API_BASE}/api/v1/reports`;

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
    // Return mock promise until backend is ready
    return Promise.resolve({
      data: {
        activeAgents: 142,
        activeWorkflows: 89,
        completedTasks: 12540,
        errorRate: 0.8,
      }
    });
    // return request(`${REPORTS_BASE}/${companyId}/operational`, { method: 'GET' });
  },

  getWorkforceMetrics: async (companyId) => {
    // Return mock promise until backend is ready
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
    // return request(`${REPORTS_BASE}/${companyId}/workforce`, { method: 'GET' });
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
