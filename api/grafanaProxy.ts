// api/grafana-proxy.js

// Grafana의 기본 URL (도메인까지만 설정)
const GRAFANA_BASE_URL = 'https://grafana.chkok.kr';
const CUSTOM_SECURITY_HEADER = 'true;';

export default async function (req, res) {
  // 1. 클라이언트가 Vercel Proxy에 요청한 경로와 쿼리 문자열을 그대로 가져옵니다.
  // req.url은 '/api/grafana-proxy?path=...' 형태를 가집니다.
  const pathWithQuery = req.url.substring(req.url.indexOf('?path=') + 6);

  // 2. URL 디코딩하여 실제 Grafana 경로와 쿼리 파라미터를 얻습니다.
  const fullGrafanaPath = decodeURIComponent(pathWithQuery);

  // 3. Grafana로 요청할 최종 URL 구성
  // 예: https://grafana.chkok.kr/grafana/d/linux-stats/...
  const finalGrafanaUrl = `${GRAFANA_BASE_URL}${fullGrafanaPath}`;

  try {
    const grafanaResponse = await fetch(finalGrafanaUrl, {
      method: req.method,
      // 💡 커스텀 요청 헤더 추가
      headers: {
        'chkok-admin-security': CUSTOM_SECURITY_HEADER,
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
