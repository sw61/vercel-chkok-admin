import axiosInterceptor from '@/lib/axiosInterceptors';

interface CurrentPage {
  currentPage: number;
}
export const getCompanyTable = async ({ currentPage }: CurrentPage) => {
  const response = await axiosInterceptor.get(
    `/api/companies/examine?page=${currentPage}&size=10`
  );
  return response.data.data;
};
