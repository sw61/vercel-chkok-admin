import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MarkdownDetailSkeleton() {
  return (
    <div className="flex w-full flex-col items-center justify-start p-6">
      <Card className="w-full px-6 py-4">
        {/* 카드 헤더: 제목과 버튼들 */}
        <div className="flex items-center justify-between px-6">
          <CardTitle className="ck-title">
            <Skeleton className="h-8 w-40" />
          </CardTitle>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>

        {/* 카드 콘텐츠: 작성자, 생성일, 수정일, 조회수 */}
        <CardContent className="ck-body-2 flex justify-end gap-6">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </CardContent>

        {/* 카드 콘텐츠: 제목 입력 필드 */}
        <CardContent>
          <div className="mb-4">
            <Skeleton className="mb-2 h-5 w-16" /> {/* 제목 라벨 */}
            <Skeleton className="h-10 w-full" /> {/* 제목 입력 필드 */}
          </div>

          {/* 마크다운 에디터 영역 */}
          <div className="mb-4">
            <Skeleton className="mb-2 h-5 w-16" /> {/* 내용 라벨 */}
            <Skeleton className="h-[500px] w-full" /> {/* 마크다운 에디터 */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
