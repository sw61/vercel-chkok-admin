import axiosInterceptor from '@/lib/axiosInterceptors';

interface ArticleTable {
  currentPage: number;
  articleType: string;
  searchKey?: string;
}
// 체험콕 아티클 데이터 목록 조회
export const getArticleTable = async ({
  currentPage,
  articleType,
}: ArticleTable) => {
  const url =
    articleType === 'all'
      ? `/api/admin/posts?page=${currentPage}&size=10`
      : `/api/admin/posts?page=${currentPage}&size=10&active=${articleType}`;
  const response = await axiosInterceptor.get(url);
  return response.data.data;
};

// 체험콕 아티클 검색
export const searchArticle = async ({
  currentPage,
  searchKey,
  articleType,
}: ArticleTable) => {
  const response = await axiosInterceptor.get(
    `/api/admin/posts/search?title=${searchKey}&page=${currentPage}&active=${articleType}`
  );
  return response.data.data;
};
