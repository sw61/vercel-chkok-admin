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
import { useQuery } from '@tanstack/react-query';
import { getUsersStatus } from '@/services/users/chart/chartApi';

interface Status {
  totalUsers: number; // 등록된 전체 사용자 수
  clientCount: number; // Client 권한 가진 사용자 수
  userCount: number; // USER 권한 가진 사용자 수
  activeUsers: number; // 활성화 상태인 사용자 수
  inactiveUsers: number; // 비활성화 상태인 사용자 수
}

export function UserPieChartActive() {
  const {
    data: usersStatus,
    isPending,
    error,
  } = useQuery<Status>({
    queryKey: ['usersChart'],
    queryFn: getUsersStatus,
  });

  if (isPending) {
    return <PieChartSkeleton />;
  }
  const chartData = [
    {
      status: 'active',
      visitors: usersStatus?.activeUsers,
      fill: '#2388FF',
    },
    {
      status: 'inactive',
      visitors: usersStatus?.inactiveUsers,
      fill: '#FB2C36',
    },
  ];
  const chartConfig = {
    visitors: {
      label: 'Visitors',
    },
    active: {
      label: '활성화 계정',
      color: 'var(--chart-4)',
    },
    inactive: {
      label: '비활성화 계정',
      color: 'var(--chart-5)',
    },
  } satisfies ChartConfig;

  return (
    <>
      <Card className="flex flex-col pb-0">
        <CardHeader className="items-center pb-0">
          <CardTitle className="ck-body-1-bold">사용자 계정 통계</CardTitle>
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
    </>
  );
}
