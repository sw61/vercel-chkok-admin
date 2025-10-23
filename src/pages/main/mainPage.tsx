import { UserPieChartActive } from '@/pages/users/pages/usersPieChartActive';
import { UserPieChartCount } from '@/pages/users/pages/usersPieChartCount';
import { CamapaignsPieChart } from '@/pages/campaigns/pages/campaignsPieChart';

export default function MainPage() {
  return (
    <>
      <div className="flex flex-1 flex-col gap-2">
        <div className="mb-2 grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="aspect-video rounded-xl">
            <UserPieChartActive />
          </div>
          <div className="aspect-video rounded-xl">
            <UserPieChartCount />
          </div>
          <div className="aspect-video rounded-xl">
            <CamapaignsPieChart />
          </div>
        </div>
      </div>
    </>
  );
}
