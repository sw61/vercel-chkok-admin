import axiosInterceptor from '@/lib/axiosInterceptors';

export const getCampaignTable = async (
  currentPage: number,
  campaignType: string
) => {
  const params = new URLSearchParams();
  params.append('page', `${currentPage}`);
  params.append('size', '5');
  if (campaignType !== 'ALL') {
    params.append('approvalStatus', campaignType);
  }
  const url = `/campaigns?${params.toString()}`;
  const response = await axiosInterceptor.get(url);
  return response.data.data;
};

export const searchCampaign = async (
  searchKey: string,
  currentPage: number,
  campaignType: string
) => {
  const params = new URLSearchParams();
  params.append('page', `${currentPage}`);
  params.append('keyword', searchKey);
  params.append('size', '5');
  if (campaignType !== 'ALL') {
    params.append('approvalStatus', campaignType);
  }
  const response = await axiosInterceptor.get(
    `/campaigns/search?${params.toString()}`
  );
  return response.data.data;
};
