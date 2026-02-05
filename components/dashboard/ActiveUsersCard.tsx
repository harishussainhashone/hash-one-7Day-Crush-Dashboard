"use client";

import { useEffect, useState } from "react";
import { UserCheck } from "lucide-react";
import { apiFetch } from "@/lib/apiFetch";

interface User {
  _id: string;
  isBlocked: boolean;
}

export default function ActiveUsersCard() {
  const [activeUsersCount, setActiveUsersCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchActiveUsers();
  }, []);

  const fetchActiveUsers = async () => {
    try {
      setLoading(true);
      const response = await apiFetch("/users", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users`);
      }

      const users: User[] = await response.json();
      
      const activeUsers = users.filter(user => !user.isBlocked);
      setActiveUsersCount(activeUsers.length);

    } catch (err) {
      console.error("Error fetching active users:", err);
      setActiveUsersCount(0); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-full bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_8px_40px_rgb(0,0,0,0.07)] hover:-translate-y-0.5">
      {/* Glow ring behind icon */}
      <div className="absolute -top-8 -left-8 w-48 h-28 bg-green-400/20 rounded-full blur-3xl"></div>

      <div className="relative p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 text-white shadow-md shadow-green-200">
              <UserCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Active Users
              </p>
              <h3 className="text-4xl font-semibold text-gray-900 tracking-tight">
                {/* Fixed logic: No more gray bg, just shows 00 while loading */}
                {loading ? "..." : activeUsersCount.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}