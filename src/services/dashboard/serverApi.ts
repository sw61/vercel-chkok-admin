import axiosInterceptor from '@/lib/axiosInterceptors';

export const getTestServerData = async () => {
  const response = await axiosInterceptor.get(
    'http://43.202.128.121:9090/api/v1/query?query=up{job="node"}'
  );
  console.log(response.data.data.result);
  return response.data.data.result;
};
