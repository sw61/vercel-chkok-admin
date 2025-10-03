import axiosInterceptor from '@/lib/axiosInterceptors';

// 체험콕 아티클 데이터 목록 조회
export const getArticleTable = async (
  currentPage: number,
  articleType: string
) => {
  const params = new URLSearchParams();
  params.append('page', `${currentPage}`);
  if (articleType !== 'null') {
    params.append('active', articleType);
  }
  const url = `/api/admin/posts?${params.toString()}`;
  const response = await axiosInterceptor.get(url);
  return response.data.data;
};

// 체험콕 아티클 검색
export const searchArticle = async (
  currentPage: number,
  searchKey: string,
  articleType: string
) => {
  const params = new URLSearchParams();
  params.append('page', `${currentPage}`);
  params.append('title', searchKey);
  if (articleType !== 'null') {
    params.append('active', articleType);
  }
  const url = `/api/admin/posts?page=${params.toString()}`;
  const response = await axiosInterceptor.get(url);
  return response.data.data;
};
