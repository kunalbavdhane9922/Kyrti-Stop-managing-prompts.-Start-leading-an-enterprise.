import { fetchWithAuth } from './apiClient.js';

export const governanceApi = {
  getProposals: async () => {
    return await fetchWithAuth('/governance/proposals');
  },
  
  getAgents: async () => {
    // Agents are actually managed by workforce
    return await fetchWithAuth('/professionals');
  },

  getBlockerReports: async () => {
    // If governance blocker reports don't exist yet, return empty
    return [];
  },
  
  getProposalById: async (id) => {
    return await fetchWithAuth(`/governance/proposals/${id}`);
  },

  getPolicies: async () => {
    return await fetchWithAuth('/governance/policies');
  },

  submitProposal: async (payload) => {
    return await fetchWithAuth('/governance/proposals', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  submitDecision: async (proposalId, decisionData) => {
    return await fetchWithAuth(`/governance/proposals/${proposalId}/decisions`, {
      method: 'POST',
      body: JSON.stringify(decisionData)
    });
  }
};
