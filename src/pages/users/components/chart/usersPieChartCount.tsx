import { Pie, PieChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import PieChartSkeleton from '@/pages/users/components/chart/PieChartSkeleton';
import { getUsersStatus } from '@/services/users/chart/chartApi';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense } from 'react';

interface Status {
  totalUsers: number; // 등록된 전체 사용자 수
  clientCount: number; // Client 권한 가진 사용자 수
  userCount: number; // USER 권한 가진 사용자 수
  activeUsers: number; // 활성화 상태인 사용자 수
  inactiveUsers: number; // 비활성화 상태인 사용자 수
}

export function UserPieChartCount() {
  const { data: usersStatusData } = useSuspenseQuery<Status>({
    queryKey: ['usersStatus'],
    queryFn: getUsersStatus,
  });

  const chartData = [
    {
      status: 'userCount',
      visitors: usersStatusData?.userCount,
      fill: '#2388FF',
    },
    {
      status: 'client',
      visitors: usersStatusData?.clientCount,
      fill: 'oklch(79.5% 0.184 86.047)',
    },
  ];
  const chartConfig = {
    visitors: {
      label: 'Visitors',
    },
    userCount: {
      label: '일반 사용자',
      color: 'var(--chart-3)',
    },
    client: {
      label: '클라이언트',
      color: 'var(--chart-2)',
    },
  } satisfies ChartConfig;

  return (
    <Suspense fallback={<PieChartSkeleton />}>
      <Card className="flex flex-col pb-0">
        <CardHeader className="items-center pb-0">
          <CardTitle className="ck-body-1-bold">사용자 권한 통계</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[300px] pb-0"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie data={chartData} dataKey="visitors" label nameKey="status" />
              <ChartLegend
                content={<ChartLegendContent nameKey="status" />}
                className="-translate-y-2 flex-wrap gap-2 pt-5 *:justify-center"
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </Suspense>
  );
}
