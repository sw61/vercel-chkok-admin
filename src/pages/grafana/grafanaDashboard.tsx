import { Card } from '@/components/ui/card';

export default function GrafanaDashboard() {
  const grafanaPath =
    'https://grafana.chkok.kr/d/rYdddlPWk/node-exporter-full?orgId=1&kiosk=tv&theme=light';

  return (
    <Card className="overflow-y-hidden p-0">
      <iframe
        src={grafanaPath}
        width="100%"
        height="800px"
        frameBorder="0"
        className="rounded-lg"
      />
    </Card>
  );
}
