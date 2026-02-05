//components/reports/ReportsFilters.tsx
// components/reports/ReportsFilters.tsx
import React from "react";
import { ChevronDown } from "lucide-react";
import { ReportStatus } from "@/types/report";

interface ReportsFiltersProps {
  search: string;
  statusFilter: ReportStatus;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: ReportStatus) => void;
  onResetFilters: () => void;
}

const ReportsFilters: React.FC<ReportsFiltersProps> = ({
  search,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onResetFilters,
}) => {
  return (
    <div className="bg-white rounded-xl border p-4 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-end gap-4">
        {/* Search */}
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Search Reports
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by reason, description, or user names..."
            className="h-10 w-full rounded-lg border px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full lg:w-48">
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Status
          </label>
          <div className="group relative">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value as ReportStatus)}
              className="h-10 w-full appearance-none rounded-lg border bg-white px-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
              <option value="reviewed">Reviewed</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Reset Button */}
        <div>
          <button
            onClick={onResetFilters}
            className="h-10 rounded-lg border border-gray-200 bg-gray-50 px-4 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsFilters;