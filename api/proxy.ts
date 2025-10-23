import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

// 최근 데이터 캐시
let cachedData: any = null;
let lastFetched: number = 0;
const CACHE_DURATION = 60 * 1000; // 1분

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // GET 요청만 허용
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const now = Date.now();

  // 캐시 사용
  if (cachedData && now - lastFetched < CACHE_DURATION) {
    return res.status(200).json(cachedData);
  }

  const apiKey = process.env.SERVER_URL_KEY;
  const jenkinsUrl = `http://jenkins.chkok.kr:3000/d/rYdddlPWk/node-exporter-full?${apiKey}`;

  try {
    const response = await fetch(jenkinsUrl, { method: 'GET' });

    if (!response.ok) {
      throw new Error(`Jenkins API responded with ${response.status}`);
    }

    const data = await response.json();

    // 캐시 업데이트
    cachedData = data;
    lastFetched = now;

    // 외부에서 호출 가능하도록 CORS 허용
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (err: any) {
    console.error('Proxy error:', err.message);

    // 실패 시 캐시 데이터 제공
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    res.status(500).json({ error: 'Failed to fetch Jenkins data' });
  }
}
