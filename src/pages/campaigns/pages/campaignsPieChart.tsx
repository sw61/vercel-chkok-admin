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
import { useSuspenseQuery } from '@tanstack/react-query';
import { getCampaignStatus } from '@/services/campaigns/chart/chartApi';
import { Suspense } from 'react';

interface Status {
  totalCampaigns: number;
  pendingCampaigns: number;
  approvedCampaigns: number;
  rejectedCampaigns: number;
  expiredCampaigns: number;
}

export default function CamapaignsPieChart() {
  const { data: campaignStatusData } = useSuspenseQuery<Status>({
    queryKey: ['campaignStatus'],
    queryFn: getCampaignStatus,
  });

  const chartData = [
    {
      status: 'approved',
      visitors: campaignStatusData?.approvedCampaigns,
      fill: '#2388FF',
    },
    {
      status: 'rejected',
      visitors: campaignStatusData?.rejectedCampaigns,
      fill: '#FB2C36',
    },
    {
      status: 'pending',
      visitors: campaignStatusData?.pendingCampaigns,
      fill: '#FBC02D',
    },
    {
      status: 'expired',
      visitors: campaignStatusData?.expiredCampaigns,
      fill: '#FFA2A2',
    },
  ];
  const chartConfig = {
    visitors: {
      label: 'Visitors',
    },
    pending: {
      label: '승인 대기중',
      color: 'var(--chart-1)',
    },
    approved: {
      label: '승인됨',
      color: 'var(--chart-2)',
    },
    rejected: {
      label: '승인 거절',
      color: 'var(--chart-3)',
    },
    expired: {
      label: '종료됨',
      color: 'var(--chart-4)',
    },
  } satisfies ChartConfig;

  return (
    <Suspense fallback={<PieChartSkeleton />}>
      <Card className="mt-4 flex flex-col pb-0">
        <CardHeader className="items-center pb-0">
          <CardTitle className="ck-body-1-bold">캠페인 통계</CardTitle>
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
                className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
              >
                <ChartLegendContent nameKey="status" />
              </ChartLegend>
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </Suspense>
  );
}
