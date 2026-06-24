import { fetchWithAuth } from './apiClient.js';
import { ProfessionalDto } from '../dto/ProfessionalDto.js';
import { mapToDto } from '../dto/Mapper.js';

export const workforceApi = {
  getProfessionals: async () => {
    const data = await fetchWithAuth('/professionals');
    return mapToDto(data, ProfessionalDto);
  },

  getProfessionalById: async (id) => {
    const data = await fetchWithAuth(`/professionals/${id}`);
    return ProfessionalDto.fromApi(data);
  },

  hireProfessional: async (id, hireData) => {
    const data = await fetchWithAuth(`/professionals/${id}/hire`, {
      method: 'POST',
      body: JSON.stringify(hireData)
    });
    return ProfessionalDto.fromApi(data);
  },

  promoteProfessional: async (id) => {
    const data = await fetchWithAuth(`/professionals/${id}/promote`, {
      method: 'POST'
    });
    return ProfessionalDto.fromApi(data);
  },

  terminateProfessional: async (id) => {
    const data = await fetchWithAuth(`/professionals/${id}/terminate`, {
      method: 'POST'
    });
    return ProfessionalDto.fromApi(data);
  },

  getProfessionalReputation: async (id) => {
    return await fetchWithAuth(`/reputations/professional/${id}`);
  }
};
