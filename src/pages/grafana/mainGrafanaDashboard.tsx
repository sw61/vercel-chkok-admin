import { Card } from '@/components/ui/card';

export default function MainGrafanaDashboard() {
  return (
    <Card className="overflow-y-hidden p-0">
      <iframe
        src="http://jenkins.chkok.kr:3000/d/linux-stats/1-linux-stats-with-node-exporter?orgId=1&kiosk=tv&theme=light"
        width="100%"
        height="800px"
        frameBorder="0"
        className="rounded-lg"
      />
    </Card>
  );
}
