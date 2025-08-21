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
    const data = response.data;
    setServerData(data);
    console.log(data);
  };

  useEffect(() => {
    getServerChartData();
  }, []);

  return (
    <>
      <div onClick={() => getServerChartData()}>서버 차트</div>
      <div>{serverData}</div>
    </>
  );
}
