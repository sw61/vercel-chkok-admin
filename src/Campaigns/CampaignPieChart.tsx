"use client";

import { Pie, PieChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import axiosInterceptor from "@/lib/axios-interceptors";
import { useState, useEffect } from "react";

export const description = "A pie chart with a label";
interface Status {
  totalCampaigns: number;
  pendingCampaigns: number;
  approvedCampaigns: number;
  rejectedCampaigns: number;
  expiredCampaigns: number;
}

// 파이 차트 스켈레톤 컴포넌트
function PieChartSkeleton() {
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
}

export function CamapaignPieChart() {
  const [campaignStatus, setCampaignStatus] = useState<Status | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const getCampaignStatus = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInterceptor.get(`/campaigns/stats`);
      const campaignStatus = response.data.data;
      setCampaignStatus(campaignStatus);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCampaignStatus();
  }, []);
  if (isLoading) {
    return <PieChartSkeleton />;
  }
  const chartData = [
    {
      status: "approved",
      visitors: campaignStatus?.approvedCampaigns,
      fill: "#2388FF",
    },
    {
      status: "rejected",
      visitors: campaignStatus?.rejectedCampaigns,
      fill: "#FB2C36",
    },
    {
      status: "pending",
      visitors: campaignStatus?.pendingCampaigns,
      fill: "#FBC02D",
    },
    {
      status: "expired",
      visitors: campaignStatus?.expiredCampaigns,
      fill: "#FFA2A2",
    },
  ];
  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    pending: {
      label: "승인 대기중",
      color: "var(--chart-1)",
    },
    approved: {
      label: "승인됨",
      color: "var(--chart-2)",
    },
    rejected: {
      label: "승인 거절",
      color: "var(--chart-3)",
    },
    expired: {
      label: "종료됨",
      color: "var(--chart-4)",
    },
  } satisfies ChartConfig;

  return (
    <>
      <Card className="flex flex-col pb-0">
        <CardHeader className="items-center pb-0">
          <CardTitle>캠페인 통계</CardTitle>
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
    </>
  );
}
