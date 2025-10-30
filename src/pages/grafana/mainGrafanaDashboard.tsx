import { Card } from '@/components/ui/card';

export default function MainGrafanaDashboard() {
  const grafanaPath = `https://grafana.chkok.kr/public-dashboards/c194255582cf42d0ac712b5df9c47778?orgId=1&kiosk=tv&theme=light`;

  // const proxyUrl = `/api/grafana-proxy?path=${encodeURIComponent(grafanaPath)}`;

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
