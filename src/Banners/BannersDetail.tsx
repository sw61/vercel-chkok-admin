import axiosInterceptor from "@/lib/axios-interceptors";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // useNavigate 추가
import PulseLoader from "react-spinners/PulseLoader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Input 컴포넌트 추가

import { Pencil, Delete } from "lucide-react";
import { toast } from "react-toastify"; // toast 추가

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

interface BannerInfo {
  key: string;
  label: string;
  value: string | number | undefined;
}

export default function BannersDetail() {
  const { bannerId } = useParams<{ bannerId: string }>();
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate
  const [bannerData, setBannerData] = useState<BannerData | null>(null);
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태
  const [editBannerData, setEditBannerData] = useState({
    title: "",
    bannerUrl: "",
    redirectUrl: "",
    description: "",
    position: "",
  });

  // 배너 정보 표시
  const BannerInfo = (): BannerInfo[] => [
    { key: "id", label: "ID", value: bannerData?.id ?? "정보 없음" },
    {
      key: "title",
      label: "배너 이름",
      value:
        bannerData?.title || bannerData?.title === ""
          ? "정보 없음"
          : bannerData?.title,
    },
    {
      key: "position",
      label: "배너 위치",
      value:
        bannerData?.position || bannerData?.position === ""
          ? "정보 없음"
          : bannerData?.position,
    },
    {
      key: "bannerUrl",
      label: "배너 URL",
      value:
        bannerData?.bannerUrl || bannerData?.bannerUrl === ""
          ? "정보 없음"
          : bannerData?.bannerUrl,
    },
    {
      key: "redirectUrl",
      label: "Redirect URL",
      value:
        bannerData?.redirectUrl || bannerData?.redirectUrl === ""
          ? "정보 없음"
          : bannerData?.redirectUrl,
    },
    {
      key: "createdAt",
      label: "생성일",
      value: bannerData?.createdAt
        ? bannerData.createdAt.split("T")[0]
        : "정보 없음",
    },
    {
      key: "updatedAt",
      label: "업데이트일",
      value: bannerData?.updatedAt
        ? bannerData.updatedAt.split("T")[0]
        : "정보 없음",
    },
    {
      key: "description",
      label: "설명",
      value:
        bannerData?.description || bannerData?.description === ""
          ? "정보 없음"
          : bannerData?.description,
    },
  ];

  // 배너 상세 정보 조회
  const getBannerDetail = async (id: string) => {
    try {
      const response = await axiosInterceptor.get(`/api/banners/${id}`);
      const data = response.data.data;
      setBannerData(data);
      // 폼 데이터 초기화
      setEditBannerData({
        title: data.title || "",
        bannerUrl: data.bannerUrl || "",
        redirectUrl: data.redirectUrl || "",
        description: data.description || "",
        position: data.position || "",
      });
    } catch (error) {
      console.error("배너 상세 조회 중 오류 발생:", error);
      toast.error("배너 정보를 불러오지 못했습니다.");
    }
  };

  // 배너 수정
  const editBanners = async (id: number) => {
    setIsEditing(true);
    try {
      const response = await axiosInterceptor.put(`/api/banners/${id}`, {
        bannerUrl: editBannerData.bannerUrl,
        redirectUrl: editBannerData.redirectUrl,
        title: editBannerData.title,
        description: editBannerData.description,
        position: editBannerData.position,
      });
      console.log("배너 수정 성공:", response);
      toast.success("배너가 성공적으로 수정되었습니다.");

      await getBannerDetail(bannerId!); // 수정 후 데이터 갱신
    } catch (error) {
      console.error("배너 수정 중 오류 발생:", error);
      toast.error("배너 수정에 실패했습니다.");
    } finally {
      setIsEditing(false); // 수정 모드 종료
    }
  };

  // 배너 삭제
  const deleteBanners = async (id: number) => {
    if (window.confirm("배너를 삭제하시겠습니까?"))
      try {
        const response = await axiosInterceptor.delete(`/api/banners/${id}`);
        console.log("배너 삭제 성공:", response);
        toast.success("배너가 성공적으로 삭제되었습니다.");
        navigate("/banners"); // 삭제 후 목록 페이지로 이동
      } catch (error) {
        console.error("배너 삭제 중 오류 발생:", error);
        toast.error("배너 삭제에 실패했습니다.");
      }
  };

  // 폼 입력 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditBannerData((prev) => ({ ...prev, [name]: value }));
  };

  // 수정 모드 토글
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const BannerInfoComponent = ({
    label,
    value,
    fieldKey,
  }: {
    label: string;
    value: string | number | undefined;
    fieldKey: string;
  }) => {
    const isUrlField = fieldKey === "bannerUrl" || fieldKey === "redirectUrl";
    const isValidUrl = typeof value === "string" && value !== "정보 없음";

    return (
      <CardContent className="flex flex-col gap-2">
        <p className="text-sm">{label}</p>
        <div className="px-3 py-2 text-sm font-normal text-gray-900 bg-transparent border border-gray-300 rounded-md">
          {isUrlField && isValidUrl ? (
            <a
              href={value as string}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {value}
            </a>
          ) : (
            <span>{value}</span>
          )}
        </div>
      </CardContent>
    );
  };

  useEffect(() => {
    if (bannerId) {
      getBannerDetail(bannerId);
    }
  }, [bannerId]);

  if (!bannerData) {
    return (
      <div className="flex justify-center items-center h-64">
        <PulseLoader />
      </div>
    );
  }

  return (
    <div className="grid grid-row gap-10">
      {/* 배너 상세 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between font-bold text-lg">
            <div className="flex items-center">배너 정보</div>
            <div className="flex gap-4">
              {isEditing ? (
                <>
                  <Button
                    onClick={() => editBanners(bannerData.id)}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    저장
                  </Button>
                  <Button
                    onClick={toggleEditMode}
                    className="bg-gray-500 hover:bg-gray-600"
                  >
                    취소
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={toggleEditMode}
                    className="cursor-pointer bg-blue-500 hover:bg-blue-600"
                  >
                    <Pencil />
                    수정
                  </Button>
                  <Button
                    onClick={() => deleteBanners(bannerData.id)}
                    className="cursor-pointer bg-red-500 hover:bg-red-600"
                  >
                    <Delete />
                    삭제
                  </Button>
                </>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        {isEditing ? (
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-sm text-semibold">배너 이름</p>
              <Input
                id="title"
                name="title"
                value={editBannerData.title}
                onChange={handleInputChange}
                placeholder="배너 이름을 입력하세요"
                className="w-full px-3 py-2 text-sm font-normal text-gray-900 bg-transparent border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm text-semibold">배너 URL</p>
              <Input
                id="bannerUrl"
                name="bannerUrl"
                value={editBannerData.bannerUrl}
                onChange={handleInputChange}
                placeholder="배너 URL을 입력하세요"
                className="w-full px-3 py-2 text-sm font-normal text-gray-900 bg-transparent border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm text-semibold">Redirect URL</p>
              <Input
                id="redirectUrl"
                name="redirectUrl"
                value={editBannerData.redirectUrl}
                onChange={handleInputChange}
                placeholder="Redirect URL을 입력하세요"
                className="w-full px-3 py-2 text-sm font-normal text-gray-900 bg-transparent border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm text-semibold">설명</p>
              <Input
                id="description"
                name="description"
                value={editBannerData.description}
                onChange={handleInputChange}
                placeholder="설명을 입력하세요"
                className="w-full px-3 py-2 text-sm font-normal text-gray-900 bg-transparent border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm text-semibold">배너 위치</p>
              <Input
                id="position"
                name="position"
                value={editBannerData.position}
                onChange={handleInputChange}
                placeholder="배너 위치를 입력하세요"
                className="w-full px-3 py-2 text-sm font-normal text-gray-900 bg-transparent border border-gray-300 rounded-md"
              />
            </div>
          </CardContent>
        ) : (
          BannerInfo().map((item) => (
            <BannerInfoComponent
              key={item.key}
              label={item.label}
              value={item.value}
              fieldKey={item.key}
            />
          ))
        )}
      </Card>
    </div>
  );
}
