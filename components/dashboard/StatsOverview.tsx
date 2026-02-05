"use client";

import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
import { apiFetch } from "@/lib/apiFetch"; 

// Reusable Jumping Dots Sub-component
const JumpingDots = () => (
  <span className="flex items-center gap-1 h-8">
    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></span>
  </span>
);

export default function DashboardCard() {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const res = await apiFetch("/users"); 
        if (!res.ok) throw new Error("Failed to fetch users");

        const data = await res.json();
        setTotalUsers(data.length); 
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTotalUsers();
  }, []);

  return (
    <div className="flex flex-col mb-6">
      {/* Scrollable Area */}
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="flex flex-wrap gap-6">
          {/* Total Users */}
          <div className="flex-1 min-w-[260px] bg-white rounded-xl shadow p-6 border-l-4 border-purple-500 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-purple-600 mb-1">
                TOTAL USERS
              </div>
              <div className="text-2xl font-bold text-gray-700">
                {/* Logic updated: Shows jumping dots while loading */}
                {loading ? (
                  <JumpingDots />
                ) : error ? (
                  <span className="text-sm text-red-500">Error</span>
                ) : (
                  totalUsers.toLocaleString()
                )}
              </div>
            </div>
            <User className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
}