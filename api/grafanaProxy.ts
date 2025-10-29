// api/grafana-proxy.js

// Grafana의 기본 URL (도메인까지만 설정)
const GRAFANA_BASE_URL = 'https://grafana.chkok.kr';
// 💡 커스텀 헤더 값 (환경 변수로 관리하는 것이 좋습니다)
const CUSTOM_SECURITY_HEADER = 'true;';

export default async function (req, res) {
  // 1. 클라이언트가 Vercel Proxy에 요청한 경로를 쿼리 파라미터에서 추출
  // 예: /api/grafana-proxy?path=/grafana/d/rYdddlPWk/node-exporter-full?orgId=1&kiosk=tv&theme=light
  const fullGrafanaPath = req.query.path || '/';

  // 2. Grafana로 요청할 최종 URL 구성
  const finalGrafanaUrl = `${GRAFANA_BASE_URL}${fullGrafanaPath}`;

  try {
    // 3. Grafana로 요청을 보내면서 커스텀 헤더 추가
    const grafanaResponse = await fetch(finalGrafanaUrl, {
      method: req.method,
      headers: {
        'chkok-admin-security': CUSTOM_SECURITY_HEADER, // 💡 커스텀 헤더 적용
        // 필요에 따라 쿠키 전달: 'Cookie': req.headers.cookie || '',
      },
    });

    // 4. 응답 헤더 설정 (iFrame 임베딩 허용)
    res.statusCode = grafanaResponse.status;

    grafanaResponse.headers.forEach((value, name) => {
      const lowerName = name.toLowerCase();
      // iFrame 임베딩을 방해하는 헤더 제거
      if (
        lowerName !== 'x-frame-options' &&
        lowerName !== 'content-security-policy'
      ) {
        res.setHeader(name, value);
      }
    });

    // 5. 응답 본문 전달
    const content = await grafanaResponse.text();
    res.end(content);
  } catch (error) {
    console.error('Grafana Dynamic Proxy Error:', error);
    res
      .status(500)
      .end('Failed to load content from Grafana via dynamic Vercel Proxy.');
  }
}
