// components/reports/ReportsHeader.tsx
import React from "react";
import { RefreshCw } from "lucide-react";

interface ReportsHeaderProps {
  onRefresh: () => void;
}

const ReportsHeader: React.FC<ReportsHeaderProps> = ({ onRefresh }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Reports</h1>
        <p className="text-gray-600">Manage and review user reports</p>
      </div>
      <button
        onClick={onRefresh}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <RefreshCw className="h-4 w-4" />
        Refresh
      </button>
    </div>
  );
};

export default ReportsHeader;