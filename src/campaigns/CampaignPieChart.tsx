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
import axiosInterceptor from "@/lib/axios-interceptors";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

export const description = "A pie chart with a label";
interface Status {
  totalCampaigns: number;
  pendingCampaigns: number;
  approvedCampaigns: number;
  rejectedCampaigns: number;
}

export function CamapaignPieChart() {
  const [campaignStatus, setCampaignStatus] = useState<Status | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const getCampaignStatus = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInterceptor.get(`/campaigns/stats`);
      const campaignStatus = response.data.data;
      setCampaignStatus(campaignStatus);
      setIsLoading(false);
      console.log(campaignStatus);
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        switch (axiosError.response.status) {
          case 400:
            toast.error("잘못된 요청입니다. 입력 데이터를 확인해주세요.");
            break;
          case 401:
            toast.error("토큰이 만료되었습니다. 다시 로그인 해주세요");
            navigate("/login");
            break;
          case 403:
            toast.error("접근 권한이 없습니다.");
            break;
          case 404:
            toast.error("요청한 사용자 데이터를 찾을 수 없습니다.");
            break;
          case 500:
            toast.error("서버 오류가 발생했습니다. 나중에 다시 시도해주세요.");
            break;
        }
      }
    }
  };
  useEffect(() => {
    getCampaignStatus();
  }, []);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <PulseLoader />
      </div>
    );
  }
  const chartData = [
    {
      status: "total",
      visitors: campaignStatus?.totalCampaigns,
      fill: "#9c3bf6",
    },
    {
      status: "pending",
      visitors: campaignStatus?.pendingCampaigns,
      fill: "#10B981",
    },
    {
      status: "approved",
      visitors: campaignStatus?.approvedCampaigns,
      fill: "#F59E0B",
    },
    {
      status: "rejected",
      visitors: campaignStatus?.rejectedCampaigns,
      fill: "#3B82F6",
    },
  ];
  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    total: {
      label: "Total",
      color: "var(--chart-1)",
    },
    pending: {
      label: "Pending",
      color: "var(--chart-2)",
    },
    approved: {
      label: "Approved",
      color: "var(--chart-3)",
    },
    rejected: {
      label: "Rejected",
      color: "var(--chart-4)",
    },
  } satisfies ChartConfig;

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>캠페인 통계</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
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
