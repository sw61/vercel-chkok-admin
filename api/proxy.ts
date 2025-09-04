// api/proxy.ts
import { VercelRequest, VercelResponse } from '@vercel/node';

// API 응답 타입 정의 (ServerDashBoard.tsx와 동일)
interface MetricStats {
  Average: number;
  Maximum: number;
  Minimum: number;
  Sum: number;
  SampleCount: number;
}

interface ApiResponse {
  Metrics: {
    CPUUtilization: MetricStats;
    NetworkIn: MetricStats;
    NetworkOut: MetricStats;
    NetworkPacketsIn: MetricStats;
    NetworkPacketsOut: MetricStats;
    MetadataNoToken: MetricStats;
    CPUCreditUsage: MetricStats;
    CPUCreditBalance: MetricStats;
    StatusCheckFailed_System: MetricStats;
    StatusCheckFailed_Instance: MetricStats;
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const jenkinsUrl =
    'http://jenkins.chkok.kr:8000/api/monitor?format=json&key=A2F1BFBCF4F802DBA645B5076ACAE2D1FD3EF404CF0DC3F988B93C47239C00B167F4B6F0274AF4E6D4B954CE020B71F99E1264FFB7EE1AD58E3108DE83BBADD0';

  try {
    const response = await fetch(jenkinsUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Jenkins API responded with status ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    res.status(200).json(data);
  } catch (error: any) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ error: 'Failed to fetch data from Jenkins' });
  }
}
