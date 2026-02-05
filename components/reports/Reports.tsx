// components/reports/Reports.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Shield,
  Eye,
  Filter,
  RefreshCw,
  ChevronDown,
  Users,
} from "lucide-react";
import { apiFetch } from "@/lib/apiFetch";
import { getImageUrl } from "@/utils/imageUtils";
import { notify } from "@/lib/toast";
import { confirmDanger, confirmSuccess } from "@/lib/confirm";
import {
  Report,
  ReportsResponse,
  ReportStatistics,
  ReportStatus,
} from "@/types/report";

const Reports = () => {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [statistics, setStatistics] = useState<ReportStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filters
  const [statusFilter, setStatusFilter] = useState<ReportStatus>("all");
  const [search, setSearch] = useState("");

  // Fetch reports
  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const res = await apiFetch(`/admin/reports?${params.toString()}`);

      if (!res.ok) {
        throw new Error("Failed to fetch reports");
      }

      const data: ReportsResponse = await res.json();
      setReports(data.items);
      setFilteredReports(data.items);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (error: any) {
      console.error("Error fetching reports:", error);
      notify.error(error.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      const res = await apiFetch("/admin/reports/statistics");

      if (!res.ok) {
        throw new Error("Failed to fetch statistics");
      }

      const data: ReportStatistics = await res.json();
      setStatistics(data);
    } catch (error: any) {
      console.error("Error fetching statistics:", error);
    }
  };

  // Apply filters
  useEffect(() => {
    let result = [...reports];

    // Apply search filter
    if (search.trim()) {
      const query = search.trim().toLowerCase();
      result = result.filter(
        (report) =>
          report.reason.toLowerCase().includes(query) ||
          report.description.toLowerCase().includes(query) ||
          `${report.reporterId.firstName} ${report.reporterId.lastName}`
            .toLowerCase()
            .includes(query) ||
          `${report.reportedUserId.firstName} ${report.reportedUserId.lastName}`
            .toLowerCase()
            .includes(query),
      );
    }

    setFilteredReports(result);
  }, [reports, search]);

  // Initial load
  useEffect(() => {
    fetchReports();
    fetchStatistics();
  }, [page, limit, statusFilter]);

  // Handle report actions
  const handleResolveReport = async (reportId: string) => {
    const ok = await confirmSuccess({
      title: "Resolve Report",
      text: "Are you sure you want to mark this report as resolved?",
      confirmText: "Yes, resolve",
    });

    if (!ok) return;

    try {
      setActionLoading(`resolve-${reportId}`);
      const res = await apiFetch(`/admin/reports/${reportId}/resolve`, {
        method: "PUT",
      });

      if (!res.ok) {
        throw new Error("Failed to resolve report");
      }

      notify.success("Report resolved successfully");
      fetchReports();
      fetchStatistics();
    } catch (error: any) {
      console.error("Error resolving report:", error);
      notify.error(error.message || "Failed to resolve report");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDismissReport = async (reportId: string) => {
    const ok = await confirmDanger({
      title: "Dismiss Report",
      text: "Are you sure you want to dismiss this report?",
      confirmText: "Yes, dismiss",
    });

    if (!ok) return;

    try {
      setActionLoading(`dismiss-${reportId}`);
      const res = await apiFetch(`/admin/reports/${reportId}/dismiss`, {
        method: "PUT",
      });

      if (!res.ok) {
        throw new Error("Failed to dismiss report");
      }

      notify.success("Report dismissed successfully");
      fetchReports();
      fetchStatistics();
    } catch (error: any) {
      console.error("Error dismissing report:", error);
      notify.error(error.message || "Failed to dismiss report");
    } finally {
      setActionLoading(null);
    }
  };

  const handleBlockUser = async (reportId: string, userId: string) => {
    const ok = await confirmDanger({
      title: "Block User",
      text: "This will block the reported user and resolve the report. Continue?",
      confirmText: "Yes, block user",
    });

    if (!ok) return;

    try {
      setActionLoading(`block-${reportId}`);
      const res = await apiFetch(`/admin/reports/${reportId}/block-user`, {
        method: "PUT",
      });

      if (!res.ok) {
        throw new Error("Failed to block user");
      }

      notify.success("User blocked and report resolved");
      fetchReports();
      fetchStatistics();
    } catch (error: any) {
      console.error("Error blocking user:", error);
      notify.error(error.message || "Failed to block user");
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewReport = (reportId: string) => {
    // Navigate to detailed report view
    router.push(`/reports/${reportId}`);
  };

  const handleViewUser = (userId: string) => {
    // Navigate to user profile
    router.push(`/userList/${userId}`);
  };

  const handleResetFilters = () => {
    setStatusFilter("all");
    setSearch("");
    setPage(1);
  };

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

  // Statistics cards
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
    <div className={`rounded-xl p-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        {/* <Icon className="h-8 w-8 text-gray-400" /> */}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Reports</h1>
          <p className="text-gray-600">Manage and review user reports</p>
        </div>
        <button
          onClick={() => {
            fetchReports();
            fetchStatistics();
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      {statistics && (
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
      )}

      {/* Filters */}
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
              onChange={(e) => setSearch(e.target.value)}
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
                onChange={(e) =>
                  setStatusFilter(e.target.value as ReportStatus)
                }
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
              onClick={handleResetFilters}
              className="h-10 rounded-lg border border-gray-200 bg-gray-50 px-4 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Reports Table */}
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
                  Actions
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
              ) : filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr
                    key={report._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Reporter */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
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
                          <p className="text-sm font-medium text-gray-900">
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
                        <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                          {report.reportedUserId.coverPhoto ? (
                            <img
                              src={getImageUrl(
                                report.reportedUserId.coverPhoto,
                              )}
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
                            <p className="text-sm font-medium text-gray-900">
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

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleViewReport(report._id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </button>

                        {report.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleResolveReport(report._id)}
                              disabled={
                                actionLoading === `resolve-${report._id}`
                              }
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                            >
                              {actionLoading === `resolve-${report._id}` ? (
                                <RefreshCw className="h-3 w-3 animate-spin" />
                              ) : (
                                <CheckCircle className="h-3 w-3" />
                              )}
                              Resolve
                            </button>

                            <button
                              onClick={() => handleDismissReport(report._id)}
                              disabled={
                                actionLoading === `dismiss-${report._id}`
                              }
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-600 text-white text-xs rounded-md hover:bg-gray-700 disabled:opacity-50 transition-colors"
                            >
                              {actionLoading === `dismiss-${report._id}` ? (
                                <RefreshCw className="h-3 w-3 animate-spin" />
                              ) : (
                                <XCircle className="h-3 w-3" />
                              )}
                              Dismiss
                            </button>

                            <button
                              onClick={() =>
                                handleBlockUser(
                                  report._id,
                                  report.reportedUserId._id,
                                )
                              }
                              disabled={actionLoading === `block-${report._id}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
                            >
                              {actionLoading === `block-${report._id}` ? (
                                <RefreshCw className="h-3 w-3 animate-spin" />
                              ) : (
                                <Shield className="h-3 w-3" />
                              )}
                              Block User
                            </button>
                          </>
                        )}
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
                <span className="font-medium">{filteredReports.length}</span> of{" "}
                <span className="font-medium">{total}</span> reports
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-3 py-1.5 text-sm">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
