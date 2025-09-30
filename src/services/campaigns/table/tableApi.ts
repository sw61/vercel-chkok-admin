import axiosInterceptor from '@/lib/axiosInterceptors';

interface CampaignTable {
  currentPage: number;
  campaignType?: string;
  searchKey?: string;
}
export const getCampaignTable = async ({
  currentPage,
  campaignType,
}: CampaignTable) => {
  const url =
    campaignType === 'ALL'
      ? `/campaigns?page=${currentPage}&size=10`
      : `/campaigns?approvalStatus=${campaignType}&page=${currentPage}&size=10`;
  const response = await axiosInterceptor.get(url);
  return response.data.data;
};

export const searchCampaign = async ({
  searchKey,
  currentPage,
}: CampaignTable) => {
  const response = await axiosInterceptor.get(
    `/campaigns/search?keyword=${searchKey}&page=${currentPage}&size=10`
  );
  return response.data.data;
};
