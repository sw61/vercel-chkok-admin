import axiosInterceptor from '@/lib/axiosInterceptors';

export const getAdminData = async () => {
  const response = await axiosInterceptor.get('/auth/me');
  return response.data.data;
};
