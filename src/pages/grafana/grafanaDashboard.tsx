import { Card } from '@/components/ui/card';

export default function GrafanaDashboard() {
  const grafanaPath =
    'public-dashboards/300cb54ab4d6428593edcb6e440a0426?orgId=1&kiosk=tv&theme=light';

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
