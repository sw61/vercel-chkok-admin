// ✅ Node.js 런타임 강제 (Edge 환경에서는 커스텀 헤더 누락됨)
export const config = {
  runtime: 'nodejs',
};

// Grafana 서버 기본 URL
const GRAFANA_BASE_URL = 'https://grafana.chkok.kr';
const CUSTOM_SECURITY_HEADER = 'true;';

export default async function handler(req, res) {
  try {
    const pathParamIndex = req.url.indexOf('?path=');
    if (pathParamIndex === -1) {
      res.status(400).end('Missing path parameter.');
      return;
    }

    const pathWithQuery = req.url.substring(pathParamIndex + 6);
    const fullGrafanaPath = decodeURIComponent(pathWithQuery);
    const finalGrafanaUrl = `${GRAFANA_BASE_URL}${fullGrafanaPath}`;

    // Grafana로 요청 (커스텀 헤더 포함)
    const grafanaResponse = await fetch(finalGrafanaUrl, {
      method: req.method,
      headers: {
        'chkok-admin-security': CUSTOM_SECURITY_HEADER,
      },
    });

    // Grafana 응답 헤더 복사
    res.status(grafanaResponse.status);
    grafanaResponse.headers.forEach((value, name) => {
      const lowerName = name.toLowerCase();
      // iFrame 차단 관련 헤더 제거
      if (
        lowerName !== 'x-frame-options' &&
        lowerName !== 'content-security-policy'
      ) {
        res.setHeader(name, value);
      }
    });

    // Grafana 응답 본문 그대로 전달
    const content = await grafanaResponse.text();
    res.end(content);
  } catch (error) {
    console.error('Grafana Proxy Error:', error);
    res.status(500).end('Grafana proxy failed.');
  }
}
