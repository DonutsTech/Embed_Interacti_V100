import type { ErrorMessage } from '@/@types/error';
import api from '../config';

export const getCampaigns = async (campaignId: string) => {
  try {
    const { data } = await api.get(`/campaigns/${campaignId}/embed`);

    if (!data || !data.CAMPAIGN) {
      return {
        STATUS: 401,
        MESSAGE: 'Mensagem errar ao buscar campanhas',
      } as ErrorMessage;
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const getTestAB = async (testabId: string) => {
  try {
    const { data } = await api.get(`/testAB/${testabId}/embed`);

    if (!data || !data.CAMPAIGN) {
      return {
        STATUS: 401,
        MESSAGE: 'Mensagem errar ao buscar campanhas',
      } as ErrorMessage;
    }

    return data;
  } catch (error) {
    throw error;
  }
}
