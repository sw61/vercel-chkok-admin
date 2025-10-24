import UsersDonutChart from '../users/components/chart/usersDonut';
import UsersBarChart from '../users/components/chart/usersBarChart';

export default function UserChartContent() {
  return (
    <div className="mt-4 flex flex-1 flex-col gap-2">
      <div className="mb-2 grid auto-rows-min grid-cols-3 gap-4">
        <div className="aspect-video rounded-xl">
          <UsersDonutChart />
        </div>
        <div className="aspect-video rounded-xl">
          <UsersBarChart />
        </div>
      </div>
    </div>
  );
}
