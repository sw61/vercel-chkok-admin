import { UserPieChartActive } from '@/Chart/UserPieChartActive';
import { UserPieChartCount } from '@/Chart/UserPieChartCount';
import { CamapaignPieChart } from '@/Chart/CampaignPieChart';
import ServerDashBoard from '@/Server/ServerDashBoard';
export default function MainPage() {
  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="mb-2 grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="aspect-video rounded-xl">
            <UserPieChartActive />
          </div>
          <div className="aspect-video rounded-xl">
            <UserPieChartCount />
          </div>
          <div className="aspect-video rounded-xl">
            <CamapaignPieChart />
          </div>
        </div>
        <div className="rounded-xl">
          <ServerDashBoard />
        </div>
      {/* 테스트 */}
      </div>
    </>
  );
}
