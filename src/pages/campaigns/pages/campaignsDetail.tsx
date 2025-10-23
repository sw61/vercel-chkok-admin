import { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import CampaignDetailSkeleton from '@/pages/campaigns/components/detail/detailSkeleton';
import ApplicantsDataTable from '../components/applicants/applicantsDataTable';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getCampaignDetail } from '@/services/campaigns/detail/detailApi';
import type { Campaign } from '@/services/campaigns/detail/detailType';
import CampaignDetailMission from '../components/detail/detailMission';
import CampaignDetailContent from '../components/detail/detailContent';
import CampaignDetailHeader from '../components/detail/detailHeader';

export default function CampaignsDetail() {
  const { campaignId } = useParams<{ campaignId: string }>();

  // 캠페인 상세 정보 조회
  const { data: campaignData } = useSuspenseQuery<Campaign>({
    queryKey: ['campaignDetail', campaignId],
    queryFn: () => getCampaignDetail(campaignId!),
  });

  if (!campaignData) {
    return <p>데이터가 없습니다.</p>;
  }
  if (campaignData) {
    console.log('Fetched data:', campaignData);
  }

  return (
    <Suspense fallback={<CampaignDetailSkeleton />}>
      <div className="px-6 py-4">
        {/* 캠페인 상세 헤더 */}
        <CampaignDetailHeader
          campaignData={campaignData}
          campaignId={campaignId!}
        />
        {/* 상세 정보 부분 */}
        <div className="grid grid-cols-2 items-start gap-6 pt-6">
          <div>
            <CampaignDetailContent campaignData={campaignData} />
          </div>

          {/* 미션 정보 */}
          {campaignData.missionInfo && (
            <div>
              <CampaignDetailMission campaignData={campaignData} />
            </div>
          )}
        </div>
        {/* 캠페인 신청자 목록 컴포넌트 */}
        <ApplicantsDataTable />
      </div>
    </Suspense>
  );
}
