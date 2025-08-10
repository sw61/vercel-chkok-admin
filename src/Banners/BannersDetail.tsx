import axiosInterceptor from "@/lib/axios-interceptors";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Delete } from "lucide-react";
import { toast } from "react-toastify";

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

interface BannerInfo {
  key: string;
  label: string;
  value: string | number | undefined;
}

export default function BannersDetail() {
  const { bannerId } = useParams<{ bannerId: string }>();
  const navigate = useNavigate();
  const [bannerData, setBannerData] = useState<BannerData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editBannerData, setEditBannerData] = useState({
    title: "",
    bannerUrl: "",
    redirectUrl: "",
    description: "",
    position: "",
    displayOrder: "",
  });

  // 배너 정보 표시
  const BannerInfo = (): BannerInfo[] => [
    { key: "id", label: "ID", value: bannerData?.id },
    { key: "displayOrder", label: "배너 순서 번호", value: bannerData?.displayOrder },
    {
      key: "title",
      label: "배너 이름",
      value: bannerData?.title,
    },
    {
      key: "position",
      label: "배너 위치",
      value: bannerData?.position,
    },
    {
      key: "description",
      label: "설명",
      value: bannerData?.description,
    },
    {
      key: "createdAt",
      label: "생성일",
      value: bannerData?.createdAt.split("T")[0],
    },
    {
      key: "updatedAt",
      label: "업데이트일",
      value: bannerData?.updatedAt.split("T")[0],
    },
    {
      key: "bannerUrl",
      label: "배너 URL",
      value: bannerData?.bannerUrl,
    },
    {
      key: "redirectUrl",
      label: "Redirect URL",
      value: bannerData?.redirectUrl,
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
        displayOrder: data.displayOrder || "",
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
        displayOrder: editBannerData.displayOrder,
      });
      console.log("배너 수정 성공:", response);
      toast.success("배너가 성공적으로 수정되었습니다.");

      await getBannerDetail(bannerId!);
    } catch (error) {
      console.error("배너 수정 중 오류 발생:", error);
      toast.error("배너 수정에 실패했습니다.");
    } finally {
      setIsEditing(false);
    }
  };

  // 배너 삭제
  const deleteBanners = async (id: number) => {
    if (window.confirm("배너를 삭제하시겠습니까?"))
      try {
        const response = await axiosInterceptor.delete(`/api/banners/${id}`);
        console.log("배너 삭제 성공:", response);
        toast.success("배너가 성공적으로 삭제되었습니다.");
        navigate("/banners");
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
        <p className="ck-body-2-bold">{label}</p>
        <div className="px-3 py-2 ck-body-2 bg-transparent border border-ck-gray-300 rounded-md">
          {isUrlField && isValidUrl ? (
            <a href={value as string} target="_blank" rel="noopener noreferrer" className="hover:underline ck-body-1">
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
          <CardTitle className="flex justify-between">
            {isEditing ? (
              <>
                <div className="ck-title flex items-center">배너 수정</div>
                <div className="flex gap-4 ">
                  <Button
                    onClick={() => editBanners(bannerData.id)}
                    className="cursor-pointer ck-body-1 hover:bg-ck-blue-500 hover:text-white"
                    variant="outline"
                  >
                    저장
                  </Button>
                  <Button
                    onClick={toggleEditMode}
                    className="cursor-pointer ck-body-1 hover:bg-ck-gray-600 hover:text-white"
                    variant="outline"
                  >
                    취소
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="ck-title flex items-center">배너 정보</div>
                <div className="flex gap-4">
                  <Button
                    onClick={toggleEditMode}
                    className="cursor-pointer ck-body-1 hover:bg-ck-blue-500 hover:text-white"
                    variant="outline"
                  >
                    <Pencil />
                    수정
                  </Button>
                  <Button
                    onClick={() => deleteBanners(bannerData.id)}
                    className="cursor-pointer ck-body-1 hover:bg-ck-red-500 hover:text-white"
                    variant="outline"
                  >
                    <Delete />
                    삭제
                  </Button>
                </div>
              </>
            )}
          </CardTitle>
        </CardHeader>
        {isEditing ? (
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="ck-body-2-bold">배너 이름</p>
              <Input
                id="title"
                name="title"
                value={editBannerData.title}
                onChange={handleInputChange}
                placeholder="배너 이름을 입력하세요"
                className="w-full px-3 py-2 ck-body-2 bg-transparent border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="ck-body-2-bold">배너 URL</p>
              <Input
                id="bannerUrl"
                name="bannerUrl"
                value={editBannerData.bannerUrl}
                onChange={handleInputChange}
                placeholder="배너 URL을 입력하세요"
                className="w-full px-3 py-2 ck-body-2 bg-transparent border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="ck-body-2-bold">Redirect URL</p>
              <Input
                id="redirectUrl"
                name="redirectUrl"
                value={editBannerData.redirectUrl}
                onChange={handleInputChange}
                placeholder="Redirect URL을 입력하세요"
                className="w-full px-3 py-2 ck-body-2 bg-transparent border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="ck-body-2-bold">설명</p>
              <Input
                id="description"
                name="description"
                value={editBannerData.description}
                onChange={handleInputChange}
                placeholder="설명을 입력하세요"
                className="w-full px-3 py-2 ck-body-2 bg-transparent border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="ck-body-2-bold">배너 위치</p>
              <Input
                id="position"
                name="position"
                value={editBannerData.position}
                onChange={handleInputChange}
                placeholder="배너 위치를 입력하세요"
                className="w-full px-3 py-2 ck-body-2 bg-transparent border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="ck-body-2-bold">배너 순서</p>
              <Input
                id="displayOrder"
                name="displayOrder"
                value={editBannerData.displayOrder}
                onChange={handleInputChange}
                placeholder="배너 순서 번호를 입력하세요"
                className="w-full px-3 py-2 ck-body-2 bg-transparent border border-gray-300 rounded-md"
              />
            </div>
          </CardContent>
        ) : (
          BannerInfo().map((item) => (
            <BannerInfoComponent key={item.key} label={item.label} value={item.value} fieldKey={item.key} />
          ))
        )}
      </Card>
    </div>
  );
}
