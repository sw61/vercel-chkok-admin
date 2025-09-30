// src/hooks/useAddImage.ts
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import axiosInterceptor from '@/lib/axiosInterceptors';
import axios from 'axios';

interface UseAddImageReturn {
  imageHandler: (
    blob: File,
    callback: (url: string, altText: string) => void
  ) => void;
}

// S3에 이미지 업로드
const uploadImageFile = async (file: File): Promise<string> => {
  const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  try {
    toast.info('이미지 업로드 중 입니다...');
    const response = await axiosInterceptor.post(
      '/api/images/kokpost/presigned-url',
      {
        fileExtension,
      }
    );
    const presignedUrl = response.data.data.presignedUrl.split('?')[0];
    const contentType = file.type || 'image/jpeg';
    await axios.put(presignedUrl, file, {
      headers: { 'Content-Type': contentType },
    });
    return presignedUrl;
  } catch (error) {
    toast.error('이미지 업로드에 실패했습니다.');
    throw error;
  }
};

export const useAddImage = (): UseAddImageReturn => {
  // Toast UI Editor의 addImageBlobHook에 사용할 imageHandler
  const imageHandler = useCallback(
    async (blob: File, callback: (url: string, altText: string) => void) => {
      try {
        const url = await uploadImageFile(blob);
        callback(url, blob.name);
        toast.success('이미지가 삽입 되었습니다.');
      } catch (error) {
        console.error('Image upload failed:', error);
      }
    },
    []
  );

  return {
    imageHandler,
  };
};
