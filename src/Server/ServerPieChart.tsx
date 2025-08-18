import axios from "axios";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pie, PieChart } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

export function ServerPieChart() {
  const [serverData, setServerData] = useState();
  const getServerChartData = async () => {
    const response = await axios.get(
      "http://jenkins.chkok.kr:8000/api/monitor?format=json&key=A2F1BFBCF4F802DBA645B5076ACAE2D1FD3EF404CF0DC3F988B93C47239C00B167F4B6F0274AF4E6D4B954CE020B71F99E1264FFB7EE1AD58E3108DE83BBADD0",
    );

    console.log(response);
  };
  console.log(serverData);
  useEffect(() => {
    getServerChartData();
  }, []);

  const chartData = [
    {
      status: "active",
      visitors: serverData,
      fill: "#2388FF",
    },
    {
      status: "inactive",
      visitors: serverData,
      fill: "#FB2C36",
    },
  ];
  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    active: {
      label: "활성화 계정",
      color: "var(--chart-4)",
    },
    inactive: {
      label: "비활성화 계정",
      color: "var(--chart-5)",
    },
  } satisfies ChartConfig;
  return (
    <>
      <div onClick={() => getServerChartData()}>서버 차트</div>
      <div>{serverData}</div>
      <Card className="flex flex-col pb-0">
        <CardHeader className="items-center pb-0">
          <CardTitle>서버 통계</CardTitle>
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
