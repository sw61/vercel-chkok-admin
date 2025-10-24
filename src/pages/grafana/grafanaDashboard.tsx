import { Card } from '@/components/ui/card';

export default function GrafanaDashboard() {
  const grafanaBaseUrl = '/grafana';

  // 2. Grafana의 내부 경로를 조합합니다.
  const dashboardUrl = `${grafanaBaseUrl}/d/rYdddlPWk/node-exporter-full?orgId=1&kiosk=tv&theme=light`;
  return (
    <Card className="overflow-y-hidden p-0">
      <iframe
        src={dashboardUrl}
        width="100%"
        height="800px"
        frameBorder="0"
        className="rounded-lg"
      />
    </Card>
  );
}
