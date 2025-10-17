import StatsOverview from "@/components/dashboard/StatsOverview";
import Charts from "@/components/dashboard/Charts";
import UserStatsCard from "@/components/dashboard/UserStatusCards";
import MatchStatsCard from "@/components/dashboard/MatchStatsCard";
import NewUsersTrendCard from "@/components/dashboard/NewUsersTrendCard";
import ActiveUsersCard from "@/components/dashboard/ActiveUsersCard";
import UserGrowthChart from "@/components/dashboard/UserGrowthChart";
import MatchSuccessRateChart from "@/components/dashboard/MatchSuccessRateChart";
import PeakUsageChart from "@/components/dashboard/PeakUsageChart";

export default function DashboardPage() {
  return (
    <div className="overflow-x-hidden p-6 mt-16 space-y-10">
      {/* Page Title */}
   <h1 className="text-3xl font-semibold bg-gradient-to-r from-red-800 to-black bg-clip-text text-transparent mb-2">
  Dashboard Overview
</h1>


      {/* Row 1 — High-level system stats */}

      {/* Row 2 — User breakdown + Active users side-by-side */}
            <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
      <StatsOverview />
        </div>
        <div className="flex flex-col gap-2">
          <ActiveUsersCard />
        </div>
      </section>
          <UserStatsCard />


      {/* Row 3 — Matches and growth charts side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <MatchStatsCard />
        <NewUsersTrendCard />
      </div>

      {/* Row 4 — New users trend + additional charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
       <MatchSuccessRateChart />
        <Charts />
        <UserGrowthChart />
        <PeakUsageChart />
      </div>
    </div>
  );
}
 