import axiosInterceptor from '@/lib/axiosInterceptors';

interface Applicants {
  campaignId?: string;
  status: string;
  currentPage: number;
}
export const getApplicants = async ({
  campaignId,
  status,
  currentPage,
}: Applicants) => {
  const params = new URLSearchParams();
  params.append('page', `${currentPage}`);
  if (status === '전체') {
    params.append('status', status);
  }
  const url = `/campaigns/${campaignId}/applicants?${params.toString()}`;
  const response = await axiosInterceptor.get(url);
  return response.data.data;
};
