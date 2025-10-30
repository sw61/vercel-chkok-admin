// api/grafanaProxy.js

const GRAFANA_BASE_URL = 'https://grafana.chkok.kr';

export default async function handler(req, res) {
  try {
    // 원본 요청의 경로를 Grafana로 그대로 전달
    const targetUrl = `${GRAFANA_BASE_URL}${req.url.replace('/api/grafana-proxy', '')}`;

    // Grafana로 요청을 보낼 때 헤더 추가
    const grafanaResponse = await fetch(targetUrl, {
      method: req.method,
      headers: {
        ...req.headers,
        'chkok-admin-security': 'true', // 서버에서 요구하는 헤더
      },
      body: req.method !== 'GET' ? req.body : undefined,
    });

    // Grafana 응답 내용을 그대로 반환
    const data = await grafanaResponse.arrayBuffer();
    res.status(grafanaResponse.status);
    grafanaResponse.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    res.send(Buffer.from(data));
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy request failed' });
  }
}
