"use client";

import { useEffect, useState } from "react";
import { UserTable } from "@/components/userList/UserTable";
import UserTableFilters from "@/components/userList/UserTableFilters";
import { apiFetch } from "@/lib/apiFetch";
import { Users, Loader2, AlertCircle } from "lucide-react";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  isVerified: boolean;
  isProfileComplete: boolean;
  isBlocked: boolean;
  createdAt: string;
  gender: string;
  city?: string;
  country?: string;
  dateOfBirth?: string;
  currentStep?: string;
}

export default function CustomersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await apiFetch("/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data: User[] = await res.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-4 md:p-6 lg:p-6  max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            User Management
          </h1>
        </div>
        <p className="text-gray-600">
          Manage and monitor all registered users in your platform
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full mb-4">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Users</h3>
          <p className="text-gray-500">Please wait while we fetch user data...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-medium text-red-800 mb-2">
                Unable to load users
              </h3>
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success State */}
      {!loading && !error && (
        <>
          <div className="mb-6">
            <UserTableFilters users={users} onFiltered={setFilteredUsers} />
          </div>
          <UserTable users={filteredUsers} />
        </>
      )}
    </div>
  );
}