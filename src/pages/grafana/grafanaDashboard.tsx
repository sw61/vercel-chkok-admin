import { Card } from '@/components/ui/card';

export default function GrafanaDashboard() {
  // 요청하려는 Grafana의 실제 경로 (쿼리 파라미터 포함)
  const grafanaPath = `/grafana/d/rYdddlPWk/node-exporter-full?orgId=1&kiosk=tv&theme=light`;

  // 💡 수정: 경로를 URL 인코딩하여 프록시의 'path' 쿼리 파라미터로 전달
  const proxyUrl = `/api/grafanaProxy?path=${encodeURIComponent(grafanaPath)}`;

  return (
    <Card className="overflow-y-hidden p-0">
      <iframe
        // 💡 프록시 URL 사용
        src={proxyUrl}
        width="100%"
        height="800px"
        frameBorder="0"
        className="rounded-lg"
      />
    </Card>
  );
}
