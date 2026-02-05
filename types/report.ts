// types/report.ts
export interface UserInfo {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  coverPhoto?: string;
  isBlocked?: boolean;
}

export interface Report {
  _id: string;
  reporterId: UserInfo;
  reportedUserId: UserInfo;
  reason: string;
  description: string;
  status: 'pending' | 'resolved' | 'dismissed' | 'reviewed';
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ReportsResponse {
  items: Report[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ReportStatistics {
  pending: number;
  resolved: number;
  dismissed: number;
  reviewed: number;
  total: number;
}

export type ReportStatus = 'pending' | 'resolved' | 'dismissed' | 'reviewed' | 'all';