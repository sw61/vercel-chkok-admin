// api/grafanaProxy.js

const GRAFANA_BASE_URL = 'https://grafana.chkok.kr';
const CUSTOM_SECURITY_HEADER = 'true';

export default async function handler(req, res) {
  try {
    // 1️⃣ URL 파라미터 파싱
    const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
    const fullGrafanaPath = searchParams.get('path');

    if (!fullGrafanaPath) {
      res.status(400).end('Missing "path" parameter.');
      return;
    }

    const finalGrafanaUrl = `${GRAFANA_BASE_URL}${decodeURIComponent(fullGrafanaPath)}`;

    // 2️⃣ Grafana로 요청 (⭐ 헤더만 전달 ⭐)
    const grafanaResponse = await fetch(finalGrafanaUrl, {
      headers: {
        'chkok-admin-security': CUSTOM_SECURITY_HEADER,
      },
    });

    // 3️⃣ Grafana 응답 헤더 복사 (iframe 차단 헤더 제거)
    res.status(grafanaResponse.status);
    grafanaResponse.headers.forEach((value, name) => {
      const lower = name.toLowerCase();
      if (
        lower !== 'x-frame-options' &&
        lower !== 'content-security-policy' &&
        lower !== 'content-length'
      ) {
        res.setHeader(name, value);
      }
    });

    // 4️⃣ 응답 본문 전달
    const contentBuffer = await grafanaResponse.arrayBuffer();
    res.end(Buffer.from(contentBuffer));
  } catch (error) {
    console.error('Grafana Proxy Error:', error);
    res
      .status(500)
      .setHeader('Content-Type', 'text/plain')
      .end('Grafana proxy failed.');
  }
}

// --- ⚙️ Vercel 런타임 설정 ---
export const config = {
  runtime: 'nodejs',
};
