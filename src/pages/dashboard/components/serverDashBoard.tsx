'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis } from 'recharts';
import ServerDashboardSkeleton from '@/pages/dashboard/skeleton/serverDashboardSkeleton';
import axios from 'axios';

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
  okLabel = '정상',
  failLabel = '실패',
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
        {tooltip || (ok ? '정상 상태' : '문제 감지')}
      </TooltipContent>
    </Tooltip>
  );
}

export default function ServerDashBoard() {
  const [serverData, setServerData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getServerData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiResponse>('/api/proxy');
        const data = response.data;
        setServerData(data);
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

  if (!serverData || !serverData.Metrics) {
    return (
      <Alert>
        <AlertTitle>데이터 없음</AlertTitle>
        <AlertDescription>
          서버 메트릭 데이터를 불러올 수 없습니다.
        </AlertDescription>
      </Alert>
    );
  }

  const cpuData = [
    {
      name: 'CPU 사용률',
      Average: serverData.Metrics.CPUUtilization?.Average || 0,
      Maximum: serverData.Metrics.CPUUtilization?.Maximum || 0,
    },
    {
      name: 'CPU 크레딧 사용량',
      Average: (serverData.Metrics.CPUCreditUsage?.Average || 0) * 100,
      Maximum: (serverData.Metrics.CPUCreditUsage?.Maximum || 0) * 100,
    },
  ];

  const networkData = [
    {
      name: '수신 트래픽',
      Average: serverData.Metrics.NetworkIn?.Average || 0,
      Maximum: serverData.Metrics.NetworkIn?.Maximum || 0,
    },
    {
      name: '송신 트래픽',
      Average: serverData.Metrics.NetworkOut?.Average || 0,
      Maximum: serverData.Metrics.NetworkOut?.Maximum || 0,
    },
  ];

  const packetsData = [
    {
      name: '수신 패킷',
      Average: serverData.Metrics.NetworkPacketsIn?.Average || 0,
      Maximum: serverData.Metrics.NetworkPacketsIn?.Maximum || 0,
    },
    {
      name: '송신 패킷',
      Average: serverData.Metrics.NetworkPacketsOut?.Average || 0,
      Maximum: serverData.Metrics.NetworkPacketsOut?.Maximum || 0,
    },
  ];

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* 차트 섹션 */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3  md:grid-cols-1">
          {/* CPUUtilization 및 CPUCreditUsage (BarChart) */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="ck-body-1-bold">CPU 메트릭</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64 flex items-center justify-center overflow-hidden">
                <ChartContainer
                  config={{
                    Average: {
                      label: '평균',
                      color: '#3b82f6',
                    },
                    Maximum: {
                      label: '최대',
                      color: '#93c5fd',
                    },
                  }}
                  className="w-full h-full"
                >
                  <BarChart
                    data={cpuData}
                    width={undefined}
                    height={undefined}
                    margin={{ top: 20, right: 30, left: 20, bottom: 0 }}
                  >
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
                    <ChartLegend
                      wrapperStyle={{
                        paddingTop: '10px',
                        textAlign: 'center',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    />
                    <Bar dataKey="Average" fill="#86abff" name="평균" />
                    <Bar dataKey="Maximum" fill="#2388ff" name="최대" />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* NetworkIn/Out (BarChart) */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="ck-body-1-bold">네트워크 트래픽</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64 flex items-center justify-center overflow-hidden">
                <ChartContainer
                  config={{
                    Average: {
                      label: '평균',
                      color: '#3b82f6',
                    },
                    Maximum: {
                      label: '최대',
                      color: '#93c5fd',
                    },
                  }}
                  className="w-full h-full"
                >
                  <BarChart
                    data={networkData}
                    width={undefined}
                    height={undefined}
                    margin={{ top: 20, right: 30, left: 20, bottom: 0 }}
                  >
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
                    <ChartLegend
                      wrapperStyle={{
                        paddingTop: '10px',
                        textAlign: 'center',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    />
                    <Bar dataKey="Average" fill="#86abff" name="평균" />
                    <Bar dataKey="Maximum" fill="#2388ff" name="최대" />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* NetworkPacketsIn/Out (BarChart) */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="ck-body-1-bold">네트워크 패킷</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64 flex items-center justify-center overflow-hidden">
                <ChartContainer
                  config={{
                    Average: {
                      label: '평균',
                      color: '#6b7280',
                    },
                    Maximum: {
                      label: '최대',
                      color: '#9ca3af',
                    },
                  }}
                  className="w-full h-full"
                >
                  <BarChart
                    data={packetsData}
                    width={undefined}
                    height={undefined}
                    margin={{ top: 20, right: 30, left: 20, bottom: 0 }}
                  >
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
                    <ChartLegend
                      wrapperStyle={{
                        paddingTop: '10px',
                        textAlign: 'center',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    />
                    <Bar dataKey="Average" fill="#86abff" name="평균" />
                    <Bar dataKey="Maximum" fill="#2388ff" name="최대" />
                  </BarChart>
                </ChartContainer>
              </div>
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
            <CardContent className="ck-body-2 pt-0">
              <StatusIndicator
                label="CPU 크레딧 잔액"
                ok={(serverData.Metrics.CPUCreditBalance?.Average || 0) > 0}
                okLabel={`${(serverData.Metrics.CPUCreditBalance?.Average || 0).toFixed(0)}개 (정상)`}
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
            <CardContent className="ck-body-2 pt-0">
              <StatusIndicator
                label="인스턴스 상태 검사"
                ok={
                  (serverData.Metrics.StatusCheckFailed_Instance?.Average ||
                    0) === 0
                }
                tooltip="인스턴스 상태 검사 통과 여부"
              />
            </CardContent>
          </Card>

          {/* 시스템 상태 검사 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="ck-body-1-bold">시스템 상태</CardTitle>
            </CardHeader>
            <CardContent className="ck-body-2 pt-0">
              <StatusIndicator
                label="시스템 상태 검사"
                ok={
                  (serverData.Metrics.StatusCheckFailed_System?.Average ||
                    0) === 0
                }
                tooltip="시스템 상태 검사 통과 여부"
              />
            </CardContent>
          </Card>

          {/* 메타데이터 토큰 상태 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="ck-body-1-bold">보안 상태</CardTitle>
            </CardHeader>
            <CardContent className="ck-body-2 pt-0">
              <StatusIndicator
                label="메타데이터 토큰"
                ok={(serverData.Metrics.MetadataNoToken?.Average || 0) === 0}
                okLabel="없음 (안전)"
                failLabel="탐지됨"
                tooltip="메타데이터 접근 탐지 여부"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
