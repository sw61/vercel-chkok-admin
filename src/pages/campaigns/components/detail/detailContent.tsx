import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CustomBadge } from '@/hooks/useBadge';
import type { DetailContentProps } from '@/services/campaigns/detail/detailType';
import { House, Package } from 'lucide-react';

export default function CampaignDetailContent({
  campaignData,
}: DetailContentProps) {
  return (
    <Card className="">
      <CardContent>
        <div className="mb-4 flex gap-2">
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

        <div className="flex flex-col gap-4">
          <div className="flex gap-6">
            <div className="ck-body-2 text-ck-gray-700 flex flex-col gap-1 font-semibold">
              <p>모집 기간</p>
              <p>리뷰 마감일</p>
              <p>체험단 선정일</p>
              <p>최대 신청자 수</p>
              <p>생성일</p>
              {campaignData.approvalDate && <p>승인일</p>}
            </div>
            <div className="ck-body-2 flex flex-col gap-1">
              <p>
                {campaignData.recruitmentEndDate ? (
                  <>
                    {campaignData.recruitmentStartDate} ~{' '}
                    {campaignData.recruitmentEndDate}
                  </>
                ) : (
                  '상시 모집'
                )}
              </p>
              <p>{campaignData.reviewDeadlineDate ?? '상시 모집'}</p>{' '}
              <p>{campaignData.selectionDate ?? '상시 모집'}</p>
              <p>
                {campaignData?.maxApplicants
                  ? `${campaignData.maxApplicants}명`
                  : '상시 모집'}
              </p>
              <p>{campaignData.createdAt.split('T')[0]}</p>
              {campaignData.approvalDate && (
                <p>{campaignData.approvalDate.split('T')[0]}</p>
              )}
            </div>
          </div>
          {/* 간단 소개 */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-2">
              <p className="ck-body-2 text-ck-gray-700 font-semibold">
                간단 소개
              </p>
              <p className="ck-body-2">
                {campaignData.productShortInfo || '간단 소개 정보 없음'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-2">
              <p className="ck-body-2 text-ck-gray-700 font-semibold">
                선정 기준
              </p>
              <p className="ck-body-2">
                {campaignData.selectionCriteria || '간단 소개 정보 없음'}
              </p>
            </div>
          </div>
          {/* 승인 코멘트 */}
          {campaignData.approvalStatus === '대기중' ? (
            <></>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="ck-body-2 text-ck-gray-700 font-semibold">
                승인 코멘트
              </p>
              <p className="ck-body-2">{campaignData.approvalComment}</p>
            </div>
          )}

          {/* 캠페인 승인인 */}
          <div className="flex flex-col gap-4">
            {campaignData.approver && (
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-2">
                  <p className="ck-body-2 text-ck-gray-700 font-semibold">
                    캠페인 승인인
                  </p>
                  <p className="ck-body-2">
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
                  <p className="ck-body-2-bold text-ck-gray-700">
                    캠페인 생성인
                  </p>
                  <p className="ck-body-2">
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
    </Card>
  );
}
