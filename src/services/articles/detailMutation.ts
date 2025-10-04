import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  activateArticle,
  deactivateArticle,
  deleteArticle,
  editArticle,
} from './detailApi';
import { type EditParams, type EditResponse } from './type/articleType';

export const useEditArticleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<EditResponse, Error, EditParams>({
    mutationFn: ({ id, payload }) => editArticle(id, payload),
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

export const useDeleteArticleMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation<string, Error, string>({
    mutationFn: (id) => deleteArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['articleTable'],
      });
      navigate('/articles');
      toast.success('아티클이 삭제되었습니다.');
    },
    onError: () => {
      toast.error('아티클 삭제를 실패했습니다.');
    },
  });
};

export const useActivateArticleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<string, Error, string>({
    mutationFn: (id) => activateArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['articleDetail'],
      });
      toast.success('아티클이 활성화 되었습니다.');
    },
    onError: () => {
      toast.error('아티클 활성화를 실패했습니다.');
    },
  });
};

export const useDeactivateArticleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<string, Error, string>({
    mutationFn: (id) => deactivateArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['articleDetail'],
      });

      toast.success('아티클이 비활성화 되었습니다.');
    },
    onError: () => {
      toast.error('아티클 비활성화를 실패했습니다.');
    },
  });
};
