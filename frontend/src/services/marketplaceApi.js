import { fetchWithAuth } from './apiClient.js';
import { AgentDto } from '../dto/AgentDto.js';
import { mapToDto } from '../dto/Mapper.js';

export const marketplaceApi = {
  getAgents: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/marketplace/agents?${queryParams}` : '/marketplace/agents';
    const data = await fetchWithAuth(endpoint);
    return mapToDto(data, AgentDto);
  },

  getFilters: async () => {
    return await fetchWithAuth('/marketplace/filters');
  },

  hireAgent: async (agentId, hireData) => {
    const data = await fetchWithAuth(`/marketplace/agents/${agentId}/hire`, {
      method: 'POST',
      body: JSON.stringify(hireData)
    });
    return AgentDto.fromApi(data);
  }
};
