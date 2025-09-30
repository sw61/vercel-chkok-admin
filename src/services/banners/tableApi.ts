import axiosInterceptor from '@/lib/axiosInterceptors';
// import axios from 'axios';
interface EditResponse {
  bannerUrl: string;
  redirectUrl: string;
  title: string;
  description: string;
  position: string;
}
// 배너 이미지 목록 조회
export const getBannersTable = async () => {
  const response = await axiosInterceptor.get(`/api/banners`);
  return response.data.data;
};

export const getBannersDetail = async (id: string) => {
  const response = await axiosInterceptor.get(`/api/banners/${id}`);
  return response.data.data;
};

export const editBanners = async (id: string, data: EditResponse) => {
  const response = await axiosInterceptor.put(`/api/banners/${id}`, {
    bannerUrl: data.bannerUrl,
    redirectUrl: data.redirectUrl,
    title: data.title,
    description: data.description,
    position: data.position,
  });
  return response.data.data;
};

export const deleteBanners = async (id: string) => {
  const response = await axiosInterceptor.delete(`/api/banners/${id}`);
  return response.data.data;
};
