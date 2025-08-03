import axiosInterceptor from "@/lib/axios-interceptors";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  const [bannerData, setBannerData] = useState<BannerData | null>(null);

  const BannerInfo = (): BannerInfo[] => [
    { key: "id", label: "ID", value: bannerData?.id ?? "정보 없음" },
    {
      key: "title",
      label: "배너 이름",
      value: bannerData?.title ?? "정보 없음",
    },
    {
      key: "position",
      label: "배너 위치",
      value: bannerData?.position ?? "정보 없음",
    },
    {
      key: "bannerUrl",
      label: "배너 URL",
      value: bannerData?.bannerUrl ?? "정보 없음",
    },
    {
      key: "redirectUrl",
      label: "Redirect URL",
      value: bannerData?.redirectUrl ?? "정보 없음",
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
      value: bannerData?.description ?? "정보 없음",
    },
  ];

  const BannerInfoComponent = ({
    label,
    value,
  }: {
    label: string;
    value: string | number | undefined;
  }) => {
    return (
      <CardContent className="flex flex-col gap-2">
        <p className="text-sm">{label}</p>
        <div className="px-3 py-2 text-sm font-normal text-gray-900 bg-transparent border border-gray-300 rounded-md px-3 py-2">
          {value}
        </div>
      </CardContent>
    );
  };

  // 배너 상세 정보 조회
  const getBannerDetail = async (id: string) => {
    try {
      const response = await axiosInterceptor.get(`/api/banners/${id}`);
      const data = response.data.data;
      setBannerData(data);
    } catch (error) {
      console.error("배너 상세 조회 중 오류 발생:", error);
    }
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
      {/* 배너 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="font-bold text-lg">배너 정보</CardTitle>
        </CardHeader>
        {BannerInfo().map((item) => (
          <BannerInfoComponent
            key={item.key}
            label={item.label}
            value={item.value}
          />
        ))}
      </Card>

      {/* 액션 버튼 */}
      <Card>
        <CardHeader>
          <CardTitle className="font-bold text-lg">배너 관리</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button className="cursor-pointer bg-blue-500 hover:bg-blue-600">
              배너 수정
            </Button>
            <Button className="cursor-pointer bg-red-500 hover:bg-red-600">
              배너 삭제
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
