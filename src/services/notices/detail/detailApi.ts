import axiosInterceptor from '@/lib/axiosInterceptors';
import type { EditPayload } from './detailType';
import { toast } from 'sonner';

export const getNoticeDetail = async (id: string) => {
  try {
    const response = await axiosInterceptor.get(`/api/admin/notices/${id}`);
    return response.data.data;
  } catch (error) {
    toast.error('공지사항을 불러오는데 실패했습니다.');
    console.log(error);
  }
};
export const editNotice = async (id: string, payload: EditPayload) => {
  const response = await axiosInterceptor.put(`/api/admin/notices/${id}`, {
    payload,
  });
  return response.data.data;
};
export const deleteNotice = async (id: string) => {
  const response = await axiosInterceptor.delete(`/api/admin/notices/${id}`);
  return response.data.data;
};
