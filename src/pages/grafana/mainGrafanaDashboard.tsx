import { Card } from '@/components/ui/card';

export default function MainGrafanaDashboard() {
  const grafanaPath =
    'https://grafana.chkok.kr/d/linux-stats/1-linux-stats-with-node-exporter?orgId=1&kiosk=tv&theme=light';

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
