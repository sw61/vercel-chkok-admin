import axiosInterceptor from '@/lib/axiosInterceptors';

export const getUserDetail = async (id: string) => {
  const response = await axiosInterceptor.get(`/users/${id}`);
  const data = response.data.data;
  const accountTypeMap: Record<string, string> = {
    LOCAL: '로컬',
    SOCIAL: '소셜',
  };
  const roleMap: Record<string, string> = {
    USER: '사용자',
    CLIENT: '클라이언트',
    ADMIN: '관리자',
  };
  const genderMap: Record<string, string> = {
    UNKNOWN: '비공개',
    MALE: '남성',
    FEMALE: '여성',
  };
  const providerMap: Record<string, string> = {
    GOOGLE: '구글',
    kakao: '카카오',
  };
  const mappedData = {
    ...data,
    accountType: accountTypeMap[data.accountType] || data.accountType,
    role: roleMap[data.role] || data.role,
    gender: genderMap[data.gender] || data.gender,
    provider: providerMap[data.provider] || data.provider,
  };

  return mappedData;
};

export const putUserStatus = async (id: string) => {
  const response = await axiosInterceptor.put(`/users/${id}/status`);
  return response.data.data;
};

export const deleteUser = async (id: string) => {
  const response = await axiosInterceptor.delete(`/users/${id}`);
  return response.data.data;
};
export const putMemoUpdate = async ({
  id,
  userMemo,
}: {
  id: string | number;
  userMemo: string;
}) => {
  const response = await axiosInterceptor.put(
    `/users/${id}/memo`,
    { userMemo },
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
  return response.data.data;
};
export const userToClient = async (id: string) => {
  await axiosInterceptor.put(`/users/${id}/promote-to-client`);
};
