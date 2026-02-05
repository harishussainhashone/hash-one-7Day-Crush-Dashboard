// app/(Pages)/reports/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiFetch";
import { notify } from "@/lib/toast";
import { confirmDanger, confirmSuccess } from "@/lib/confirm";
import {
  Report,
  ReportsResponse,
  ReportStatistics,
  ReportStatus,
} from "@/types/report";

// Import the 4 components
import ReportsHeader from "@/components/reports/ReportsHeader";
import ReportsStatistics from "@/components/reports/ReportsStatistics";
import ReportsFilters from "@/components/reports/ReportsFilters";
import ReportsTable from "@/components/reports/ReportsTable";

export default function ReportsPage() {
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

  const handleRefresh = () => {
    fetchReports();
    fetchStatistics();
  };

  return (
    <div className="px-3 py-6 bg-gray-50 min-h-screen space-y-6">
      {/* Header Component */}
      <ReportsHeader onRefresh={handleRefresh} />

      {/* Statistics Component */}
      <ReportsStatistics statistics={statistics} />

      {/* Filters Component */}
      <ReportsFilters
        search={search}
        statusFilter={statusFilter}
        onSearchChange={setSearch}
        onStatusFilterChange={setStatusFilter}
        onResetFilters={handleResetFilters}
      />

      {/* Table Component */}
      <ReportsTable
        reports={filteredReports}
        loading={loading}
        page={page}
        totalPages={totalPages}
        total={total}
        filteredCount={filteredReports.length}
        actionLoading={actionLoading}
        onPageChange={setPage}
        onResolveReport={handleResolveReport}
        onDismissReport={handleDismissReport}
        onBlockUser={handleBlockUser}
        onViewReport={handleViewReport}
        onViewUser={handleViewUser}
      />
    </div>
  );
}