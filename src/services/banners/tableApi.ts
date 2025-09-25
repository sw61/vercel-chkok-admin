import axiosInterceptor from '@/lib/axiosInterceptors';

// 배너 이미지 목록 조회
export const getBannersTable = async (id: string) => {
  const response = await axiosInterceptor.get(`/api/banners/${id}`);
  return response.data.data;
};

export const editBanners = async (id: string) => {
  const response = await axiosInterceptor.put(`/api/banners/${id}`);
};

export const deleteBanners = async (id: string) => {
  const response = await axiosInterceptor.delete(`/api/banners/${id}`);
};
