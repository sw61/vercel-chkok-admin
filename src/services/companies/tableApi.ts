import axiosInterceptor from '@/lib/axiosInterceptors';

export const getCompanyTable = async (currentPage: number) => {
  const response = await axiosInterceptor.get(
    `/api/companies/examine?page=${currentPage}&size=10`
  );
  return response.data.data;
};
