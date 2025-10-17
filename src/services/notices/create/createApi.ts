import axiosInterceptor from '@/lib/axiosInterceptors';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

interface CreatePayload {
  title: string;
  content: string;
  isMust: boolean;
}

const createNotice = async (payload: CreatePayload) => {
  const response = await axiosInterceptor.post('/api/admin/notices', {
    payload,
  });
  return response.data.data;
};
export const useCreateNoticeMutation = () => {
  return useMutation({
    mutationFn: (payload: CreatePayload) => createNotice(payload),
    onSuccess: () => {
      toast.success('공지사항이 생성되었습니다.');
    },
    onError: () => {
      toast.error('공지사항 생성에 실패했습니다.');
    },
  });
};
