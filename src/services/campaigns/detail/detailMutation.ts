import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  approveCampaigns,
  deleteCampaigns,
  rejectCampaigns,
} from './detailApi';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import type { ApproveProps } from './detailType';



// 캠페인 삭제 Mutation
export const useDeleteCampaignsMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (id: string) => deleteCampaigns(id),
    onSuccess: () => {
      navigate('/campaigns');
      toast.success('캠페인이 삭제되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['campaignTable'],
      });
    },
    onError: () => {
      toast.error('캠페인 삭제 중 오류가 발생했습니다.');
    },
  });
};
// 캠페인 승인 Mutation
export const useApproveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, ApproveProps>({
    mutationFn: ({ id, comment }) => approveCampaigns(id, comment!),
    onSuccess: () => {
      toast.success('캠페인이 승인되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['campaignDetail'],
      });
    },
    onError: () => {
      toast.error('캠페인 승인 중 오류가 발생했습니다.');
    },
  });
};
// 캠페인 거절 Mutation
export const useRejectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, ApproveProps>({
    mutationFn: ({ id, comment }) => rejectCampaigns(id, comment!),
    onSuccess: () => {
      toast.success('캠페인이 거절되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['campaignDetail'],
      });
    },
    onError: () => {
      toast.error('캠페인 거절 중 오류가 발생했습니다.');
    },
  });
};
