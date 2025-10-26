import axiosInterceptor from '@/lib/axiosInterceptors';

interface UserTable {
  currentPage?: number;
  column?: string;
  direction?: string;
  searchKey?: string;
  role: string;
}

// 유저 목록 조회
export const getUserTable = async ({
  currentPage,
  column,
  direction,
  role,
}: UserTable) => {
  const params = new URLSearchParams();
  params.append('page', `${currentPage}`);
  params.append('sortBy', column!);
  params.append('sortDirection', direction!);
  params.append('size', '5');
  if (role !== 'ALL') {
    params.append('role', `${role}`);
  }
  const url = `/users?${params.toString()}`;
  const response = await axiosInterceptor.get(url);
  return response.data.data;
};

// 사용자 검색
export const searchUser = async ({
  searchKey,
  currentPage,
  role,
}: UserTable) => {
  const params = new URLSearchParams();
  params.append('keyword', searchKey!);
  params.append('page', `${currentPage}`);
  params.append('size', '5');
  if (role !== 'ALL') {
    params.append('role', role);
  }
  const url = `/users/search?${params.toString()}`;
  const response = await axiosInterceptor.get(url);
  return response.data.data;
};
