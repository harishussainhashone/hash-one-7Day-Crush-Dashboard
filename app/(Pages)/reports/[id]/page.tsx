// app/(Pages)/reports/[id]/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Calendar, 
  Mail, 
  User, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Shield,
  RefreshCw
} from 'lucide-react';
import { apiFetch } from '@/lib/apiFetch';
import { Report } from '@/types/report';
import { getImageUrl } from '@/utils/imageUtils';
import { notify } from '@/lib/toast';
import { confirmDanger, confirmSuccess } from '@/lib/confirm';

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Fetch report details
  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(`/admin/reports/${params.id}`);
      
      if (!res.ok) {
        throw new Error('Report not found');
      }
      
      const data = await res.json();
      setReport(data);
    } catch (error: any) {
      console.error('Error fetching report:', error);
      notify.error(error.message || 'Failed to load report');
      router.push('/reports');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (params.id) {
      fetchReport();
    }
  }, [params.id, router]);
  
  // Handle report actions
  const handleResolveReport = async () => {
    if (!report?._id || actionLoading) return;

    const ok = await confirmSuccess({
      title: "Resolve Report",
      text: "Are you sure you want to mark this report as resolved?",
      confirmText: "Yes, resolve",
    });

    if (!ok) return;

    try {
      setActionLoading('resolve');
      const res = await apiFetch(`/admin/reports/${report._id}/resolve`, {
        method: "PUT",
      });

      if (!res.ok) {
        throw new Error('Failed to resolve report');
      }

      notify.success('Report resolved successfully');
      fetchReport(); // Refresh report data
    } catch (error: any) {
      console.error('Error resolving report:', error);
      notify.error(error.message || 'Failed to resolve report');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDismissReport = async () => {
    if (!report?._id || actionLoading) return;

    const ok = await confirmDanger({
      title: "Dismiss Report",
      text: "Are you sure you want to dismiss this report?",
      confirmText: "Yes, dismiss",
    });

    if (!ok) return;

    try {
      setActionLoading('dismiss');
      const res = await apiFetch(`/admin/reports/${report._id}/dismiss`, {
        method: "PUT",
      });

      if (!res.ok) {
        throw new Error('Failed to dismiss report');
      }

      notify.success('Report dismissed successfully');
      fetchReport(); // Refresh report data
    } catch (error: any) {
      console.error('Error dismissing report:', error);
      notify.error(error.message || 'Failed to dismiss report');
    } finally {
      setActionLoading(null);
    }
  };

  const handleBlockUser = async () => {
    if (!report?._id || actionLoading) return;

    const ok = await confirmDanger({
      title: "Block User",
      text: "This will block the reported user and resolve the report. Continue?",
      confirmText: "Yes, block user",
    });

    if (!ok) return;

    try {
      setActionLoading('block');
      const res = await apiFetch(`/admin/reports/${report._id}/block-user`, {
        method: "PUT",
      });

      if (!res.ok) {
        throw new Error('Failed to block user');
      }

      notify.success('User blocked and report resolved');
      fetchReport(); // Refresh report data
    } catch (error: any) {
      console.error('Error blocking user:', error);
      notify.error(error.message || 'Failed to block user');
    } finally {
      setActionLoading(null);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading report details...</p>
        </div>
      </div>
    );
  }
  
  if (!report) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Report Not Found</h2>
        <p className="text-gray-600 mb-6">The requested report could not be found.</p>
        <button
          onClick={() => router.push('/reports')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Reports
        </button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 mt-5">
      {/* Back Button */}
      <button
        onClick={() => router.push('/reports')}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Reports
      </button>
      
      {/* Report Details */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Report Details</h1>
              <div className="flex items-center gap-4 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                  report.status === 'dismissed' ? 'bg-gray-100 text-gray-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  Reported on {new Date(report.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            {/* Action Buttons - Only show for pending reports */}
            {report.status === 'pending' && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleResolveReport}
                  disabled={actionLoading === 'resolve'}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {actionLoading === 'resolve' ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  Resolve
                </button>
                
                <button
                  onClick={handleDismissReport}
                  disabled={actionLoading === 'dismiss'}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
                >
                  {actionLoading === 'dismiss' ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  Dismiss
                </button>
                
                <button
                  onClick={handleBlockUser}
                  disabled={actionLoading === 'block'}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {actionLoading === 'block' ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Shield className="h-4 w-4" />
                  )}
                  Block User
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6 space-y-8">
          {/* Reporter & Reported User */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Reporter Card */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Reporter
              </h3>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-white shadow-sm">
                  {report.reporterId.coverPhoto ? (
                    <img
                      src={getImageUrl(report.reporterId.coverPhoto)}
                      alt={`${report.reporterId.firstName} ${report.reporterId.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {report.reporterId.firstName} {report.reporterId.lastName}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {report.reporterId.email}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Reported User Card */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Reported User
              </h3>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-white shadow-sm">
                  {report.reportedUserId.coverPhoto ? (
                    <img
                      src={getImageUrl(report.reportedUserId.coverPhoto)}
                      alt={`${report.reportedUserId.firstName} ${report.reportedUserId.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">
                      {report.reportedUserId.firstName} {report.reportedUserId.lastName}
                    </p>
                    {report.reportedUserId.isBlocked && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                        Blocked
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {report.reportedUserId.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Report Details */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Reason</h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                {report.reason}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                {report.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}