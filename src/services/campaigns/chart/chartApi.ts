import axiosInterceptor from '@/lib/axiosInterceptors';

export const getCampaignStatus = async () => {
  const response = await axiosInterceptor.get(`/campaigns/stats`);
  return response.data.data;
};
