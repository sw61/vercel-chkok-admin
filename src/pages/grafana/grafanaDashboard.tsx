import { Card } from '@/components/ui/card';

export default function GrafanaDashboard() {
  const grafanaPath =
    '/public-dashboards/5b8e97ac2c4141788e8004d18179923b?orgId=1&kiosk=tv&theme=light';

  const proxyUrl = `/api/grafana-proxy?path=${encodeURIComponent(grafanaPath)}`;

  return (
    <Card className="overflow-y-hidden p-0">
      <iframe
        src={proxyUrl}
        width="100%"
        height="800px"
        frameBorder="0"
        className="rounded-lg"
      />
    </Card>
  );
}
