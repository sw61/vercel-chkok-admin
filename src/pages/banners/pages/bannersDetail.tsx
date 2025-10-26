import { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getBannersDetail } from '@/services/banners/detail/detailApi';
import { useAlertDialog } from '@/components/alertDialog/useAlertDialog';
import { useDeleteBannerMutation } from '@/services/banners/detail/detailMutation';
import { BannerDetailEditSheet } from '../components/detail/bannerEditSheet';
import BannerDetailSkeleton from '@/pages/banners/components/detail/bannersDetailSkeleton';

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

export default function BannersDetail() {
  const { bannerId } = useParams<{ bannerId: string }>();
  const { data: bannerData } = useSuspenseQuery<BannerData>({
    queryKey: ['bannerDetail', bannerId],
    queryFn: () => getBannersDetail(bannerId!),
  });

  const { mutate: deleteMutation } = useDeleteBannerMutation();
  const { AlertDialogComponent: DeleteAlertDialog } = useAlertDialog({
    trigger: <Button variant="outline">삭제</Button>,
    title: '항목을 삭제하시겠습니까?',
    description: '이 작업은 되돌릴 수 없습니다.',
    onAlert: () => deleteMutation(bannerId!),
  });

  if (!bannerData) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div>데이터가 없습니다.</div>
      </div>
    );
  }

  return (
    <Suspense fallback={<BannerDetailSkeleton />}>
      <div className="grid-row grid px-6 py-2">
        <div className="mb-4">
          <ChevronLeft
            onClick={() => window.history.back()}
            className="cursor-pointer"
          />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <div className="ck-title flex items-center">배너 정보</div>
              <div className="flex gap-4">
                <DeleteAlertDialog />
                {/* 배너 수정 Sheet 컴포넌트*/}
                <BannerDetailEditSheet />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="ck-sub-title-1">{bannerData.title}</div>
            <img
              src={bannerData.bannerUrl}
              className="aspect-video w-[500px]"
            ></img>
            <div className="flex gap-4">
              <div className="ck-body-2 flex min-w-[100px] flex-col gap-4">
                <div>ID</div>
                <div>배너 위치</div>
                <div>생성일</div>
                <div>업데이트일</div>
                <div>설명</div>
                <div>리다이렉트 주소</div>
                <div>배너 주소</div>
              </div>
              <div className="ck-body-2 flex flex-col gap-4">
                <div>{bannerData.id}</div>
                <div>{bannerData.position}</div>
                <div>{bannerData.createdAt.split('T')[0]}</div>
                <div>{bannerData.updatedAt.split('T')[0]}</div>
                <div>{bannerData.description}</div>
                <a
                  href={bannerData.redirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {bannerData.redirectUrl}
                </a>
                <a
                  href={bannerData.bannerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {bannerData.bannerUrl}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Suspense>
  );
}
