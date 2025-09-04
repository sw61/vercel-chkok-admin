import axiosInterceptor from '@/lib/axios-interceptors';
import { useState, useEffect, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import { Badge } from '@/components/ui/badge';
import CampaignDetailSkeleton from '@/Skeleton/CampaignDetailSkeleton';
import {
  ChevronLeft,
  Image,
  Link,
  MapPin,
  Phone,
  SquarePlay,
  Star,
  Type,
} from 'lucide-react';
import KakaoMap from '@/KakaoMap/KakaoMap';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CustomBadge } from '@/hooks/useBadge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Campaign {
  id: number;
  title: string;
  campaignType: '블로그' | '인스타그램' | '유튜브' | '틱톡';
  thumbnailUrl: string;
  productShortInfo: string;
  maxApplicants: number;
  recruitmentStartDate: string;
  recruitmentEndDate: string;
  applicationDeadlineDate: string;
  selectionDate: string;
  reviewDeadlineDate: string;
  approvalStatus: '승인됨' | '대기중' | '거절됨';
  approvalComment: string;
  approvalDate: string;
  createdAt: string;
  creatorRole: '클라이언트' | '사용자' | '관리자';
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
    titleKeyWords: string[];
    bodyKeywords: string[];
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
    USER: '사용자',
    CLIENT: '클라이언트',
    ADMIN: '관리자',
    SOCIAL: '소셜',
    LOCAL: '로컬',
  };

  const CampaignInfo = (): CampaignInfo[] => [
    {
      key: 'id',
      label: '캠페인 ID',
      value: campaignData?.id ?? '정보 없음',
    },
    {
      key: 'maxApplicants',
      label: '최대 신청자 수',
      value: campaignData?.maxApplicants
        ? `${campaignData.maxApplicants}명`
        : '정보 없음',
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
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  // 캠페인 삭제
  const deleteCampaign = async (id: number) => {
    try {
      const response = await axiosInterceptor.delete(`/campaigns/${id}`);
      navigate('/campaigns');
      toast.success('캠페인이 삭제되었습니다.');
      console.log(response);
    } catch (error) {
      console.log(error);
      toast.error('캠페인 삭제 중 오류가 발생했습니다.');
    }
  };
  // 캠페인 승인
  const approveCampaign = async (id: number) => {
    try {
      const response = await axiosInterceptor.put(`/campaigns/${id}/approval`, {
        approvalStatus: 'APPROVED',
        comment: comment ?? '모든 조건을 만족하여 승인합니다.',
      });
      const updatedData = response.data.data;
      setCampaignData((prev) => ({ ...prev, ...updatedData }));
      toast.success('캠페인이 승인되었습니다.');
    } catch (error) {
      toast.error(`${error}`);
    }
  };
  // 캠페인 거절
  const rejectCampaign = async (id: number) => {
    try {
      const response = await axiosInterceptor.put(`/campaigns/${id}/approval`, {
        approvalStatus: 'REJECTED',
        comment: comment ?? '조건을 만족하지 못하여 거절되었습니다.',
      });
      const updatedData = response.data.data;
      setCampaignData((prev) => ({ ...prev, ...updatedData }));
      toast.success('캠페인이 거절되었습니다.');
    } catch (error) {
      toast.error(`${error}`);
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
    <div className="min-w-[810px] px-6 py-4">
      <div>
        <ChevronLeft
          onClick={() => navigate('/campaigns')}
          className="cursor-pointer"
        />
      </div>
      <div className="my-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">{campaignData.title}</h2>
        <div className="px-4">
          <div className="flex gap-2">
            {campaignData.approvalStatus === '대기중' && (
              <>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">승인</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="w-[350px]">
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        캠페인을 승인하시겠습니까?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        이 작업은 되돌릴 수 없습니다
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => approveCampaign(campaignData.id)}
                      >
                        확인
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">거절</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="w-[350px]">
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        캠페인을 거절하시겠습니까?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        이 작업은 되돌릴 수 없습니다
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => rejectCampaign(campaignData.id)}
                      >
                        확인
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">삭제</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-[350px]">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    캠페인을 삭제하시겠습니까?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    이 작업은 되돌릴 수 없습니다
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteCampaign(campaignData.id)}
                  >
                    확인
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
      <img
        src={campaignData.thumbnailUrl}
        className="max-h-[400px] object-contain"
      ></img>
      {/* 상세 정보 부분 */}
      <div className="grid grid-cols-2 items-start gap-6 pt-6">
        <Card>
          <CardContent className="min-w-[450px]">
            <div className="flex gap-2 mb-2">
              <CustomBadge variant={campaignData.campaignType} />
              <CustomBadge variant={campaignData.approvalStatus} />
            </div>
            <p className="ck-sub-title-1 mb-4">{campaignData.title}</p>
            <div className="mb-6 grid grid-cols-3 gap-6">
              {CampaignInfo().map((item) => (
                <div key={item.key}>
                  <p className="ck-body-2-bold">{item.label}</p>
                  <p className="ck-body-2 text-ck-gray-700">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex gap-6">
                <div className="ck-body-2-bold flex flex-col gap-1">
                  <p>모집 기간</p>
                  <p>리뷰 마감일</p>
                  <p>체험단 선정일</p>
                  <p>생성일</p>
                  <p>승인일</p>
                </div>
                <div className="ck-body-2 flex flex-col gap-1">
                  <p>
                    {campaignData.recruitmentStartDate} ~{' '}
                    {campaignData.recruitmentEndDate}
                  </p>
                  <p>{campaignData.reviewDeadlineDate ?? '상시 모집'}</p>{' '}
                  <p>{campaignData.selectionDate ?? '상시 모집'}</p>
                  <p>{campaignData.createdAt.split('T')[0]}</p>
                  <p>{campaignData.approvalDate.split('T')[0]}</p>
                </div>
              </div>
              {/* 간단 소개 */}
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-2">
                  <p className="ck-body-2-bold">간단 소개</p>
                  <p className="ck-body-2 text-ck-gray-700">
                    {campaignData.productShortInfo || '간단 소개 정보 없음'}
                  </p>
                </div>
              </div>
              {/* 승인 코멘트 */}
              <div className="flex flex-col gap-2">
                <p className="ck-body-2-bold">승인 코멘트</p>
                {campaignData.approvalStatus === '대기중' ? (
                  <Input
                    id="comment"
                    name="comment"
                    value={comment}
                    onChange={handleInputChange}
                    placeholder="승인 코멘트를 입력해주세요."
                  />
                ) : (
                  <p className="ck-body-2 text-ck-gray-700">
                    {campaignData.approvalComment ?? '코멘트가 없습니다.'}
                  </p>
                )}
              </div>
              {/* 캠페인 승인인 */}
              <div className="flex flex-col gap-4">
                {campaignData.approver && (
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-2">
                      <p className="ck-body-2-bold">캠페인 승인인</p>
                      <p className="ck-body-2 text-ck-gray-700">
                        {campaignData.approver.nickname} |&nbsp;
                        {campaignData.approver.email}
                      </p>
                    </div>
                  </div>
                )}
                {/* 캠페인 생성인 */}
                {campaignData.creator && (
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-2">
                      <p className="ck-body-2-bold">캠페인 생성인</p>
                      <p className="ck-body-2 text-ck-gray-700">
                        {campaignData.creator.nickname} |&nbsp;
                        {campaignData.creator.email} &nbsp;
                        <CustomBadge variant={campaignData.creatorRole} />
                      </p>
                    </div>
                  </div>
                )}
                {campaignData.company && (
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-2">
                      <div>
                        <p className="ck-body-2-bold">회사 정보</p>
                        <div className="ck-body-2 text-ck-gray-700 ">
                          <span>
                            {campaignData.company.companyName} |&nbsp;
                            {campaignData.company.contactPerson} |&nbsp;
                            {campaignData.company.phoneNumber}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="ck-body-2-bold">사업자 등록 번호</p>
                        <div className="ck-body-2 text-ck-gray-700">
                          {campaignData.company.businessRegistrationNumber ??
                            '사업자 등록 번호 없음'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          {/* 미션 정보 */}
        </Card>
        {campaignData.missionInfo && (
          <Card className="min-w-[450px]">
            <div className="flex flex-col gap-6">
              <CardContent>
                <p className="ck-title mb-2">미션 정보</p>
                <div className="flex gap-6">
                  <div className="ck-body-2-bold">
                    <p>미션 기간</p>
                    <p>생성일</p>
                    <p>업데이트일</p>
                  </div>
                  <div className="ck-body-2">
                    <div>
                      {campaignData.missionInfo.missionStartDate ||
                      campaignData.missionInfo.missionDeadlineDate ? (
                        <p>
                          {campaignData.missionInfo.missionStartDate} ~{' '}
                          {campaignData.missionInfo.missionDeadlineDate}
                        </p>
                      ) : (
                        <p>상시</p>
                      )}
                    </div>
                    <p>{campaignData.missionInfo.createdAt.split('T')[0]}</p>
                    <p>{campaignData.missionInfo.updatedAt.split('T')[0]}</p>
                  </div>
                </div>
              </CardContent>
              <CardContent>
                <p className="ck-title mb-2">미션 가이드</p>
                <div className="ck-body-1 mb-2 flex items-center gap-4">
                  <div className="grid w-14 place-items-center gap-2">
                    <Type />
                    <div className="ck-caption-2">
                      {campaignData.missionInfo.numberOfText}자↑
                    </div>
                  </div>
                  <div className="grid w-14 place-items-center gap-2">
                    <Image />
                    <div className="ck-caption-2">
                      {campaignData.missionInfo.numberOfImage}장↑
                    </div>
                  </div>
                  <div className="grid w-14 place-items-center gap-2">
                    <SquarePlay />
                    <div className="ck-caption-2">
                      {campaignData.missionInfo.numberOfVideo}개↑
                    </div>
                  </div>
                </div>
                <p className="ck-body-2 mb-4 whitespace-pre-line">
                  {campaignData.missionInfo.missionGuide}
                </p>
                {/* 제목 키워드 */}
                {campaignData.missionInfo.titleKeyWords && (
                  <div className="flex flex-wrap gap-2">
                    <p className="ck-body-2-bold">제목 키워드</p>
                    {Array.isArray(campaignData.missionInfo.titleKeyWords) &&
                      campaignData.missionInfo.titleKeyWords.map(
                        (keyword, index) => (
                          <Badge key={index} variant="blue">
                            #{keyword}
                          </Badge>
                        )
                      )}
                  </div>
                )}
                {/* 내용 키워드 */}
                {campaignData.missionInfo.bodyKeywords && (
                  <div className="flex flex-col gap-2">
                    <p className="ck-body-2-bold">내용 키워드</p>
                    <div className="flex gap-2">
                      {Array.isArray(campaignData.missionInfo.bodyKeywords) &&
                        campaignData.missionInfo.bodyKeywords.map(
                          (keyword, index) => (
                            <Badge key={index} variant="blue">
                              #{keyword}
                            </Badge>
                          )
                        )}
                    </div>
                  </div>
                )}
              </CardContent>
              {campaignData.missionInfo.isMap && (
                <CardContent>
                  <p className="ck-title my-4">위치 정보</p>
                  <KakaoMap
                    latitude={campaignData.location.latitude}
                    longitude={campaignData.location.longitude}
                    hasCoordinates={campaignData.location.hasCoordinates}
                  />
                  <div className="mt-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <p className="ck-body-2">
                        {campaignData.location.businessAddress}
                        {'  '}
                        {campaignData.location.businessDetailAddress}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} />
                      <p className="ck-body-2">
                        {campaignData.location.contactPhone}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link size={16} />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            className="ck-body-2 hover:underline"
                            href={campaignData.location.homepage}
                            target="block"
                          >
                            공식 홈페이지 바로 가기
                          </a>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{campaignData.location.homepage}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star size={16} />
                      <p className="ck-body-2">
                        {campaignData.location.visitAndReservationInfo}
                      </p>
                    </div>
                  </div>
                </CardContent>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
