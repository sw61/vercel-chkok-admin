import { Card } from '@/components/ui/card';

export default function GrafanaDashboard() {
  const grafanaPath =
    '/grafana/d/rYdddlPWk/node-exporter-full?orgId=1&kiosk=tv&theme=light';

  const proxyUrl = `/api/grafana-proxy${encodeURIComponent(grafanaPath)}`;

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
