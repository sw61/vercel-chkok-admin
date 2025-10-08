import axiosInterceptor from '@/lib/axiosInterceptors';
import axios from 'axios';
import { toast } from 'react-toastify';
interface BannerData {
  id: number;
  title: string;
  bannerUrl: string;
  redirectUrl: string;
  description: string;
  position: string;
  createdAt: string;
  updatedAt: string;
  displayOrder: number;
}

interface ApiResponse {
  bannerUrl: string;
  redirectUrl: string;
  title: string;
  description: string;
  position: string;
  displayOrder?: number;
}

interface UpdateResponse {
  id: number;
  displayOrder: number;
}
// 배너 이미지 목록 조회
export const getBannersTable = async (): Promise<BannerData[]> => {
  const response = await axiosInterceptor.get(`/api/banners`);
  return response.data.data;
};
// 배너 생성
export const createBanner = async (data: ApiResponse) => {
  await axiosInterceptor.post('/api/banners', {
    bannerUrl: data.bannerUrl,
    redirectUrl: data.redirectUrl,
    title: data.title,
    description: data.description,
    position: data.position,
    displayOrder: data.displayOrder,
  });
};
// 배너 순서 일괄 변경 (드래그 & 드롭)
export const updateBannerOrder = async (updatedBanners: UpdateResponse[]) => {
  const requestBody = {
    banners: updatedBanners.map((banner, index) => ({
      id: banner.id,
      displayOrder: index + 1,
    })),
  };
  await axiosInterceptor.patch('/api/banners/order', requestBody);
};

// 이미지 파일 선택 + presignedUrl 을 통해 S3 이미지 업로드
export const urlUpload = async (imageFile: File) => {
  if (!imageFile) {
    toast.error('이미지 파일을 선택해주세요.');
    return;
  }
  const fileExtension = imageFile.name.split('.').pop()?.toLowerCase() || 'jpg';
  try {
    const response = await axiosInterceptor.post(
      '/api/images/banners/presigned-url',
      { fileExtension }
    );
    const url = response.data.data.presignedUrl;
    const contentType = imageFile.type || 'image/jpeg';
    await axios.put(url, imageFile, {
      headers: {
        'Content-Type': contentType,
      },
    });
    toast.success('이미지가 업로드 되었습니다.');
    return url.split('?')[0]; // presignedUrl 에서 이미지 주소만 추출
  } catch (error) {
    toast.error('이미지 업로드에 실패했습니다.');
    console.error(error);
  }
};
