import axiosInterceptor from "@/lib/axios-interceptors";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react"; // useRef 추가
import axios from "axios";
import { toast } from "react-toastify";
import BannersTable from "./BannersTable";
import PulseLoader from "react-spinners/PulseLoader";

interface BannerData {
  id: number;
  title: string;
  bannerUrl: string;
  redirectUrl: string;
  description: string;
  position: string;
  createdAt: string;
  updatedAt: string;
  displayOrder: number;
}

export default function BannersTablePage() {
  const [bannerData, setBannerData] = useState<BannerData[]>([]);
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
    const fileExtension = imageFile.name.split(".").pop()?.toLowerCase() || "jpg";

    try {
      const response = await axiosInterceptor.post("/api/images/banners/presigned-url", { fileExtension });
      console.log("Presigned URL 응답:", response);
      const presignedUrl = response.data.data.presignedUrl;
      setPresignedUrl(presignedUrl);

      const contentType = imageFile.type || "image/jpeg";
      const uploadResponse = await axios.put(presignedUrl, imageFile, {
        headers: {
          "Content-Type": contentType,
        },
      });
      await createBanner(presignedUrl);
    } catch (error: any) {
      toast.error("이미지 업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  // 배너 이미지 목록 조회
  const getBannersTable = async () => {
    try {
      const response = await axiosInterceptor.get("/api/banners");
      const data = response.data.data;
      setBannerData(data);
    } catch (error) {
      console.error("배너 목록 조회 중 오류 발생:", error);
    }
  };

  // 배너 이미지 생성
  const createBanner = async (bannerUrl: string) => {
    try {
      const response = await axiosInterceptor.post("/api/banners", {
        bannerUrl,
        redirectUrl: "https://admin.chkok.kr",
      });
      console.log("배너 생성 성공:", response);
      await getBannersTable();
    } catch (error) {
      console.error("배너 이미지 생성 중 오류 발생:", error);
    }
  };

  if (!bannerData) {
    return (
      <div className="flex justify-center items-center h-64">
        <PulseLoader />
      </div>
    );
  }

  useEffect(() => {
    getBannersTable();
  }, []);

  return (
    <>
      <BannersTable bannerData={bannerData} />
      <div className="flex items-center space-x-4 mb-4 pt-2">
        {/* 숨겨진 파일 입력 */}
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
        {/* 파일 선택 버튼 */}
        <Button
          className="ck-body-1 border-1 bg-ck-white text-ck-gray-900 hover:bg-ck-gray-300"
          onClick={handleFileSelect}
        >
          파일 선택
        </Button>

        {/* 선택된 파일 정보 표시 */}
        {imageFile && (
          <div className="text-sm text-gray-700">
            <span className="ck-body-1">선택된 파일 : {imageFile.name}</span>
            <span className="ml-2 ck-body-1">({(imageFile.size / 1024).toFixed(2)} KB)</span>
          </div>
        )}
        {/* 파일 업로드 버튼 */}
        {imageFile && (
          <Button
            onClick={handleUrlUpload}
            disabled={isUploading || !imageFile}
            className="ck-body-1 border-1 bg-ck-white text-ck-gray-900 hover:bg-gray-300"
          >
            {isUploading ? "업로드 중..." : "파일 업로드"}
          </Button>
        )}
      </div>
    </>
  );
}
