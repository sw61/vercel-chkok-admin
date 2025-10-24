import { Card } from '@/components/ui/card';

export default function MainGrafanaDashboard() {
  const dashboardPath = `/d/linux-stats/1-linux-stats-with-node-exporter?orgId=1&kiosk=tv&theme=light`;

  let grafanaBaseUrl = '/grafana';

  // 로컬 개발 환경인지 확인하고 환경 변수가 존재하면 실제 URL 사용
  if (import.meta.env.VITE_GRAFANA_URL && import.meta.env.DEV) {
    grafanaBaseUrl = import.meta.env.VITE_GRAFANA_URL as string;
  }

  const grafanaUrl = `${grafanaBaseUrl}${dashboardPath}`;
  return (
    <Card className="overflow-y-hidden p-0">
      <iframe
        src={grafanaUrl}
        width="100%"
        height="800px"
        frameBorder="0"
        className="rounded-lg"
      />
    </Card>
  );
}
