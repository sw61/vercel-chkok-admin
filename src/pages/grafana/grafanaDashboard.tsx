import { Card } from '@/components/ui/card';

export default function GrafanaDashboard() {
  const grafanaUrl = `/grafana/d/rYdddlPWk/node-exporter-full?orgId=1&kiosk=tv&theme=light`;

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
