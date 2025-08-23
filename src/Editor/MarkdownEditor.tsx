import { useState, useRef } from "react";
import MDEditor, {
  commands,
  type ICommand,
  type TextState,
} from "@uiw/react-md-editor";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-md-editor/markdown.css";
import { toast } from "react-toastify";
import axiosInterceptor from "@/lib/axios-interceptors";
import axios from "axios";
function App() {
  const [value, setValue] = useState<string | undefined>("**Hello Markdown!**");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [presignedUrl, setPresignedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null); // 파일 입력 참조

  // 파일 선택 버튼 클릭 시 파일 입력 창 띄우기
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  // 파일 입력 핸들러
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file && !file.type.startsWith("image/")) {
      toast.error("이미지 파일만 업로드 가능합니다.");
      return;
    }
    setImageFile(file);
  };

  // 이미지 파일로 배너 업로드 처리
  const handleUrlUpload = async () => {
    if (!imageFile) {
      toast.error("이미지 파일을 선택해주세요.");
      return;
    }
    setIsUploading(true);
    const fileExtension =
      imageFile.name.split(".").pop()?.toLowerCase() || "jpg";

    try {
      const response = await axiosInterceptor.post(
        "/api/images/banners/presigned-url",
        { fileExtension },
      );
      console.log("Presigned URL 응답:", response);
      const presignedUrl = response.data.data.presignedUrl;
      setPresignedUrl(presignedUrl);
      const contentType = imageFile.type || "image/jpeg";
      await axios.put(presignedUrl, imageFile, {
        headers: {
          "Content-Type": contentType,
        },
      });
      toast.success("이미지가 업로드 되었습니다.");
    } catch (error: any) {
      toast.error("이미지 업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  // 커스텀 이미지 업로드 커맨드
  const imageUploadCommand: ICommand = {
    name: "imageUpload",
    keyCommand: "imageUpload",
    buttonProps: { "aria-label": "Insert image" },
    icon: <span style={{ padding: "0 6px" }}>🖼️</span>,
    execute: async (state: TextState, api) => {
      // 파일 선택 input 생성
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async () => {
        if (input.files && input.files[0]) {
          const file = input.files[0];

          // AWS S3 업로드
          const url = await uploadToS3(file);

          // 마크다운에 삽입
          const markdownImage = `![${file.name}](${url})`;
          api.replaceSelection(markdownImage);
        }
      };
      input.click();
    },
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-gray-50 p-6">
      <h1 className="mb-4 text-2xl font-bold">
        Markdown Editor with Image Upload
      </h1>

      <div className="w-full max-w-3xl" data-color-mode="light">
        <MDEditor
          value={value}
          onChange={setValue}
          height={500}
          preview="live"
          commands={[
            ...commands.getCommands(), // 👈 기본 툴바 전부 유지
            imageUploadCommand, // 👈 커스텀 이미지 버튼 추가
          ]}
        />
      </div>
    </div>
  );
}

export default App;
