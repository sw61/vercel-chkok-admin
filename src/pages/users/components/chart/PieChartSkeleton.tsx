import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const PieChartSkeleton = () => {
  return (
    <Card className="flex flex-col pb-0">
      <CardHeader className="items-center pb-0">
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="mx-auto flex aspect-square max-h-[300px] items-center justify-center pb-0">
          <div className="space-y-4">
            <Skeleton className="h-48 w-48 rounded-full" />
            <div className="flex justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PieChartSkeleton;
