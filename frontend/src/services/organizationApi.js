/**
 * Sovereign Protocol — Organization API
 * Handles all interactions with the saep-organization microservice.
 * Manages org hierarchy, nodes, permissions, invitations, and AI recruitment.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const ORG_BASE = `${API_BASE}/api/v1/organizations`;

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
    const error = new Error(data?.error?.message || data.message || `Request failed (HTTP ${response.status})`);
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

export const organizationApi = {
  /** Submit full organization build from wizard */
  createBuild: async (tenantId, payload, options = {}) => {
    return request(`${ORG_BASE}/${tenantId}/build`, {
      method: 'POST',
      body: JSON.stringify(payload),
      ...options,
    });
  },

  /** Get full hierarchy tree */
  getHierarchy: async (tenantId, options = {}) => {
    return request(`${ORG_BASE}/${tenantId}/hierarchy`, {
      method: 'GET',
      ...options,
    });
  },

  /** Add a new node */
  addNode: async (tenantId, nodeData, options = {}) => {
    return request(`${ORG_BASE}/${tenantId}/nodes`, {
      method: 'POST',
      body: JSON.stringify(nodeData),
      ...options,
    });
  },

  /** Update a node (edit, reparent, etc.) */
  updateNode: async (tenantId, nodeId, updates, options = {}) => {
    return request(`${ORG_BASE}/${tenantId}/nodes/${nodeId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
      ...options,
    });
  },

  /** Delete a node */
  deleteNode: async (tenantId, nodeId, options = {}) => {
    return request(`${ORG_BASE}/${tenantId}/nodes/${nodeId}`, {
      method: 'DELETE',
      ...options,
    });
  },

  /** Get permission catalog (system + tenant custom) */
  getPermissionCatalog: async (tenantId, options = {}) => {
    return request(`${ORG_BASE}/${tenantId}/permissions/catalog`, {
      method: 'GET',
      ...options,
    });
  },

  /** Add a custom permission to the catalog */
  addCustomPermission: async (tenantId, permData, options = {}) => {
    return request(`${ORG_BASE}/${tenantId}/permissions/catalog`, {
      method: 'POST',
      body: JSON.stringify(permData),
      ...options,
    });
  },

  /** Get permissions for a specific node */
  getNodePermissions: async (tenantId, nodeId, options = {}) => {
    return request(`${ORG_BASE}/${tenantId}/nodes/${nodeId}/permissions`, {
      method: 'GET',
      ...options,
    });
  },

  /** Update permissions for a specific node */
  updateNodePermissions: async (tenantId, nodeId, permissions, options = {}) => {
    return request(`${ORG_BASE}/${tenantId}/nodes/${nodeId}/permissions`, {
      method: 'PUT',
      body: JSON.stringify(permissions),
      ...options,
    });
  },

  /** Send human invitation for a node */
  inviteHuman: async (tenantId, nodeId, { name, email }, options = {}) => {
    return request(`${ORG_BASE}/${tenantId}/nodes/${nodeId}/invite`, {
      method: 'POST',
      body: JSON.stringify({ name, email }),
      ...options,
    });
  },

  /** Mark a node for AI recruitment */
  recruitAI: async (tenantId, nodeId, options = {}) => {
    return request(`${ORG_BASE}/${tenantId}/nodes/${nodeId}/recruit`, {
      method: 'POST',
      body: JSON.stringify({}),
      ...options,
    });
  },
};
