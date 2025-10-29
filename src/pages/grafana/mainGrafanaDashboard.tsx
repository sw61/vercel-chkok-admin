import { Card } from '@/components/ui/card';

export default function MainGrafanaDashboard() {
  // Grafana의 경로와 모든 쿼리 파라미터를 포함합니다.
  const grafanaPath = `/d/linux-stats/1-linux-stats-with-node-exporter?orgId=1&kiosk=tv&theme=light`;

  // 💡 URL 인코딩을 통해 모든 특수 문자가 안전하게 전달되도록 합니다.
  const proxyUrl = `/api/grafana-proxy${encodeURIComponent(grafanaPath)}`;

  return (
    <Card className="overflow-y-hidden p-0">
      <iframe
        // src는 /api/grafana-proxy?... 형태로 Vercel Function을 가리킵니다.
        src={proxyUrl}
        width="100%"
        height="800px"
        frameBorder="0"
        className="rounded-lg"
      />
    </Card>
  );
}
