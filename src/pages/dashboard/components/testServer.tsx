import { getTestServerData } from '@/services/dashboard/serverApi';
import { useEffect } from 'react';

export default function TestServerDashBoard() {
  useEffect(() => {
    getTestServerData();
  }, []);
  return <></>;
}
