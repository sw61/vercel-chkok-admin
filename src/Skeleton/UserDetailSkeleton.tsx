import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const UserDetailSkeleton = () => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="ck-title mb-2">계정 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div>
                  <Skeleton className="mb-2 h-6 w-32" />
                  <Skeleton className="mb-1 h-4 w-40" />
                  <Skeleton className="h-4 w-36" />
                </div>
              </div>

              <div className="flex gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>

            <div className="mb-6 grid grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, index) => (
                <div key={index}>
                  <Skeleton className="mb-2 h-4 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className="h-20 w-full" />
              <div className="flex justify-end">
                <Skeleton className="h-10 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDetailSkeleton;
