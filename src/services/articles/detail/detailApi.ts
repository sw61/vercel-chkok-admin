import axiosInterceptor from '@/lib/axiosInterceptors';
import { type EditResponse } from '../type/articleType';

// 체험콕 아티클 상세 정보 조회
export const getArticleDetail = async (id: string) => {
  const response = await axiosInterceptor.get(`/api/admin/posts/${id}`);
  return response.data.data;
};

// 체험콕 아티클 수정
export const editArticle = async (id: string, payload: EditResponse) => {
  const response = await axiosInterceptor.put<EditResponse>(
    `/api/admin/posts/${id}`,
    payload
  );
  return response.data;
};

// 체험콕 아티클 삭제
export const deleteArticle = async (id: string) => {
  const response = await axiosInterceptor.delete(`/api/admin/posts/${id}`);
  return response.data;
};
// 아티클 활성화
export const activateArticle = async (id: string) => {
  const response = await axiosInterceptor.patch(
    `/api/admin/posts/${id}/activate`
  );
  return response.data;
};
// 아티클 비활성화
export const deactivateArticle = async (id: string) => {
  const response = await axiosInterceptor.patch(
    `/api/admin/posts/${id}/deactivate`
  );
  return response.data;
};
// 아티클 필드 입력용 캠페인 리스트
export const getCampaignList = async () => {
  const response = await axiosInterceptor.get(`/campaigns/list`);
  return response.data.data;
};
