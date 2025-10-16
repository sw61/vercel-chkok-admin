import axiosInterceptor from '@/lib/axiosInterceptors';

const getNoticeTable = async (currentPage: number = 0) => {
  const response = await axiosInterceptor.get(
    `/api/admin/notices?page=${currentPage}`
  );
  return response.data.data;
};
const searchNotice = async (searchKey: string) => {
  const response = await axiosInterceptor.get(
    `/api/admin/notices/search?title=${searchKey}`
  );
  return response.data.data;
};
