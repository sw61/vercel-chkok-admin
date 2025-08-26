import axiosInterceptor from "@/lib/axios-interceptors";
import { toast } from "react-toastify";

export default function MarkdownCreatePage() {
  const createMarkdown = async () => {
    const response = await axiosInterceptor("/api/admin/markdowns");
    toast.success("문서가 생성되었습니다.");
  };
  return <></>;
}
