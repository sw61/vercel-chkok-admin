import axiosInterceptor from '@/lib/axiosInterceptors';

export const getNoticeTable = async (currentPage: number = 0) => {
  const response = await axiosInterceptor.get(
    `/api/admin/notices?page=${currentPage}`
  );
  return response.data.data;
};
export const searchNotice = async (
  currentPage: number = 0,
  searchKey: string
) => {
  const response = await axiosInterceptor.get(
    `/api/admin/notices/search?page=${currentPage}&title=${searchKey}`
  );
  return response.data.data;
};
