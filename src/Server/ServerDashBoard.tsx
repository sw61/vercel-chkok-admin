import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle2, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

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

function StatusIndicator({
  label,
  ok,
  okLabel = "정상",
  failLabel = "실패",
  tooltip,
}: {
  label: string;
  ok: boolean;
  okLabel?: string;
  failLabel?: string;
  tooltip?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-2">
          {ok ? (
            <CheckCircle2 className="size-4 text-green-500" />
          ) : (
            <XCircle className="size-4 text-red-500" />
          )}
          <span>
            {label} : {ok ? okLabel : failLabel}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        {tooltip || (ok ? "정상 상태" : "문제 감지")}
      </TooltipContent>
    </Tooltip>
  );
}

// 스켈레톤 로딩 컴포넌트
function ServerDashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* 차트 섹션 스켈레톤 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 상태 모니터링 섹션 스켈레톤 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function ServerDashBoard() {
  const [serverData, setServerData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getServerData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiResponse>(
          "http://jenkins.chkok.kr:8000/api/monitor?format=json&key=A2F1BFBCF4F802DBA645B5076ACAE2D1FD3EF404CF0DC3F988B93C47239C00B167F4B6F0274AF4E6D4B954CE020B71F99E1264FFB7EE1AD58E3108DE83BBADD0",
        );
        const data = response.data;
        setServerData(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getServerData();
    const interval = setInterval(getServerData, 300000); // 5분 주기
    return () => clearInterval(interval);
  }, []);

  if (loading) return <ServerDashboardSkeleton />;

  if (!serverData)
    return (
      <Alert>
        <AlertTitle>데이터 없음</AlertTitle>
        <AlertDescription>데이터를 불러올 수 없습니다.</AlertDescription>
      </Alert>
    );

  // CPUUtilization 및 CPUCreditUsage 데이터 통합
  const cpuData = [
    {
      name: "CPU 사용률",
      Average: serverData.Metrics.CPUUtilization.Average,
      Maximum: serverData.Metrics.CPUUtilization.Maximum,
    },
    {
      name: "CPU 크레딧 사용량",
      Average: serverData.Metrics.CPUCreditUsage.Average * 100,
      Maximum: serverData.Metrics.CPUCreditUsage.Maximum * 100,
    },
  ];

  // NetworkIn/Out 데이터
  const networkData = [
    {
      name: "수신 트래픽",
      Average: serverData.Metrics.NetworkIn.Average,
      Maximum: serverData.Metrics.NetworkIn.Maximum,
    },
    {
      name: "송신 트래픽",
      Average: serverData.Metrics.NetworkOut.Average,
      Maximum: serverData.Metrics.NetworkOut.Maximum,
    },
  ];

  // NetworkPacketsIn/Out 데이터
  const packetsData = [
    {
      name: "수신 패킷",
      Average: serverData.Metrics.NetworkPacketsIn.Average,
      Maximum: serverData.Metrics.NetworkPacketsIn.Maximum,
    },
    {
      name: "송신 패킷",
      Average: serverData.Metrics.NetworkPacketsOut.Average,
      Maximum: serverData.Metrics.NetworkPacketsOut.Maximum,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* CPUUtilization 및 CPUCreditUsage (BarChart) */}
        <Card>
          <CardHeader>
            <CardTitle className="ck-body-1-bold">CPU 메트릭</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                Average: {
                  label: "평균",
                  color: "#3b82f6",
                },
                Maximum: {
                  label: "최대",
                  color: "#93c5fd",
                },
              }}
            >
              <BarChart data={cpuData}>
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <ChartTooltipContent
                          active={active}
                          payload={payload}
                          labelFormatter={(_, items) =>
                            items?.[0]?.payload?.name
                          }
                          formatter={(value: any, name: any) =>
                            `${name}: ${Number(value).toFixed(1)}%`
                          }
                        />
                      );
                    }
                    return null;
                  }}
                />
                <ChartLegend />
                <Bar dataKey="Average" fill="#86abff" name="평균" />
                <Bar dataKey="Maximum" fill="#2388ff" name="최대" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* NetworkIn/Out (BarChart) */}
        <Card>
          <CardHeader>
            <CardTitle className="ck-body-1-bold">네트워크 트래픽</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                Average: {
                  label: "평균",
                  color: "#3b82f6",
                },
                Maximum: {
                  label: "최대",
                  color: "#93c5fd",
                },
              }}
            >
              <BarChart data={networkData}>
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <ChartTooltipContent
                          active={active}
                          payload={payload}
                          labelFormatter={(_, items) =>
                            items?.[0]?.payload?.name
                          }
                          formatter={(value: any, name: any) =>
                            `${name}: ${Number(value).toFixed(0)} Bytes`
                          }
                        />
                      );
                    }
                    return null;
                  }}
                />
                <ChartLegend />
                <Bar dataKey="Average" fill="#86abff" name="평균" />
                <Bar dataKey="Maximum" fill="#2388ff" name="최대" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* NetworkPacketsIn/Out (BarChart) */}
        <Card>
          <CardHeader>
            <CardTitle className="ck-body-1-bold">네트워크 패킷</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                Average: {
                  label: "평균",
                  color: "#6b7280",
                },
                Maximum: {
                  label: "최대",
                  color: "#9ca3af",
                },
              }}
            >
              <BarChart data={packetsData}>
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <ChartTooltipContent
                          active={active}
                          payload={payload}
                          labelFormatter={(_, items) =>
                            items?.[0]?.payload?.name
                          }
                          formatter={(value: any, name: any) =>
                            `${name}: ${Number(value).toFixed(0)} Packets`
                          }
                        />
                      );
                    }
                    return null;
                  }}
                />
                <ChartLegend />
                <Bar dataKey="Average" fill="#86abff" name="평균" />
                <Bar dataKey="Maximum" fill="#2388ff" name="최대" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* 상태 모니터링 섹션 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* CPU 크레딧 잔액 상태 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="ck-body-1-bold">CPU 크레딧 상태</CardTitle>
          </CardHeader>
          <CardContent className="ck-body-1 pt-0">
            <StatusIndicator
              label="CPU 크레딧 잔액"
              ok={serverData.Metrics.CPUCreditBalance.Average > 0}
              okLabel={`${serverData.Metrics.CPUCreditBalance.Average.toFixed(0)}개 (정상)`}
              failLabel="0 (부족)"
              tooltip="CPU 크레딧 잔액 상태"
            />
          </CardContent>
        </Card>

        {/* 인스턴스 상태 검사 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="ck-body-1-bold">인스턴스 상태</CardTitle>
          </CardHeader>
          <CardContent className="ck-body-1 pt-0">
            <StatusIndicator
              label="인스턴스 상태 검사"
              ok={serverData.Metrics.StatusCheckFailed_Instance.Average === 0}
              tooltip="인스턴스 상태 검사 통과 여부"
            />
          </CardContent>
        </Card>

        {/* 시스템 상태 검사 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="ck-body-1-bold">시스템 상태</CardTitle>
          </CardHeader>
          <CardContent className="ck-body-1 pt-0">
            <StatusIndicator
              label="시스템 상태 검사"
              ok={serverData.Metrics.StatusCheckFailed_System.Average === 0}
              tooltip="시스템 상태 검사 통과 여부"
            />
          </CardContent>
        </Card>

        {/* 메타데이터 토큰 상태 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="ck-body-1-bold">보안 상태</CardTitle>
          </CardHeader>
          <CardContent className="ck-body-1 pt-0">
            <StatusIndicator
              label="메타데이터 토큰"
              ok={serverData.Metrics.MetadataNoToken.Average === 0}
              okLabel="없음 (안전)"
              failLabel="탐지됨"
              tooltip="메타데이터 접근 탐지 여부"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
