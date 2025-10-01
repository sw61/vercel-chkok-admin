import axiosInterceptor from '@/lib/axiosInterceptors';

interface ApiResponse {
  bannerUrl: string;
  redirectUrl: string;
  title: string;
  description: string;
  position: string;
  displayOrder?: number;
}

// 배너 상세 정보 조회
export const getBannersDetail = async (id: string) => {
  const response = await axiosInterceptor.get(`/api/banners/${id}`);
  return response.data.data;
};

// 배너 수정
export const editBanners = async (id: string, data: ApiResponse) => {
  const response = await axiosInterceptor.put(`/api/banners/${id}`, {
    bannerUrl: data.bannerUrl,
    redirectUrl: data.redirectUrl,
    title: data.title,
    description: data.description,
    position: data.position,
    displayOrder: data.displayOrder,
  });
  return response.data.data;
};

// 배너 삭제
export const deleteBanners = async (id: string) => {
  const response = await axiosInterceptor.delete(`/api/banners/${id}`);
  return response.data.data;
};
