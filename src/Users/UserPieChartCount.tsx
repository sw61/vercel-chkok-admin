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
  totalUsers: number; // 등록된 전체 사용자 수
  clientCount: number; // Client 권한 가진 사용자 수
  userCount: number; // USER 권한 가진 사용자 수
  activeUsers: number; // 활성화 상태인 사용자 수
  inactiveUsers: number; // 비활성화 상태인 사용자 수
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
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function UserPieChartCount() {
  const [userStatus, setUserStatus] = useState<Status | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getUserStatus = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInterceptor.get(`/users/stats`);
      const userStatus = response.data.data;
      setUserStatus(userStatus);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUserStatus();
  }, []);
  if (isLoading) {
    return <PieChartSkeleton />;
  }
  const chartData = [
    {
      status: "client",
      visitors: userStatus?.clientCount,
      fill: "oklch(79.5% 0.184 86.047)",
    },
    {
      status: "userCount",
      visitors: userStatus?.userCount,
      fill: "oklch(72.3% 0.219 149.579)",
    },
  ];
  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    client: {
      label: "클라이언트",
      color: "var(--chart-2)",
    },
    userCount: {
      label: "일반 사용자",
      color: "var(--chart-3)",
    },
  } satisfies ChartConfig;

  return (
    <>
      <Card className="flex flex-col pb-0">
        <CardHeader className="items-center pb-0">
          <CardTitle>사용자 권한 통계</CardTitle>
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
