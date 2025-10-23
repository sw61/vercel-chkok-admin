import axiosInterceptor from '@/lib/axiosInterceptors';
import type { UpdateCampaign } from './detailType';

export const getCampaignDetail = async (id: string) => {
  const response = await axiosInterceptor.get(`/campaigns/${id}`);
  const data = response.data.data;
  const dataMap: Record<string, string> = {
    USER: '사용자',
    CLIENT: '클라이언트',
    ADMIN: '관리자',
    SOCIAL: '소셜',
    LOCAL: '로컬',
  };
  const mappedData = {
    ...data,
    creatorRole: dataMap[data.creator.role] || data.creator.role,
    creatorAccountType: dataMap[data.creator.accountType] || data.accountType,
  };

  return mappedData;
};

export const deleteCampaigns = async (id: string) => {
  const response = await axiosInterceptor.delete(`/campaigns/${id}`);
  return response.data.data;
};

export const approveCampaigns = async (id: string, comment: string) => {
  const response = await axiosInterceptor.put(`/campaigns/${id}/approval`, {
    approvalStatus: 'APPROVED',
    comment: comment,
  });
  return response.data.data;
};
export const rejectCampaigns = async (id: string, comment: string) => {
  const response = await axiosInterceptor.put(`/campaigns/${id}/approval`, {
    approvalStatus: 'REJECTED',
    comment: comment,
  });
  return response.data.data;
};
export const updateCampaigns = async (id: string, payload: UpdateCampaign) => {
  const response = await axiosInterceptor.put(
    `/campaigns/${id}/update`,
    payload
  );
  return response.data.data;
};
