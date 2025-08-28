import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axiosInterceptor from "@/lib/axios-interceptors";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MDEditor, {
  commands,
  type ICommand,
  type TextState,
} from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import axios from "axios";
import rehypeRaw from "rehype-raw";
import ReactMarkdown from "react-markdown";
import { renderToStaticMarkup } from "react-dom/server";
import { Button } from "@/components/ui/button";

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

interface ImageSize {
  width: string;
  height: string;
}

export default function MarkdownDetail() {
  const { markdownId } = useParams<{ markdownId: string }>();
  const navigate = useNavigate();
  const [markdownData, setMarkdownData] = useState<MarkdownData | null>(null);
  const [editData, setEditData] = useState<{ title: string; content: string }>({
    title: "",
    content: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [presignedUrl, setPresignedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [showImageSizeModal, setShowImageSizeModal] = useState<boolean>(false);
  const [pendingImageData, setPendingImageData] = useState<{
    url: string;
    name: string;
  } | null>(null);
  const [imageSize, setImageSize] = useState<ImageSize>({
    width: "300",
    height: "200",
  });
  const [editorApi, setEditorApi] = useState<any>(null);

  const getMarkdownDetail = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInterceptor.get(`/api/admin/markdowns/${id}`);
      const data = response.data.data;
      setMarkdownData(data);
      setEditData({ title: data.title, content: data.content });
      console.log(response);
    } catch (error) {
      console.log(error);
      toast.error("마크다운 문서를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 마크다운 문서 수정
  const editMarkdown = async (id: number) => {
    try {
      const markdownComponent = (
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
          {editData.content}
        </ReactMarkdown>
      );
      const html = renderToStaticMarkup(markdownComponent);
      const response = await axiosInterceptor.put(
        `/api/admin/markdowns/${id}`,
        {
          title: editData.title,
          content: html,
        },
      );
      toast.success("문서가 수정되었습니다.");
      console.log(response);
      await getMarkdownDetail(markdownId!);
    } catch (error) {
      console.log(error);
      toast.error("문서 수정에 실패했습니다.");
    }
  };

  // 마크다운 문서 삭제
  const deleteMarkdown = async (id: number) => {
    if (window.confirm("문서를 삭제하시겠습니까?")) {
      try {
        await axiosInterceptor.delete(`/api/admin/markdowns/${id}`);
        toast.success("문서가 삭제되었습니다.");
        navigate("/documents");
      } catch (error) {
        console.log(error);
        toast.error("문서 삭제에 실패했습니다.");
      }
    }
  };

  // Upload image to S3
  const uploadImageFile = async (file: File): Promise<string> => {
    setIsUploading(true);
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    try {
      toast.info("이미지 업로드 중 입니다...");
      const response = await axiosInterceptor.post(
        "/api/images/banners/presigned-url",
        {
          fileExtension,
        },
      );
      const presignedUrl = response.data.data.presignedUrl.split("?")[0];
      setPresignedUrl(presignedUrl);
      const contentType = file.type || "image/jpeg";
      await axios.put(presignedUrl, file, {
        headers: { "Content-Type": contentType },
      });
      return presignedUrl;
    } catch (error) {
      toast.error("이미지 업로드에 실패했습니다.");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // Open image size modal
  const openImageSizeModal = (url: string, name: string) => {
    setPendingImageData({ url, name });
    setShowImageSizeModal(true);
  };

  // Insert image with size
  const insertImageWithSize = () => {
    if (!pendingImageData || !editorApi) return;
    const { url, name } = pendingImageData;
    const { width, height } = imageSize;
    const markdownImage = `<img src="${url}" alt="${name}" width="${width}" height="${height}" />`;
    editorApi.replaceSelection(markdownImage);
    setShowImageSizeModal(false);
    toast.success("이미지가 삽입되었습니다.");
    setPendingImageData(null);
    setImageSize({ width: "300", height: "200" });
    setEditData((prev) => ({ ...prev, content: editorApi.getValue() }));
  };

  // Custom image upload command
  const imageUploadCommand: ICommand = {
    name: "imageUpload",
    keyCommand: "imageUpload",
    buttonProps: { "aria-label": "Add image (ctrl + k)" },
    icon: (
      <svg width="13" height="13" viewBox="0 0 20 20">
        <path
          fill="currentColor"
          d="M15 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4-7H1c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 13l-6-5-2 2-4-5-4 8V4h16v11z"
        />
      </svg>
    ),
    execute: async (state: TextState, api) => {
      setEditorApi(api);
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async () => {
        if (input.files && input.files[0]) {
          const file = input.files[0];
          setImageFile(file);
          const url = await uploadImageFile(file);
          openImageSizeModal(url, file.name);
        }
      };
      input.click();
    },
  };

  useEffect(() => {
    if (markdownId) {
      getMarkdownDetail(markdownId);
    }
  }, [markdownId]);

  if (isLoading) {
    return <div>로딩 중</div>;
  }
  if (!markdownData) {
    return <div>데이터 없음</div>;
  }

  return (
    <div className="flex flex-col items-center justify-start p-6">
      <Card className="w-full max-w-4xl px-6 py-4">
        <CardTitle className="ck-title mb-4">마크다운 문서</CardTitle>
        <CardContent>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              제목
            </label>
            <Input
              value={editData.title}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="제목을 입력하세요"
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              내용
            </label>
            <MDEditor
              value={editData.content}
              onChange={(value) =>
                setEditData((prev) => ({ ...prev, content: value || "" }))
              }
              height={500}
              preview="live"
              commands={[
                commands.bold,
                commands.italic,
                commands.strikethrough,
                commands.hr,
                commands.heading,
                commands.divider,
                commands.link,
                commands.quote,
                commands.code,
                commands.codeBlock,
                commands.comment,
                commands.divider,
                imageUploadCommand,
                commands.divider,
                commands.unorderedListCommand,
                commands.orderedListCommand,
                commands.checkedListCommand,
                commands.divider,
                commands.help,
              ]}
            />
          </div>
          <div className="mb-4">
            <p>작성자: {markdownData?.authorName}</p>
            <p>조회수: {markdownData?.viewCount}</p>
            <p>생성일: {markdownData?.createdAt}</p>
            <p>수정일: {markdownData?.updatedAt}</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => editMarkdown(markdownData.id)}
              className="hover:bg-ck-blue-500 px-4 py-2 hover:text-white"
              variant="outline"
            >
              수정
            </Button>
            <Button
              onClick={() => deleteMarkdown(markdownData.id)}
              className="hover:bg-ck-red-500 px-4 py-2 hover:text-white"
              variant="outline"
            >
              삭제
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Image size modal */}
      {showImageSizeModal && (
        <div className="absolute inset-0 z-10 flex h-full w-full items-center justify-center backdrop-blur-sm">
          <div className="w-96 rounded-lg border bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">이미지 크기 설정</h3>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                이미지 미리보기
              </label>
              <div className="rounded-lg border bg-gray-50 p-2">
                <img
                  src={pendingImageData?.url}
                  alt={pendingImageData?.name}
                  className="h-auto max-w-full"
                />
              </div>
            </div>
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  너비 (px)
                </label>
                <input
                  type="number"
                  value={imageSize.width}
                  onChange={(e) =>
                    setImageSize((prev) => ({ ...prev, width: e.target.value }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  min="1"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  높이 (px)
                </label>
                <input
                  type="number"
                  value={imageSize.height}
                  onChange={(e) =>
                    setImageSize((prev) => ({
                      ...prev,
                      height: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  min="1"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowImageSizeModal(false);
                  setPendingImageData(null);
                }}
                className="flex-1 rounded-md bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300"
              >
                취소
              </button>
              <button
                onClick={insertImageWithSize}
                className="flex-1 rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                설정
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
