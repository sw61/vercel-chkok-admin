import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.JENKINS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'JENKINS_API_KEY not set' });
  }

  const jenkinsUrl = `http://jenkins.chkok.kr:8000/api/monitor?format=json&key=${apiKey}`;

  try {
    // axios.get으로 요청
    const response = await axios.get(jenkinsUrl);

    res.status(200).json(response.data);
  } catch (err: any) {
    console.error('Proxy error:', err.message);
    res.status(500).json({ error: 'Failed to fetch Jenkins data' });
  }
}
