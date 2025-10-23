<<<<<<< Updated upstream
import { Card, CardHeader, CardContent } from '@/components/ui/card';
=======
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
>>>>>>> Stashed changes

export default function GrafanaDashboard() {
  return (
    <Card className="w-full">
      <CardHeader>{/* <CardTitle>서버 상태 모니터링</CardTitle> */}</CardHeader>
      <CardContent>
        <iframe
          src="http://jenkins.chkok.kr:3000/d/rYdddlPWk/node-exporter-full?orgId=1&timezone=browser&var-ds_prometheus=af17x48otts00e&var-job=node&var-nodename=ip-172-31-32-235.ap-northeast-2.compute.internal&var-node=172.31.32.235:9100&refresh=1m&kiosk=tv"
          width="100%"
          height="750px"
          frameBorder="0"
          className="rounded-lg"
        />
      </CardContent>
    </Card>
  );
}
