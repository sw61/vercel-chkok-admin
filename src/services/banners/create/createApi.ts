import axiosInterceptor from '@/lib/axiosInterceptors';
import type { CreateBannerResponse } from '../dragPage/dragType';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// 배너 생성
export const createBanner = async (data: CreateBannerResponse) => {
  await axiosInterceptor.post('/api/banners', {
    bannerUrl: data.bannerUrl,
    redirectUrl: data.redirectUrl,
    title: data.title,
    description: data.description,
    position: data.position,
    displayOrder: data.displayOrder,
  });
};
export const useCreateBannerMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation<void, Error, CreateBannerResponse>({
    mutationFn: (data) => createBanner(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bannersTable'] });
      navigate('/banners');
      toast.success('배너가 생성되었습니다.');
    },
    onError: () => {
      toast.error('배너 생성에 실패했습니다.');
    },
  });
};
