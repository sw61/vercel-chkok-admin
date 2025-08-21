import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";

// API 응답 타입 정의
interface MetricStats {
  Average: number;
  Maximum: number;
  Minimum: number;
  Sum: number;
  SampleCount: number;
}

interface ApiResponse {
  Metrics: {
    CPUUtilization: MetricStats;
    NetworkIn: MetricStats;
    NetworkOut: MetricStats;
    NetworkPacketsIn: MetricStats;
    NetworkPacketsOut: MetricStats;
    MetadataNoToken: MetricStats;
    CPUCreditUsage: MetricStats;
    CPUCreditBalance: MetricStats;
    StatusCheckFailed_System: MetricStats;
    StatusCheckFailed_Instance: MetricStats;
  };
}

export default function ServerDashBoard() {
  const [serverData, setServerData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getServerData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiResponse>(
          "http://jenkins.chkok.kr:8000/api/monitor?format=json&key=A2F1BFBCF4F802DBA645B5076ACAE2D1FD3EF404CF0DC3F988B93C47239C00B167F4B6F0274AF4E6D4B954CE020B71F99E1264FFB7EE1AD58E3108DE83BBADD0",
        );
        const data = response.data;
        setServerData(data);
        setError(null);
        console.log(data);
      } catch (err) {
        setError("데이터 로딩 실패: " + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    getServerData();
    const interval = setInterval(getServerData, 300000); // 5분 주기
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-center text-xl">로딩 중...</div>;
  if (error)
    return (
      <Alert variant="destructive">
        <AlertTitle>에러</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  if (!serverData)
    return (
      <Alert>
        <AlertTitle>데이터 없음</AlertTitle>
        <AlertDescription>데이터를 불러올 수 없습니다.</AlertDescription>
      </Alert>
    );

  // CPUUtilization 데이터
  const cpuUtilizationData = [
    { name: "CPU 사용률", value: serverData.Metrics.CPUUtilization.Average },
  ];

  // CPUCreditBalance 데이터
  const cpuCreditBalanceData = [
    {
      name: "CPU 크레딧 잔액",
      value: serverData.Metrics.CPUCreditBalance.Average,
    },
  ];

  // CPUCreditUsage 데이터
  const cpuCreditUsageData = [
    {
      name: "CPU 크레딧 사용량",
      value: serverData.Metrics.CPUCreditUsage.Average,
    },
  ];

  // NetworkIn/Out 데이터
  const networkData = [
    {
      name: "NetworkIn",
      Average: serverData.Metrics.NetworkIn.Average,
      Maximum: serverData.Metrics.NetworkIn.Maximum,
    },
    {
      name: "NetworkOut",
      Average: serverData.Metrics.NetworkOut.Average,
      Maximum: serverData.Metrics.NetworkOut.Maximum,
    },
  ];

  // NetworkPacketsIn/Out 데이터
  const packetsData = [
    { name: "PacketsIn", Average: serverData.Metrics.NetworkPacketsIn.Average },
    {
      name: "PacketsOut",
      Average: serverData.Metrics.NetworkPacketsOut.Average,
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-center text-2xl font-bold">
        EC2 인스턴스 대시보드
      </h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* CPUUtilization (RadialBarChart) */}
        <Card>
          <CardHeader>
            <CardTitle>CPU 사용률</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart
                innerRadius="40%"
                outerRadius="80%"
                data={cpuUtilizationData}
                startAngle={180}
                endAngle={0}
              >
                <RadialBar
                  endAngle={15}
                  label={{
                    fill: "#333",
                    position: "insideStart",
                    fontSize: 14,
                  }}
                  background
                  dataKey="value"
                  fill={
                    serverData.Metrics.CPUUtilization.Average > 80
                      ? "#ef4444"
                      : serverData.Metrics.CPUUtilization.Average > 50
                        ? "#f59e0b"
                        : "#10b981"
                  }
                />
                <Tooltip
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* CPUCreditBalance (RadialBarChart) */}
        <Card>
          <CardHeader>
            <CardTitle>CPU 크레딧 잔액</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart
                innerRadius="40%"
                outerRadius="80%"
                data={cpuCreditBalanceData}
                startAngle={180}
                endAngle={0}
              >
                <RadialBar
                  endAngle={15}
                  label={{
                    fill: "#333",
                    position: "insideStart",
                    fontSize: 14,
                  }}
                  background
                  dataKey="value"
                  fill={
                    serverData.Metrics.CPUCreditBalance.Average < 10
                      ? "#ef4444"
                      : "#10b981"
                  }
                />
                <Tooltip
                  formatter={(value: number) => `${value.toFixed(0)} 크레딧`}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* CPUCreditUsage (BarChart) */}
        <Card>
          <CardHeader>
            <CardTitle>CPU 크레딧 사용량</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={cpuCreditUsageData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => `${value.toFixed(3)} 크레딧`}
                />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* NetworkIn/Out (BarChart) */}
        <Card>
          <CardHeader>
            <CardTitle>네트워크 트래픽</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={networkData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => `${value.toFixed(0)} Bytes`}
                />
                <Legend />
                <Bar dataKey="Average" fill="#3b82f6" name="평균" />
                <Bar dataKey="Maximum" fill="#93c5fd" name="최대" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* NetworkPacketsIn/Out (BarChart) */}
        <Card>
          <CardHeader>
            <CardTitle>네트워크 패킷</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={packetsData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => `${value.toFixed(0)} Packets`}
                />
                <Legend />
                <Bar dataKey="Average" fill="#6b7280" name="평균" />
                <Bar
                  dataKey="Average"
                  fill="#9ca3af"
                  name="평균 (PacketsOut)"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* StatusCheckFailed_Instance */}
        <Card>
          <CardHeader>
            <CardTitle>인스턴스 상태 체크</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              variant={
                serverData.Metrics.StatusCheckFailed_Instance.Average === 0
                  ? "default"
                  : "destructive"
              }
              className={
                serverData.Metrics.StatusCheckFailed_Instance.Average === 0
                  ? "bg-green-500"
                  : "bg-red-500"
              }
            >
              {serverData.Metrics.StatusCheckFailed_Instance.Average === 0
                ? "정상"
                : "실패"}
            </Badge>
          </CardContent>
        </Card>

        {/* StatusCheckFailed_System */}
        <Card>
          <CardHeader>
            <CardTitle>시스템 상태 체크</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              variant={
                serverData.Metrics.StatusCheckFailed_System.Average === 0
                  ? "default"
                  : "destructive"
              }
              className={
                serverData.Metrics.StatusCheckFailed_System.Average === 0
                  ? "bg-green-500"
                  : "bg-red-500"
              }
            >
              {serverData.Metrics.StatusCheckFailed_System.Average === 0
                ? "정상"
                : "실패"}
            </Badge>
          </CardContent>
        </Card>

        {/* MetadataNoToken */}
        <Card>
          <CardHeader>
            <CardTitle>메타데이터 토큰</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              variant={
                serverData.Metrics.MetadataNoToken.Average === 0
                  ? "default"
                  : "destructive"
              }
              className={
                serverData.Metrics.MetadataNoToken.Average === 0
                  ? "bg-green-500"
                  : "bg-red-500"
              }
            >
              {serverData.Metrics.MetadataNoToken.Average === 0
                ? "없음 (안전)"
                : "탐지됨"}
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
