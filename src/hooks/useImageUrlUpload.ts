import axiosInterceptor from '@/lib/axiosInterceptors';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

// 이미지 파일 선택 + presignedUrl 을 통해 S3 이미지 업로드
export const urlUpload = async (imageFile: File) => {
  if (!imageFile) {
    toast.error('이미지 파일을 선택해주세요.');
    return;
  }
  const fileExtension = imageFile.name.split('.').pop()?.toLowerCase() || 'jpg';
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

  return url.split('?')[0]; // presignedUrl 에서 이미지 주소만 추출
};

export const useUrlUploadMutation = () => {
  return useMutation({
    mutationFn: (imageFile: File) => urlUpload(imageFile),
    onSuccess: () => {
      toast.success('이미지가 업로드 되었습니다.');
    },
    onError: (error) => {
      toast.error('이미지 업로드를 실패했습니다.');
      console.log(error);
    },
  });
};
