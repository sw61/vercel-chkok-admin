import { Label, Pie, PieChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { getUsersStatus } from '@/services/users/chart/chartApi';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import PieChartSkeleton from './PieChartSkeleton';

interface Status {
  totalUsers: number; // 등록된 전체 사용자 수
  clientCount: number; // Client 권한 가진 사용자 수
  userCount: number; // USER 권한 가진 사용자 수
  activeUsers: number; // 활성화 상태인 사용자 수
  inactiveUsers: number; // 비활성화 상태인 사용자 수
}
export default function UsersDonutChart() {
  const { data: usersStatusData } = useSuspenseQuery<Status>({
    queryKey: ['usersStatus'],
    queryFn: getUsersStatus,
  });

  const chartData = [
    {
      status: 'active',
      visitors: usersStatusData.activeUsers,
      fill: '#2388FF',
    },
    {
      status: 'inactive',
      visitors: usersStatusData.inactiveUsers,
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
    <Suspense fallback={<PieChartSkeleton />}>
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle className="ck-body-1-bold">체험콕 사용자 수</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="visitors"
                nameKey="browser"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {usersStatusData?.totalUsers}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            사용자
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
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
