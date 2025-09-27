import axiosInterceptor from '@/lib/axiosInterceptors';

interface UserTable {
  currentPage?: number;
  column?: string;
  direction?: string;
  searchKey?: string;
}

// 유저 목록 조회
export const getUserTable = async ({
  currentPage,
  column,
  direction,
}: UserTable) => {
  const response = await axiosInterceptor.get(
    `/users?page=${currentPage}&size=10&sortBy=${column}&sortDirection=${direction}`
  );
  return response.data.data;
};

// 사용자 검색
export const searchUser = async ({ searchKey, currentPage }: UserTable) => {
  const response = await axiosInterceptor.get(
    `/users/search?keyword=${searchKey}&page=${currentPage}&size=10`
  );
  return response.data.data;
};
