import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import KakaoMap from '@/components/kakaoMap/kakaoMap';
import type { DetailMissionProps } from '@/services/campaigns/detail/detailType';
import {
  MapPin,
  SquarePlay,
  Type,
  Image,
  Phone,
  Link,
  Star,
} from 'lucide-react';

export default function CampaignDetailMission({
  campaignData,
}: DetailMissionProps) {
  return (
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
              <div className="flex flex-wrap gap-2">
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
  );
}
