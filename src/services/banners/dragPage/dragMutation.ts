import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UpdateBannerResponse } from './dragType';
import { updateBannerOrder } from './dragTableApi';
import { toast } from 'react-toastify';

export const useUpdateBannerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, UpdateBannerResponse[]>({
    mutationFn: (payload) => updateBannerOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['bannersTable'],
      });
      toast.success('배너 순서가 업데이트 되었습니다.');
    },
  });
};
