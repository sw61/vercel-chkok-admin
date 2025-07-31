import axiosInterceptor from "@/lib/axios-interceptors";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import BannersTable from "./BannersTable";
interface BannerData {
  id: number;
  title: string;
  bannerUrl: string;
  redirectUrl: string;
  description: string;
  position: string;
  createdAt: string;
  updatedAt: string;
}

export default function BannersTablePage() {
  const [bannerData, setBannerData] = useState<BannerData[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [presignedUrl, setPresignedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

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
    // 파일 확장자 추출
    const fileExtension =
      imageFile.name.split(".").pop()?.toLowerCase() || "jpg";

    try {
      // Presigned URL 발급
      const response = await axiosInterceptor.post(
        "/api/images/banners/presigned-url",
        { fileExtension }
      );
      console.log("Presigned URL 응답:", response);
      const presignedUrl = response.data.data.presignedUrl;
      setPresignedUrl(presignedUrl);

      // S3에 이미지 업로드 (바이너리 데이터 전송)
      const contentType = imageFile.type || "image/jpeg";
      const uploadResponse = await axios.put(presignedUrl, imageFile, {
        headers: {
          "Content-Type": contentType,
        },
      });
      console.log("업로드 성공:", uploadResponse);

      // 업로드 성공 후 배너 생성
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
  // 배너 이미지 삭제
  const deleteBanner = async (id: number) => {
    try {
      const response = await axiosInterceptor.delete(`/api/banners/${id}`);
      await getBannersTable();
      toast.success("배너 이미지가 삭제되었습니다.");
      console.log(response);
    } catch (error) {
      toast.error("이미지 삭제 중 오류가 발생했습니다.");
      console.log(error);
    }
  };

  useEffect(() => {
    getBannersTable();
  }, []);

  return (
    <>
      <div>
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border-1  border-slate-700 shadow-md rounded-sm  file:bg-black file:text-white file:cursor-pointer file:p-1 file:px-2"
          />
          <Button onClick={handleUrlUpload} disabled={isUploading}>
            {isUploading ? "업로드 중..." : "파일 업로드"}
          </Button>
        </div>
      </div>

      <BannersTable bannerData={bannerData} onDelete={deleteBanner} />
    </>
  );
}
