import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const jenkinsUrl =
    'http://jenkins.chkok.kr:8000/api/monitor?format=json&key=A2F1BFBCF4F802DBA645B5076ACAE2D1FD3EF404CF0DC3F988B93C47239C00B167F4B6F0274AF4E6D4B954CE020B71F99E1264FFB7EE1AD58E3108DE83BBADD0';

  try {
    const response = await fetch(jenkinsUrl);

    if (!response.ok) {
      throw new Error(`Jenkins API responded with ${response.status}`);
    }

    const data = await response.json();

    res.setHeader('Access-Control-Allow-Origin', '*'); // CORS 우회
    res.status(200).json(data);
  } catch (err: any) {
    console.error('Proxy error:', err.message);
    res.status(500).json({ error: 'Failed to fetch Jenkins data' });
  }
}
