import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';

export default function BannerDetailSkeleton() {
  return (
    <div className="grid-row grid px-6 py-2 min-w-[800px]">
      {/* 뒤로 가기 버튼 */}
      <div className="mb-4">
        <ChevronLeft className="h-6 w-6 text-gray-400" />
      </div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            {/* 제목 */}
            <Skeleton className="h-7 w-32 ck-title" />
            {/* 버튼들 */}
            <div className="flex gap-4">
              <Skeleton className="h-8 w-16 rounded-md" />
              <Skeleton className="h-8 w-16 rounded-md" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* 배너 제목 */}
          <Skeleton className="h-6 w-48 ck-sub-title-1" />
          {/* 배너 이미지 */}
          <Skeleton className="w-[500px] h-[281.25px] rounded-md" />
          {/* 정보 필드 */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-4 ck-body-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-20" />
            </div>
            <div className="flex flex-col gap-4 ck-body-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-64" />
              <Skeleton className="h-5 w-64" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
