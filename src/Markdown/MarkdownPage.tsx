import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axiosInterceptor from "@/lib/axios-interceptors";
import { useState } from "react";

interface MarkdownData {
  id: number;
  title: string;
  viewCount: number;
  authorId: number;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}
export default function MarkdownPage() {
  const [markdownData, setMarkdownData] = useState<MarkdownData>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 마크다운 목록 조회
  const getMarkdownData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInterceptor.get("/api/admin/markdowns");
      const data = response.data.data;
      setMarkdownData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    <div>스켈레톤 ui</div>;
  }
  return (
    <>
      <Card className="px-6 py-4">
        <CardTitle className="ck-title">마크다운 문서</CardTitle>

        <CardContent></CardContent>
      </Card>
    </>
  );
}
