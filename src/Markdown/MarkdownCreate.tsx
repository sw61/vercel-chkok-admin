import { use, useState } from "react";
import MDEditor, {
  commands,
  type ICommand,
  type TextState,
} from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import { toast } from "react-toastify";
import axiosInterceptor from "@/lib/axios-interceptors";
import axios from "axios";
import rehypeRaw from "rehype-raw";
import ReactMarkdown from "react-markdown";
import { renderToStaticMarkup } from "react-dom/server";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

// 이미지 크기 설정을 위한 인터페이스
interface ImageSize {
  width: string;
  height: string;
}

export default function MarkdownCreate() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string | undefined>("");
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
  const navigate = useNavigate();

  const createMarkdown = async () => {
    if (!title) {
      toast.error("제목을 입력해주세요.");
      return;
    }
    if (!content) {
      toast.error("내용을 입력해주세요.");
      return;
    }

    // HTML 생성
    const markdownComponent = (
      <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
    );
    const html = renderToStaticMarkup(markdownComponent);

    try {
      console.log("전송 데이터:", { title, content: html });
      const response = await axiosInterceptor.post("/api/admin/markdowns", {
        title,
        content: html,
      });
      console.log("API 응답:", response);
      toast.success("문서가 생성되었습니다.");
      navigate("/documents");
    } catch (error) {
      console.error("문서 생성 오류:", error);
      toast.error("문서 생성에 실패했습니다.");
    }
  };

  // 파일을 직접 받아서 S3 업로드 처리하는 함수
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
      console.log("Presigned URL 응답:", response);
      const presignedUrl = response.data.data.presignedUrl.split("?")[0];
      setPresignedUrl(presignedUrl);

      const contentType = file.type || "image/jpeg";
      await axios.put(presignedUrl, file, {
        headers: {
          "Content-Type": contentType,
        },
      });
      return presignedUrl;
    } catch (error: any) {
      toast.error("이미지 업로드에 실패했습니다.");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // 이미지 크기 설정 모달을 열고 이미지 데이터를 저장
  const openImageSizeModal = (url: string, name: string) => {
    setPendingImageData({ url, name });
    setShowImageSizeModal(true);
  };

  // 이미지 크기 설정 완료 후 마크다운에 삽입
  const insertImageWithSize = () => {
    if (!pendingImageData || !editorApi) return;

    const { url, name } = pendingImageData;
    const { width, height } = imageSize;

    // HTML img 태그를 사용하여 크기 지정
    const markdownImage = `<img src="${url}" alt="${name}" width="${width}" height="${height}" />`;
    editorApi.replaceSelection(markdownImage);

    // 모달 닫기 및 상태 초기화
    setShowImageSizeModal(false);
    toast.success("이미지가 삽입 되었습니다.");
    setPendingImageData(null);
    setImageSize({ width: "300", height: "200" });
  };

  // 커스텀 이미지 업로드 커맨드
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
      // 에디터 API 저장
      setEditorApi(api);

      // 파일 선택 input 생성
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async () => {
        if (input.files && input.files[0]) {
          const file = input.files[0];

          // imageFile 상태에 파일 설정
          setImageFile(file);

          // 파일을 직접 처리하여 S3 업로드
          const url = await uploadImageFile(file);

          // 이미지 크기 설정 모달 열기
          openImageSizeModal(url, file.name);
        }
      };
      input.click();
    },
  };

  return (
    <Card>
      <div className="flex flex-col items-center justify-start p-6">
        <div className="w-full max-w-full" data-color-mode="light">
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              제목
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(() => e.target.value)}
              placeholder="제목을 입력하세요"
              className="w-full"
            />
          </div>
          <MDEditor
            value={content}
            onChange={setContent}
            height={700}
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
              imageUploadCommand, // 커스텀 이미지 추가 버튼
              commands.divider,
              commands.unorderedListCommand,
              commands.orderedListCommand,
              commands.checkedListCommand,
              commands.divider,
              commands.help,
            ]}
          />
        </div>

        {/* 이미지 크기 설정 모달 */}
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
                      setImageSize((prev) => ({
                        ...prev,
                        width: e.target.value,
                      }))
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
      <div className="flex justify-end pr-6 pb-6">
        <Button
          onClick={createMarkdown}
          className="hover:bg-ck-blue-500 px-4 py-2 hover:text-white"
          variant="outline"
        >
          생성
        </Button>
      </div>
    </Card>
  );
}
