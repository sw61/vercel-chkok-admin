import axiosInterceptor from '@/lib/axiosInterceptors';

export const getUsersStatus = async () => {
  const response = await axiosInterceptor.get(`/users/stats`);
  return response.data.data;
};
