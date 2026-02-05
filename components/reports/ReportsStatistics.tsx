// components/reports/ReportsStatistics.tsx
import React from "react";
// import { AlertCircle, CheckCircle, XCircle, Shield } from "lucide-react";
import { ReportStatistics } from "@/types/report";

interface ReportsStatisticsProps {
  statistics: ReportStatistics | null;
}

const ReportsStatistics: React.FC<ReportsStatisticsProps> = ({ statistics }) => {
  if (!statistics) return null;

  const StatCard = ({ 
    title, 
    value, 
    color, 
    // icon: Icon 
  }: { 
    title: string; 
    value: number; 
    color: string; 
    // icon: React.ElementType;
  }) => (
    <div className={`rounded-xl py-2 px-6 ${color}`}>
      <div className="flex items-center justify-between">
       
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        
        {/* <Icon className="h-8 w-8 text-gray-400" /> */}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard
        title="Total Reports"
        value={statistics.total}
        color="bg-[#e6e7eb]"
        // icon={AlertCircle}
      />
      <StatCard
        title="Pending"
        value={statistics.pending}
        color="bg-[#e6e7eb]"
        // icon={AlertCircle}
      />
      <StatCard
        title="Resolved"
        value={statistics.resolved}
        color="bg-[#e6e7eb]"
        // icon={CheckCircle}
      />
      <StatCard
        title="Dismissed"
        value={statistics.dismissed}
        color="bg-[#e6e7eb]"
        // icon={XCircle}
      />
      <StatCard
        title="Reviewed"
        value={statistics.reviewed}
        color="bg-[#e6e7eb]"
        // icon={Shield}
      />
    </div>
  );
};

export default ReportsStatistics;