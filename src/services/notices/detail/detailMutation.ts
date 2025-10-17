import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { EditParams } from './detailType';
import { deleteNotice, editNotice } from './detailApi';
import { useNavigate } from 'react-router-dom';

export const useEditNoticeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, EditParams>({
    mutationFn: ({ id, payload }) => editNotice(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['noticeDetail'] });
      toast.success('공지사항이 수정되었습니다.');
    },
    onError: () => {
      toast.error('공지사항 수정에 실패했습니다.');
    },
  });
};
export const useDeleteNoticeMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (id: string) => deleteNotice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['noticeTable'] });
      navigate('/notices');
      toast.success('공지사항이 삭제되었습니다.');
    },
    onError: () => {
      toast.error('공지사항 삭제에 실패했습니다.');
    },
  });
};
