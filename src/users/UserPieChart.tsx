"use client";

import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export const description = "A pie chart with a label";
interface Status {
  userCount: number;
  clientCount: number;
  activeUsers: number;
  inactiveUsers: number;
}

export function UserPieChart() {
  const [userStatus, setUserStatus] = useState<Status | null>(null);
  const navigate = useNavigate();
  const getUserStatus = async () => {
    try {
      const response = await axiosInterceptor.get(`/users/stats`);
      const userStatus = response.data.data;
      setUserStatus(userStatus);
      console.log(userStatus);
    } catch (error) {
      console.log(error);
      navigate("/");
      alert("로그인이 필요합니다.");
    }
  };
  useEffect(() => {
    getUserStatus();
  }, []);
  const chartData = [
    { status: "Total", userCount: userStatus?.userCount, fill: "#3B82F6" },
    {
      status: "Clients",
      userCount: userStatus?.clientCount,
      fill: "#10B981",
    },
    {
      status: "Active",
      userCount: userStatus?.activeUsers,
      fill: "#F59E0B",
    },
    {
      status: "Inactive",
      userCount: userStatus?.inactiveUsers,
      fill: "#EF4444",
    },
  ];
  const chartConfig = {
    value: {
      label: "Value",
    },
    userCount: {
      label: "UserCount",
      color: "#3B82F6",
    },
    ClientUsers: {
      label: "ClientUsers",
      color: "#10B981",
    },
    activeUsers: {
      label: "ActiveUsers",
      color: "#F59E0B",
    },
    inactiveUsers: {
      label: "InActiveUsers",
      color: "#EF4444",
    },
  } satisfies ChartConfig;

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Pie Chart - Label</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={chartData}
                dataKey="userCount"
                label
                nameKey="status"
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
        {/* <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
      </Card>
    </>
  );
}
