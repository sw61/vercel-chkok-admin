import axiosInterceptor from "@/lib/axios-interceptors";
import { useState, useEffect, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import CampaignDetailSkeleton from "@/Skeleton/CampaignDetailSkeleton";

interface Campaign {
  id: number;
  title: string;
  campaignType: string;
  thumbnailUrl: string;
  productShortInfo: string;
  maxApplicants: number;
  recruitmentStartDate: string;
  recruitmentEndDate: string;
  applicationDeadlineDate: string;
  selectionDate: string;
  reviewDeadlineDate: string;
  approvalStatus: string;
  approvalComment: string;
  approvalDate: string;
  creatorRole: string;
  creatorAccountType: string;
  creator: {
    id: number;
    nickname: string;
    email: string;
    role: string;
    accountType: string;
  };
  approver: {
    id: number;
    email: string;
    nickname: string;
  };
  company: {
    id: number;
    companyName: string;
    businessRegistrationNumber: string;
    contactPerson: string;
    phoneNumber: string;
  };
  location: {
    id: number;
    latitude: number;
    longitude: number;
    businessAddress: string;
    businessDetailAddress: string;
    homepage: string;
    contactPhone: string;
    visitAndReservationInfo: string;
    hasCoordinates: boolean;
  };
  missionInfo: {
    id: number;
    titleKeyWords: string;
    bodyKeywords: string;
    numberOfVideo: number;
    numberOfImage: number;
    numberOfText: number;
    isMap: boolean;
    missionGuide: string;
    missionStartDate: string;
    missionDeadlineDate: string;
    createdAt: string;
    updatedAt: string;
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
  const [comment, setComment] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const dataMap: Record<string, string> = {
    USER: "사용자",
    CLIENT: "클라이언트",
    ADMIN: "관리자",
    SOCIAL: "소셜",
  };

  const CampaignInfo = (): CampaignInfo[] => [
    {
      key: "id",
      label: "캠페인 ID",
      value: campaignData?.id ?? "정보 없음",
    },
    {
      key: "campaignType",
      label: "캠페인 유형",
      value: campaignData?.campaignType ?? "정보 없음",
    },
    {
      key: "maxApplicants",
      label: "최대 신청자 수",
      value: campaignData?.maxApplicants
        ? `${campaignData.maxApplicants}명`
        : "정보 없음",
    },
    {
      key: "approvalStatus",
      label: "승인 상태",
      value: campaignData?.approvalStatus ?? "정보 없음",
    },
    {
      key: "recruitmentStartDate",
      label: "모집 시작일",
      value: campaignData?.recruitmentStartDate ?? "정보 없음",
    },
    {
      key: "recruitmentEndDate",
      label: "모집 마감일",
      value: campaignData?.recruitmentEndDate ?? "정보 없음",
    },
    {
      key: "approvalDate",
      label: "승인일",
      value: campaignData?.approvalDate
        ? campaignData.approvalDate.split("T")[0]
        : "정보 없음",
    },
    {
      key: "reviewDeadlineDate",
      label: "리뷰 마감일",
      value: campaignData?.reviewDeadlineDate ?? "정보 없음",
    },
    {
      key: "selectionDate",
      label: "체험단 선정일",
      value: campaignData?.selectionDate ?? "정보 없음",
    },
  ];
  const MissionInfo = (): CampaignInfo[] => [
    {
      key: "id",
      label: "미션 ID",
      value: campaignData?.missionInfo.id ?? "정보 없음",
    },
    {
      key: "titleKeywords",
      label: "제목 키워드",
      value: campaignData?.missionInfo.titleKeyWords ?? "정보 없음",
    },
    {
      key: "bodyKeywords",
      label: "내용 키워드",
      value: campaignData?.missionInfo.bodyKeywords ?? "정보 없음",
    },
    {
      key: "numberOfvideo",
      label: "영상 개수",
      value: campaignData?.missionInfo.numberOfVideo ?? "정보 없음",
    },
    {
      key: "numberOfImage",
      label: "이미지 개수",
      value: campaignData?.missionInfo.numberOfImage ?? "정보 없음",
    },
    {
      key: "numberOfText",
      label: "텍스트 길이",
      value: campaignData?.missionInfo.numberOfText ?? "정보 없음",
    },
    {
      key: "missionGuide",
      label: "미션 가이드",
      value: campaignData?.missionInfo.missionGuide ?? "정보 없음",
    },
    {
      key: "missionStartDate",
      label: "미션 시작일",
      value: campaignData?.missionInfo.missionStartDate ?? "정보 없음",
    },
    {
      key: "missionDeadlineDate",
      label: "미션 가이드",
      value: campaignData?.missionInfo.missionGuide ?? "정보 없음",
    },
    {
      key: "createdAt",
      label: "생성일",
      value: campaignData?.missionInfo.createdAt.split("T")[0] ?? "정보 없음",
    },
    {
      key: "updatedAt",
      label: "업데이트일",
      value: campaignData?.missionInfo.updatedAt.split("T")[0] ?? "정보 없음",
    },
  ];
  // 캠페인 상세 내용 조회
  const getCampaignDetail = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInterceptor.get(`/campaigns/${id}`);
      const campaignData = response.data.data;
      const mappedData = {
        ...campaignData,
        creatorRole:
          dataMap[campaignData.creator.role] || campaignData.creator.role,
        creatorAccountType:
          dataMap[campaignData.creator.accountType] || campaignData.accountType,
      };
      setCampaignData(mappedData);
      console.log(mappedData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  // 캠페인 삭제
  const deleteCampaign = async (id: number) => {
    if (window.confirm("캠페인을 삭제하시겠습니까?")) {
      try {
        const response = await axiosInterceptor.delete(`/campaigns/${id}`);
        navigate("/campaigns");
        toast.success("캠페인이 삭제되었습니다.");
        console.log(response);
      } catch (error) {
        toast.error("캠페인 삭제 중 오류가 발생했습니다.");
      }
    }
  };
  // 캠페인 승인
  const approveCampaign = async (id: number) => {
    if (window.confirm("캠페인을 승인하시겠습니까?")) {
      try {
        const response = await axiosInterceptor.put(
          `/campaigns/${id}/approval`,
          {
            approvalStatus: "APPROVED",
            comment: comment ?? "모든 조건을 만족하여 승인합니다.",
          },
        );
        const updatedData = response.data.data;
        setCampaignData((prev) => ({ ...prev, ...updatedData }));
        toast.success("캠페인이 승인되었습니다.");
      } catch (error) {
        toast.error(`${error}`);
      }
    }
  };
  // 캠페인 거절
  const rejectCampaign = async (id: number) => {
    if (window.confirm("캠페인을 거절하시겠습니까?")) {
      try {
        const response = await axiosInterceptor.put(
          `/campaigns/${id}/approval`,
          {
            approvalStatus: "REJECTED",
            comment: comment ?? "조건을 만족하지 못하여 거절되었습니다.",
          },
        );
        const updatedData = response.data.data;
        setCampaignData((prev) => ({ ...prev, ...updatedData }));
        toast.success("캠페인이 거절되었습니다.");
      } catch (error) {
        toast.error(`${error}`);
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  useEffect(() => {
    if (campaignId) {
      getCampaignDetail(campaignId);
    }
  }, [campaignId]);
  // 스켈레톤 ui
  if (isLoading) {
    return <CampaignDetailSkeleton />;
  }
  if (!campaignData) {
    return <p>데이터가 없습니다.</p>;
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">{campaignData.title}</h2>
        <div className="px-4">
          <div className="flex gap-2">
            {campaignData.approvalStatus === "대기중" && (
              <>
                <Button
                  className="ck-body-1 hover:bg-ck-blue-500 cursor-pointer hover:text-white"
                  onClick={() => approveCampaign(campaignData.id)}
                  variant="outline"
                >
                  승인
                </Button>
                <Button
                  className="ck-body-1 hover:bg-ck-red-500 cursor-pointer hover:text-white"
                  onClick={() => rejectCampaign(campaignData.id)}
                  variant="outline"
                >
                  거절
                </Button>
              </>
            )}
            <Button
              className="flex items-center border text-sm hover:bg-red-500 hover:text-white"
              onClick={() => deleteCampaign(campaignData.id)}
              variant="outline"
            >
              삭제
            </Button>
          </div>
        </div>
      </div>
      <img
        src={campaignData.thumbnailUrl}
        className="max-h-[400px] object-contain"
      ></img>
      <div className="grid grid-cols-2 gap-6 pt-6">
        <Card>
          <CardContent className="pt-2">
            <div className="flex justify-between pb-4">
              <div className="flex items-center gap-4">
                <div>
                  <p className="ck-body-1-bold">{campaignData.title}</p>
                  <p className="ck-caption-1">
                    간단 소개 : {campaignData.productShortInfo || "No Info"}
                  </p>
                </div>
              </div>
            </div>
            <div className="mb-6 grid grid-cols-3 gap-6">
              {CampaignInfo().map((item) => (
                <div key={item.key}>
                  <p className="ck-caption-1 text-ck-gray-600">{item.label}</p>
                  <p className="ck-body-2">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mb-4 flex flex-col gap-2">
              <p className="ck-caption-1 text-ck-gray-600">승인 코멘트</p>
              {campaignData.approvalStatus === "대기중" ? (
                <Input
                  id="comment"
                  name="comment"
                  value={comment}
                  onChange={handleInputChange}
                  placeholder="승인 코멘트를 입력해주세요."
                />
              ) : (
                <p className="ck-body-2">{campaignData.approvalComment}</p>
              )}
            </div>

            <div className="flex flex-col gap-4">
              {campaignData.approver && (
                <div className="flex flex-col">
                  <div className="flex flex-col">
                    <div className="ck-body-2 flex">
                      <div className="ck-caption-1 text-ck-gray-600 flex w-[85px] items-center border-r pr-2">
                        캠페인 승인인
                      </div>
                      <div className="flex items-center gap-3 pl-3">
                        <div className="flex flex-col">
                          <span className="ck-body-2-bold flex gap-2">
                            {campaignData.approver?.nickname}
                          </span>
                          <span className="ck-caption-2 text-ck-gray-600">
                            {campaignData.approver?.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {campaignData.creator && (
                <div className="flex flex-col gap-1">
                  <div className="flex flex-col">
                    <div className="ck-body-2 flex gap-2">
                      <div className="ck-caption-1 text-ck-gray-600 flex w-[85px] items-center border-r pr-2">
                        캠페인 생성인
                      </div>
                      <div className="flex items-center gap-3 pl-3">
                        <div className="flex flex-col">
                          <span className="ck-body-2-bold flex gap-2">
                            {campaignData.creator.nickname}
                            <Badge>{campaignData.creatorRole}</Badge>
                          </span>
                          <span className="ck-caption-2 text-ck-gray-600">
                            {campaignData.creator.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {campaignData.company && (
                <div className="flex flex-col gap-1">
                  <div className="flex flex-col">
                    <div className="ck-body-2 flex gap-2">
                      <div className="ck-caption-1 text-ck-gray-600 flex w-[85px] items-center border-r pr-2">
                        회사 연락처
                      </div>
                      <div>
                        <div className="ck-body-2 flex gap-2">
                          <span>{campaignData.company.companyName}</span>|
                          <span>{campaignData.creator.email}</span>
                        </div>
                        <div className="ck-body-2 flex gap-2">
                          <span>{campaignData.company.contactPerson}</span>|
                          <span>{campaignData.company.phoneNumber}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
