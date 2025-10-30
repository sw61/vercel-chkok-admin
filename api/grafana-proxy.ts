// Grafana 서버 기본 URL
const GRAFANA_BASE_URL = 'https://grafana.chkok.kr';
const CUSTOM_SECURITY_HEADER = 'true';

export default async function handler(req, res) {
  try {
    // 1. URL 파라미터 추출 로직
    const pathParamIndex = req.url.indexOf('?path=');
    if (pathParamIndex === -1) {
      res.status(400).end('Missing path parameter.');
      return;
    }

    const pathWithQuery = req.url.substring(pathParamIndex + 6);
    const fullGrafanaPath = decodeURIComponent(pathWithQuery);
    const finalGrafanaUrl = `${GRAFANA_BASE_URL}${fullGrafanaPath}`;

    // 2. Grafana로 요청
    const grafanaResponse = await fetch(finalGrafanaUrl, {
      method: req.method,
      // Grafana에 전달할 추가 헤더
      headers: {
        'chkok-admin-security': CUSTOM_SECURITY_HEADER,
      },
    });

    // --- ⭐ 핵심 수정 부분 시작 ⭐ ---

    // 3. Grafana 응답 헤더 복사 및 필터링
    res.status(grafanaResponse.status);

    // Grafana 응답 헤더를 그대로 복사합니다.
    // Vercel의 프록시 응답은 스트리밍 방식(파이프)이 더 효율적이며,
    // Content-Length 헤더는 일반적으로 제거하는 것이 좋습니다.
    grafanaResponse.headers.forEach((value, name) => {
      const lowerName = name.toLowerCase();
      // iFrame 차단 관련 헤더와 Content-Length 헤더 제거 (Vercel 환경에 맞게)
      if (
        lowerName !== 'x-frame-options' &&
        lowerName !== 'content-security-policy' &&
        lowerName !== 'content-length'
      ) {
        res.setHeader(name, value);
      }
    });

    // 4. 응답 본문 처리 (Buffer로 처리하여 텍스트/바이너리 모두 대응)
    // .text() 대신 .arrayBuffer()를 사용하여 데이터를 버퍼로 가져옵니다.
    // 이는 JS/HTML 뿐만 아니라 이미지, 폰트 등 바이너리 파일이 요청될 경우에도 대응 가능하게 합니다.
    const contentBuffer = await grafanaResponse.arrayBuffer();

    // Node.js 응답 객체에 Buffer를 전달하여 응답
    res.end(Buffer.from(contentBuffer));

    // --- ⭐ 핵심 수정 부분 끝 ⭐ ---
  } catch (error) {
    console.error('Grafana Proxy Error:', error);
    // 500 에러 시에도 HTML이 아닌 일반 텍스트로 응답
    res
      .status(500)
      .setHeader('Content-Type', 'text/plain')
      .end('Grafana proxy failed.');
  }
}
