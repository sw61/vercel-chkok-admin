import axiosInterceptor from '@/lib/axiosInterceptors';
import type { CreateParams, EditResponse } from './type/articleType';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

// 아티클 생성
export const createArticle = async (payload: EditResponse) => {
  const response = await axiosInterceptor.post('/api/admin/posts', payload);
  return response.data;
};

export const useCreateArticleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<EditResponse, Error, CreateParams>({
    mutationFn: (payload) => createArticle(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['articleDetail'],
      });
      toast.success('아티클이 수정되었습니다.');
    },
    onError: () => {
      toast.error('아티클 수정에 실패했습니다.');
    },
  });
};
