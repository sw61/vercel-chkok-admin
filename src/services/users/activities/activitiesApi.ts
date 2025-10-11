import axiosInterceptor from '@/lib/axiosInterceptors';

export const getActivitiesTable = async (
  id: string,
  currentPage: number,
  status: string
) => {
  const params = new URLSearchParams();
  params.append('page', `${currentPage}`);
  if (status !== 'ALL') {
    params.append('status', status);
  }
  const url = `/users/${id}/activities?${params.toString()}`;
  const response = await axiosInterceptor.get(url);
  return response.data.data;
};
