import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const jenkinsUrl = `http://jenkins.chkok.kr:8000/api/monitor?format=json&key=${process.env.VITE_JENKINS_API_KEY}`;

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
