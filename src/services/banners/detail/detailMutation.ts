import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBanners, editBanners } from './detailApi';
import type { ApiResponse, EditBannerParams } from './detailType';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useEditBannerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse, Error, EditBannerParams>({
    mutationFn: ({ id, payload }) => editBanners(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bannerDetail'] });
      toast.success('배너가 수정되었습니다.');
    },
    onError: () => {
      toast.error('배너 수정에 실패했습니다.');
    },
  });
};

export const useDeleteBannerMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation<string, Error, string>({
    mutationFn: (id) => deleteBanners(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['bannersTable'],
      });
      navigate('/banners');
      toast.success('배너가 삭제되었습니다.');
    },
  });
};
