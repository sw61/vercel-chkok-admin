import { useMutation } from '@tanstack/react-query';
import { deleteNotice, editNotice } from './detailAPI';
import { toast } from 'sonner';
import type { EditParams } from './detailType';

export const useEditNoticeMutation = () => {
  return useMutation<void, Error, EditParams>({
    mutationFn: ({ id, payload }) => editNotice(id, payload),
    onSuccess: () => {
      toast.success('공지사항이 수정되었습니다.');
    },
    onError: () => {
      toast.error('공지사항 수정에 실패했습니다.');
    },
  });
};
export const useDeleteNoticeMutation = () => {
  return useMutation({
    mutationFn: (id: string) => deleteNotice(id),
    onSuccess: () => {
      toast.success('공지사항이 삭제되었습니다.');
    },
    onError: () => {
      toast.error('공지사항 삭제에 실패했습니다.');
    },
  });
};
