import axiosInterceptor from '@/lib/axiosInterceptors';
import axios from 'axios';
import type { BannerData, UpdateBannerResponse } from './dragType';
import { toast } from 'sonner';

// 배너 이미지 목록 조회
export const getBannersTable = async (): Promise<BannerData[]> => {
  const response = await axiosInterceptor.get(`/api/banners`);
  return response.data.data;
};

// 배너 순서 일괄 변경 (드래그 & 드롭)
export const updateBannerOrder = async (
  updatedBanners: UpdateBannerResponse[]
) => {
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
