import axiosInterceptor from "@/lib/axios-interceptors";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { toast } from "react-toastify";

interface Campaign {
  id: number;
  title: string;
  campaignType: string;
  thumbnailUrl: string;
  productShortInfo: string;
  maxApplicants: number;
  recruitmentStartDate: number;
  recruitmentEndDate: string;
  reviewDeadlineDate: string;
  approvalStatus: string;
  approvalComment: string;
  approvalDate: string;
  selectionDate: string;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: number;
    nickname: string;
    email: string;
    role: string;
    accountType: string;
  };
  company: {
    id: number;
    companyName: string;
    contactPerson: string;
    phoneNumber: string;
    businessRegistrationNumber: string;
  };
}

interface CampaignInfo {
  key: string;
  label: string;
  value: string | number | undefined;
}

export default function CampaignDetail() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const [campaignData, setCampaignData] = useState<Campaign | null>(null);

  const CampaignInfo = (): CampaignInfo[] => [
    { key: "id", label: "ID", value: campaignData?.id ?? "정보 없음" },
    {
      key: "title",
      label: "캠페인 이름",
      value: campaignData?.title ?? "정보 없음",
    },
    {
      key: "productShortInfo",
      label: "상품 간단 정보",
      value: campaignData?.productShortInfo ?? "정보 없음",
    },
    {
      key: "thumbnailUrl",
      label: "썸네일 주소",
      value: campaignData?.thumbnailUrl ?? "정보 없음",
    },
    {
      key: "campaignType",
      label: "캠페인 유형",
      value: campaignData?.campaignType ?? "정보 없음",
    },

    {
      key: "maxApplicants",
      label: "최대 지원자 수",
      value: campaignData?.maxApplicants ?? "정보 없음",
    },
    {
      key: "recruitmentStartDate",
      label: "신청 시작일",
      value: campaignData?.recruitmentStartDate ?? "정보 없음",
    },
    {
      key: "recruitmentEndDate",
      label: "신청 종료일",
      value: campaignData?.recruitmentEndDate ?? "정보 없음",
    },
    {
      key: "approvalStatus",
      label: "처리 상태",
      value: campaignData?.approvalStatus ?? "정보 없음",
    },
    {
      key: "approvalComment",
      label: "처리 코멘트",
      value: campaignData?.approvalComment ?? "정보 없음",
    },
    {
      key: "approvalDate",
      label: "처리일",
      value: campaignData?.approvalDate ? campaignData.approvalDate.split("T")[0] : "정보 없음",
    },
    {
      key: "createdAt",
      label: "생성일",
      value: campaignData?.createdAt ? campaignData.createdAt.split("T")[0] : "정보 없음",
    },
    {
      key: "reviewDeadlineDate",
      label: "리뷰 마감일",
      value: campaignData?.reviewDeadlineDate ?? "정보 없음",
    },
    {
      key: "selectionDate",
      label: "선택일",
      value: campaignData?.selectionDate ?? "정보 없음",
    },
  ];
  const CreatorInfo = (): CampaignInfo[] => [
    {
      key: "creatorId",
      label: "ID",
      value: campaignData?.creator.id ?? "정보 없음",
    },
    {
      key: "creatorNickname",
      label: "이름",
      value: campaignData?.creator.nickname ?? "정보 없음",
    },
    {
      key: "creatorEmail",
      label: "이메일",
      value: campaignData?.creator.email ?? "정보 없음",
    },
    {
      key: "creatorRole",
      label: "계정 권한",
      value: campaignData?.creator.role ?? "정보 없음",
    },
    {
      key: "creatorType",
      label: "계정 타입",
      value: campaignData?.creator.accountType ?? "정보 없음",
    },
  ];
  const CompanyInfo = (): CampaignInfo[] => [
    {
      key: "companyId",
      label: "ID",
      value: campaignData?.company.id ?? "정보 없음",
    },
    {
      key: "companyName",
      label: "회사 이름",
      value: campaignData?.company.companyName ?? "정보 없음",
    },

    {
      key: "contactPerson",
      label: "연락처 이름",
      value: campaignData?.company.contactPerson ?? "정보 없음",
    },
    {
      key: "phoneNumber",
      label: "연락처 번호",
      value: campaignData?.company.phoneNumber ?? "정보 없음",
    },
    {
      key: "businessRegistrationNumber",
      label: "사업자 등록 번호",
      value: campaignData?.company.businessRegistrationNumber ?? "정보 없음",
    },
  ];

  const CampaignInfoComponent = ({
    label,
    value,
    fieldKey,
  }: {
    label: string;
    value: string | number | undefined;
    fieldKey: string;
  }) => {
    const isUrlField = fieldKey === "thumbnailUrl";
    const isValidUrl = typeof value === "string" && value !== "정보 없음";
    return (
      <CardContent className="flex flex-col gap-2">
        <p className="ck-body-2-bold">{label}</p>
        <div className="px-3 py-2 ck-body-2 bg-transparent border border-ck-gray-300 rounded-md px-3 py-2">
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

  // 캠페인 상세 정보 조회
  const getCampaignDetail = async (id: string) => {
    try {
      const response = await axiosInterceptor.get(`/campaigns/${id}`);
      const campaignData = response.data.data;
      setCampaignData(campaignData);
      console.log(campaignData);
    } catch (error) {
      toast.error(`${error}`);
      console.log(error);
    }
  };

  // 캠페인 승인 처리
  const approveCampaign = async (id: number) => {
    if (window.confirm("캠페인을 승인하시겠습니까?")) {
      try {
        const response = await axiosInterceptor.put(`/campaigns/${id}/approval`, {
          approvalStatus: "APPROVED",
          comment: "모든 조건을 만족하여 승인합니다.",
        });
        const updatedData = response.data.data;
        setCampaignData((prev) => ({ ...prev, ...updatedData }));
        toast.success("캠페인이 승인되었습니다.");
        console.log(response);
      } catch (error) {
        toast.error(`${error}`);
        console.log(error);
      }
    }
  };

  // 캠페인 거절 처리
  const rejectCampaign = async (id: number) => {
    if (window.confirm("이 캠페인을 거절하시겠습니까?")) {
      try {
        const response = await axiosInterceptor.put(`/campaigns/${id}/approval`, {
          approvalStatus: "REJECTED",
          comment: "조건을 만족하지 못하여 거절되었습니다.",
        });
        const updatedData = response.data.data;
        setCampaignData((prev) => ({ ...prev, ...updatedData }));
        toast.success("캠페인이 거절되었습니다.");
        console.log(response);
      } catch (error) {
        toast.error(`${error}`);
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (campaignId) {
      getCampaignDetail(campaignId);
    }
  }, [campaignId]);

  if (!campaignData) {
    return (
      <div className="flex justify-center items-center h-64">
        <PulseLoader />
      </div>
    );
  }

  return (
    <div className="grid grid-row gap-6">
      {/* 캠페인 상세 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <div className="ck-sub-title-1 flex items-center">캠페인 정보</div>
            {campaignData.approvalStatus === "PENDING" && (
              <div className="flex gap-4">
                <Button
                  className="cursor-pointer ck-body-1 hover:bg-ck-blue-500 hover:text-white"
                  onClick={() => approveCampaign(campaignData.id)}
                  variant="outline"
                >
                  승인
                </Button>
                <Button
                  className="cursor-pointer ck-body-1 hover:bg-ck-red-500 hover:text-white"
                  onClick={() => rejectCampaign(campaignData.id)}
                  variant="outline"
                >
                  거절
                </Button>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        {CampaignInfo().map((item) => (
          <CampaignInfoComponent key={item.key} label={item.label} value={item.value} fieldKey={item.key} />
        ))}
      </Card>

      {/* 크리에이터 정보 */}
      {campaignData.creator && (
        <Card>
          <CardHeader>
            <CardTitle className="ck-sub-title-1 flex items-center">크리에이터 정보</CardTitle>
          </CardHeader>
          {CreatorInfo().map((item) => (
            <CampaignInfoComponent key={item.key} label={item.label} value={item.value} fieldKey={item.key} />
          ))}
        </Card>
      )}

      {/* 회사 정보 */}
      {campaignData.company && (
        <Card>
          <CardHeader>
            <CardTitle className="ck-sub-title-1">회사 정보</CardTitle>
          </CardHeader>
          {CompanyInfo().map((item) => (
            <CampaignInfoComponent key={item.key} label={item.label} value={item.value} fieldKey={item.key} />
          ))}
        </Card>
      )}
    </div>
  );
}
