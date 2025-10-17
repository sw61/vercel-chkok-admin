import axiosInterceptor from '@/lib/axiosInterceptors';
import type { CreateParams, EditResponse } from '../type/articleType';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// 아티클 생성
export const createArticle = async (payload: EditResponse) => {
  const response = await axiosInterceptor.post('/api/admin/posts', payload);
  return response.data;
};

export const useCreateArticleMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation<EditResponse, Error, CreateParams>({
    mutationFn: (payload) => createArticle(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['articleTable'],
      });
      navigate('/articles');
      toast.success('아티클이 생성되었습니다.');
    },
    onError: () => {
      toast.error('아티클 생성에 실패했습니다.');
    },
  });
};
