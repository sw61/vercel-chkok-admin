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
  const url =
    status === '전체'
      ? `/campaigns/${campaignId}/applicants?page=${currentPage}`
      : `/campaigns/${campaignId}/applicants?page=${currentPage}&status=${status}`;
  const response = await axiosInterceptor.get(url);
  return response.data.data;
};
