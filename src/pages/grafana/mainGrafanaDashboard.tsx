import { Card } from '@/components/ui/card';

export default function MainGrafanaDashboard() {
  // 1. 요청하려는 Grafana의 실제 경로 (쿼리 파라미터 포함)
  // 이전 질문에서 사용했던 리눅스 통계 대시보드 주소입니다.
  const grafanaPath = `/grafana/d/linux-stats/1-linux-stats-with-node-exporter?orgId=1&kiosk=tv&theme=light`;

  // 2. 경로를 URL 인코딩하여 프록시 URL의 'path' 쿼리 파라미터로 전달
  // Vercel Function은 이 프록시 URL 요청을 받아서 커스텀 헤더를 추가합니다.
  const proxyUrl = `/api/grafana-proxy?path=${encodeURIComponent(grafanaPath)}`;

  return (
    <Card className="overflow-y-hidden p-0">
      <iframe
        // 💡 프록시 URL을 src로 지정
        src={proxyUrl}
        width="100%"
        height="800px"
        frameBorder="0"
        className="rounded-lg"
      />
    </Card>
  );
}
