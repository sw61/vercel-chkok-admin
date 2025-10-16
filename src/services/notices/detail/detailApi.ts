import axiosInterceptor from '@/lib/axiosInterceptors';
import type { EditPayload } from './detailType';

export const getNoticeDetail = async (id: string) => {
  const response = await axiosInterceptor.get(`/api/admin/notices/${id}`);
  return response.data.data;
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
