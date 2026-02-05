// components/reports/ReportsTable.tsx
import React from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Shield,
  Eye,
  RefreshCw,
  Users,
} from "lucide-react";
import { Report } from "@/types/report";
import { getImageUrl } from "@/utils/imageUtils";

interface ReportsTableProps {
  reports: Report[];
  loading: boolean;
  page: number;
  totalPages: number;
  total: number;
  filteredCount: number;
  actionLoading?: string | null; // Make optional since we won't use it
  onPageChange: (page: number) => void;
  onResolveReport?: (reportId: string) => void; // Remove or make optional
  onDismissReport?: (reportId: string) => void; // Remove or make optional
  onBlockUser?: (reportId: string, userId: string) => void; // Remove or make optional
  onViewReport: (reportId: string) => void;
  onViewUser: (userId: string) => void;
}

const ReportsTable: React.FC<ReportsTableProps> = ({
  reports,
  loading,
  page,
  totalPages,
  total,
  filteredCount,
  onPageChange,
  onViewReport,
  onViewUser,
}) => {
  const router = useRouter();

  // Status badge component
  const StatusBadge = ({ status }: { status: Report["status"] }) => {
    const config = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        icon: AlertCircle,
      },
      resolved: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: CheckCircle,
      },
      dismissed: { bg: "bg-gray-100", text: "text-gray-800", icon: XCircle },
      reviewed: { bg: "bg-blue-100", text: "text-blue-800", icon: Shield },
    };

    const { bg, text, icon: Icon } = config[status];

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${bg} ${text}`}
      >
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Reporter
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Reported User
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Reason
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mb-4" />
                    <p className="text-gray-600">Loading reports...</p>
                  </div>
                </td>
              </tr>
            ) : reports.length > 0 ? (
              reports.map((report) => (
                <tr
                  key={report._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Reporter */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="h-10 w-10 rounded-full overflow-hidden border-2 border-white shadow-sm cursor-pointer"
                        onClick={() => onViewUser(report.reporterId._id)}
                      >
                        {report.reporterId.coverPhoto ? (
                          <img
                            src={getImageUrl(report.reporterId.coverPhoto)}
                            alt={`${report.reporterId.firstName} ${report.reporterId.lastName}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = `https://placehold.co/100x100/3b82f6/ffffff?text=${report.reporterId.firstName?.charAt(0)}${report.reporterId.lastName?.charAt(0)}`;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                            <Users className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p 
                          className="text-sm font-medium text-gray-900 hover:text-blue-600 cursor-pointer"
                          onClick={() => onViewUser(report.reporterId._id)}
                        >
                          {report.reporterId.firstName}{" "}
                          {report.reporterId.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate max-w-[150px]">
                          {report.reporterId.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Reported User */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="h-10 w-10 rounded-full overflow-hidden border-2 border-white shadow-sm cursor-pointer"
                        onClick={() => onViewUser(report.reportedUserId._id)}
                      >
                        {report.reportedUserId.coverPhoto ? (
                          <img
                            src={getImageUrl(report.reportedUserId.coverPhoto)}
                            alt={`${report.reportedUserId.firstName} ${report.reportedUserId.lastName}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = `https://placehold.co/100x100/3b82f6/ffffff?text=${report.reportedUserId.firstName?.charAt(0)}${report.reportedUserId.lastName?.charAt(0)}`;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                            <Users className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p 
                            className="text-sm font-medium text-gray-900 hover:text-blue-600 cursor-pointer"
                            onClick={() => onViewUser(report.reportedUserId._id)}
                          >
                            {report.reportedUserId.firstName}{" "}
                            {report.reportedUserId.lastName}
                          </p>
                          {report.reportedUserId.isBlocked && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                              Blocked
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate max-w-[150px]">
                          {report.reportedUserId.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Reason & Description */}
                  <td className="px-6 py-4 max-w-xs">
                    <p className="text-sm font-medium text-gray-900">
                      {report.reason}
                    </p>
                    <p className="text-xs text-gray-500 truncate max-w-[200px]">
                      {report.description}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <StatusBadge status={report.status} />
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </td>

                  {/* Action - Only View button */}
                  <td className="px-6 py-4">
                    <div className="flex">
                      <button
                        onClick={() => onViewReport(report._id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <Eye className="h-3 w-3" />
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      No reports found
                    </h3>
                    <p className="text-gray-500">
                      No reports match your current filters.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{filteredCount}</span> of{" "}
              <span className="font-medium">{total}</span> reports
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onPageChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-3 py-1.5 text-sm">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsTable;