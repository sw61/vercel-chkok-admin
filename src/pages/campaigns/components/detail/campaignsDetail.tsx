import { Suspense, useState, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import CampaignDetailSkeleton from '@/pages/campaigns/components/detail/detailSkeleton';
import {
  ChevronLeft,
  House,
  Image,
  Link,
  MapPin,
  Package,
  Phone,
  SquarePlay,
  Star,
  Type,
} from 'lucide-react';
import KakaoMap from '@/pages/kakaoMap/kakaoMap';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CustomBadge } from '@/hooks/useBadge';
import ApplicantsDataTable from '../applicants/applicantsDataTable';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {
  approveCampaigns,
  deleteCampaigns,
  getCampaignDetail,
  rejectCampaigns,
} from '@/services/campaigns/detail/detailApi';
import { useAlertDialog } from '@/components/alertDialog/useAlertDialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
  category: {
    type: string;
    name: string;
  };
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

export default function CampaignsDetail() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const [comment, setComment] = useState<string>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: campaignData } = useSuspenseQuery({
    queryKey: ['campaignDetail', campaignId],
    queryFn: () => getCampaignDetail(campaignId!),
  });

  const { mutate: deleteMutation } = useMutation({
    mutationFn: () => deleteCampaigns(campaignData.id),
    onSuccess: () => {
      navigate('/campaigns');
      toast.success('캠페인이 삭제되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['campaignTable', campaignId],
      });
    },
    onError: () => {
      toast.error('캠페인 삭제를 실패했습니다.');
    },
  });
  const { mutate: approveMutation } = useMutation({
    mutationFn: () => approveCampaigns(campaignData.id, comment!),
    onSuccess: () => {
      toast.success('캠페인이 승인되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['campaignDetail', campaignId],
      });
    },
    onError: () => {
      toast.error('캠페인 승인을 실패했습니다');
    },
  });
  const { mutate: rejectMutation } = useMutation({
    mutationFn: () => rejectCampaigns(campaignData.id, comment!),
    onSuccess: () => {
      toast.success('캠페인이 거절되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['campaignDetail', campaignId],
      });
    },
    onError: () => {
      toast.error('캠페인 거절을 실패했습니다');
    },
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  if (!campaignData) {
    return <p>데이터가 없습니다.</p>;
  }

  // Alert Component
  const { AlertDialogComponent: ApproveAlertDialog } = useAlertDialog({
    trigger: <Button variant="outline">승인</Button>,
    title: '캠페인을 승인하시겠습니까?',
    description: '이 작업은 되돌릴 수 없습니다.',
    onAlert: approveMutation,
  });
  const { AlertDialogComponent: RejectAlertDialog } = useAlertDialog({
    trigger: <Button variant="outline">거절</Button>,
    title: '캠페인을 거절하시겠습니까?',
    description: '이 작업은 되돌릴 수 없습니다.',
    onAlert: rejectMutation,
  });
  const { AlertDialogComponent: DeleteAlertDialog } = useAlertDialog({
    trigger: <Button variant="outline">삭제</Button>,
    title: '캠페인을 삭제하시겠습니까?',
    description: '이 작업은 되돌릴 수 없습니다.',
    onAlert: () => deleteMutation,
  });

  return (
    <Suspense fallback={<CampaignDetailSkeleton />}>
      <div className="min-w-[810px] px-6 py-4">
        <div>
          <ChevronLeft
            onClick={() => navigate('/campaigns')}
            className="cursor-pointer"
          />
        </div>
        <div className="my-4 flex items-center justify-between">
          <div className="ck-title">{campaignData.title}</div>
          <div className="px-4">
            <div className="flex gap-2">
              {campaignData.approvalStatus === '대기중' && (
                <>
                  <RejectAlertDialog />
                  <ApproveAlertDialog />
                </>
              )}
              <DeleteAlertDialog />
            </div>
          </div>
        </div>
        <img
          src={campaignData.thumbnailUrl}
          className="max-h-[400px] rounded-md object-contain"
        ></img>
        {/* 상세 정보 부분 */}
        <div className="grid grid-cols-2 items-start gap-6 pt-6">
          <Card>
            <CardContent className="min-w-[450px]">
              <div className="mb-2 flex gap-2">
                {campaignData.category.type === '방문' ? (
                  <div className="ck-caption-1 flex items-center gap-2 rounded-md border px-2 py-1">
                    <div>
                      <House size={16} />
                    </div>
                    <div>방문형</div>
                  </div>
                ) : (
                  <div className="ck-caption-1 flex items-center gap-2 rounded-md border px-2 py-1">
                    <div>
                      <Package size={16} />
                    </div>
                    <div>배송형</div>
                  </div>
                )}
                <Badge variant="type">{campaignData.category.name}</Badge>
                <CustomBadge variant={campaignData.campaignType} />
                <CustomBadge variant={campaignData.approvalStatus} />
              </div>
              <p className="ck-sub-title-1 mb-4">{campaignData.title}</p>
              <div className="mb-6 grid grid-cols-3 gap-6">
                <div>
                  <p className="ck-body-2-bold">캠페인 ID</p>
                  <p className="ck-body-2 text-ck-gray-700">
                    {campaignData.id}
                  </p>
                </div>
                <div>
                  <p className="ck-body-2-bold">최대 신청자 수</p>
                  <p className="ck-body-2 text-ck-gray-700">
                    {campaignData?.maxApplicants
                      ? `${campaignData.maxApplicants}명`
                      : '정보 없음'}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex gap-6">
                  <div className="ck-body-2-bold flex flex-col gap-1">
                    <p>모집 기간</p>
                    <p>리뷰 마감일</p>
                    <p>체험단 선정일</p>
                    <p>생성일</p>
                    {campaignData.approvalDate && <p>승인일</p>}
                  </div>
                  <div className="ck-body-2 flex flex-col gap-1">
                    <p>
                      {campaignData.recruitmentStartDate} ~{' '}
                      {campaignData.recruitmentEndDate}
                    </p>
                    <p>{campaignData.reviewDeadlineDate ?? '상시 모집'}</p>{' '}
                    <p>{campaignData.selectionDate ?? '상시 모집'}</p>
                    <p>{campaignData.createdAt.split('T')[0]}</p>
                    {campaignData.approvalDate && (
                      <p>{campaignData.approvalDate.split('T')[0]}</p>
                    )}
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
                          <div className="ck-body-2 text-ck-gray-700">
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
                      <div>
                        <Type />
                      </div>
                      <div className="ck-caption-2">
                        {campaignData.missionInfo.numberOfText}자↑
                      </div>
                    </div>
                    <div className="grid w-14 place-items-center gap-2">
                      <div>
                        <Image />
                      </div>
                      <div className="ck-caption-2">
                        {campaignData.missionInfo.numberOfImage}장↑
                      </div>
                    </div>
                    <div className="grid w-14 place-items-center gap-2">
                      <div>
                        <SquarePlay />
                      </div>
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
                          (keyword: string) => (
                            <Badge key={keyword} variant="blue">
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
                            (keyword: string) => (
                              <Badge key={keyword} variant="blue">
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
                        <div>
                          <MapPin size={16} />
                        </div>
                        <p className="ck-body-2">
                          {campaignData.location.businessAddress}
                          {'  '}
                          {campaignData.location.businessDetailAddress}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div>
                          <Phone size={16} />
                        </div>
                        <p className="ck-body-2">
                          {campaignData.location.contactPhone}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div>
                          <Link size={16} />
                        </div>
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
                        <div>
                          <Star size={16} />
                        </div>
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
        <ApplicantsDataTable />
      </div>
    </Suspense>
  );
}
