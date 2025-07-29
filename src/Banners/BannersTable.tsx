import axiosInterceptor from "@/lib/axios-interceptors";
import { useState, useEffect } from "react";
import axios from "axios";

interface PresignedUrlType {
  fileExtension: string;
}

export default function BannersTable() {
  const [bannerData, setBannerData] = useState<any[]>([]); // bannerData 타입 지정
  const [file, setFile] = useState<File | null>(null); // 파일 상태 추가
  const [presignedUrl, setPresignedUrl] = useState<string | null>(null); // Presigned URL 상태 추가

  // PresignedUrl 발급
  const postPresignedUrl = async (fileExtension: string): Promise<string> => {
    try {
      const response = await axiosInterceptor.post(
        "/api/images/banners/presigned-url",
        { fileExtension }
      );
      console.log("Presigned URL 응답:", response.data);
      return response.data.url; // 응답에서 URL 추출 (Swagger 스펙에 따라 수정)
    } catch (error) {
      console.error("Presigned URL 발급 오류:", error);
      throw error;
    }
  };

  // 파일 선택 핸들러
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  // Presigned URL 발급 및 업로드 테스트
  const handlePresignedUrlTest = async () => {
    if (!file) {
      alert("파일을 선택하세요.");
      return;
    }

    try {
      const fileExtension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const url = await postPresignedUrl(fileExtension);
      setPresignedUrl(url);
    } catch (error) {
      console.error("테스트 실패:", error);
      alert("Presigned URL 테스트 실패");
    }
  };

  // 배너 이미지 목록 조회
  const getBannersTable = async () => {
    try {
      const response = await axiosInterceptor.get("/api/banners");
      const data = response.data.data;
      setBannerData(data);
      console.log("배너 목록:", data);
    } catch (error) {
      console.error("배너 목록 조회 오류:", error);
      alert("배너 목록 조회 실패");
    }
  };

  // 배너 이미지 생성
  const createBanner = async () => {
    try {
      const response = await axiosInterceptor.post("/api/banners");
      const data = response.data.data;
      console.log("배너 생성:", data);
    } catch (error) {
      console.error("배너 생성 오류:", error);
      alert("배너 생성 실패");
    }
  };

  // 배너 이미지 수정
  const editBanner = async (id: number) => {
    try {
      const response = await axiosInterceptor.put(`/api/banners/${id}`);
      const data = response.data.data;
      console.log("배너 수정:", data);
    } catch (error) {
      console.error("배너 수정 오류:", error);
    }
  };

  // 배너 이미지 삭제
  const deleteBanner = async (id: number) => {
    try {
      const response = await axiosInterceptor.delete(`/api/banners/${id}`);
      const data = response.data.data;
      console.log("배너 삭제:", data);
    } catch (error) {
      console.error("배너 삭제 오류:", error);
    }
  };

  useEffect(() => {
    getBannersTable();
  }, []);

  return (
    <>
      <div>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button onClick={handlePresignedUrlTest} disabled={!file}>
          Presigned URL 발급 및 업로드 테스트
        </button>
      </div>
      <div onClick={getBannersTable}>목록 조회 버튼</div>
      <div onClick={createBanner}>배너 이미지 생성 버튼</div>
      {/* <div onClick={() => editBanner(id)}>배너 이미지 수정 버튼</div> */}
      {/* <div onClick={() => deleteBanner(id)}>배너 이미지 삭제 버튼</div> */}
    </>
  );
}
