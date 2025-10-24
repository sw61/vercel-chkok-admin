import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getUsersStatus } from '@/services/users/chart/chartApi';
import { Suspense } from 'react';
import PieChartSkeleton from './PieChartSkeleton';

interface Status {
  totalUsers: number; // 등록된 전체 사용자 수
  clientCount: number; // Client 권한 가진 사용자 수
  userCount: number; // USER 권한 가진 사용자 수
  activeUsers: number; // 활성화 상태인 사용자 수
  inactiveUsers: number; // 비활성화 상태인 사용자 수
}

export default function UsersBarChart() {
  const { data: usersStatusData } = useSuspenseQuery<Status>({
    queryKey: ['usersStatus'],
    queryFn: getUsersStatus,
  });
  const chartData = [
    { role: '일반 사용자', count: usersStatusData.userCount },
    { role: '클라이언트', count: usersStatusData.clientCount },
  ];

  const chartConfig = {
    count: {
      label: '사용자 수',
      color: 'var(--chart-1)',
    },
  } satisfies ChartConfig;

  return (
    <Suspense fallback={<PieChartSkeleton />}>
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle className="ck-body-1-bold">사용자 권한 통계</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 30,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="role"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="count" fill="#2388FF" radius={8}>
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </Suspense>
  );
}
