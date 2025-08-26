import axiosInterceptor from "@/lib/axios-interceptors";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

interface MarkdownData {
  id: number;
  title: string;
  content: string;
  viewCount: number;
  authorId: number;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}
export default function MarkdownDetail() {
  const { markdownId } = useParams<{ markdownId: string }>();
  const [markdownData, setMarkdownData] = useState<MarkdownData>();
  const [editData, setEditData] = useState({ title: "", content: "" });
  // 마크다운 상세 조회
  const getMarkdownDetail = async (id: string) => {
    const response = await axiosInterceptor.get(`/api/admin/markdowns/${id}`);
    const data = response.data.data;
    setMarkdownData(data);
  };
  // 마크다운 수정
  const editMarkdown = async (id: string) => {
    const response = await axiosInterceptor.put(`/api/admin/markdowns/${id}`, {
      title: editData.title,
      content: editData.content,
    });
    await getMarkdownDetail(markdownId!);
  };
  // 마크다운 삭제
  const deleteMarkdown = async (id: string) => {
    if (window.confirm("문서를 삭제하시겠습니까?"))
      try {
        const response = await axiosInterceptor.delete(
          `/api/admin/markdowns/${id}`,
        );
        toast.success("문서가 삭제되었습니다.");
      } catch (error) {
        console.log(error);
      }
  };
  useEffect(() => {
    if (markdownId) {
      getMarkdownDetail(markdownId);
    }
  }, [markdownId]);
  return <></>;
}
