import { Card } from '@/components/ui/card';

export default function MainGrafanaDashboard() {
  const grafanaPath = `/d/linux-stats/1-linux-stats-with-node-exporter?orgId=1&kiosk=tv&theme=light`;

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
