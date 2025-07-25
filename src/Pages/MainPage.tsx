import { UserPieChart } from "@/Users/UserPieChart";
import { CamapaignPieChart } from "@/Campaigns/CampaignPieChart";
import CampaignTablePage from "@/Campaigns/CampaignTablePage";
export default function Page() {
  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 ">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="bg-muted/50 aspect-video rounded-xl">
            <UserPieChart />
          </div>
          <div className="bg-muted/50 aspect-video rounded-xl">
            <CamapaignPieChart />
          </div>
          <div className="bg-muted/50 aspect-video rounded-xl">
            <UserPieChart />
          </div>
        </div>
        <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min p-4">
          <CampaignTablePage />
        </div>
      </div>
    </>
  );
}
