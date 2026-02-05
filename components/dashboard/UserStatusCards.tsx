"use client";

import { useMemo, useEffect, useState } from "react";
import { Users, UserCheck, UserX, UserCircle } from "lucide-react";
import { apiFetch } from "@/lib/apiFetch";

interface User {
  _id: string;
  isBlocked: boolean;
  isProfileComplete: boolean;
  isVerified: boolean;
}

// Jumping Dots Sub-component
const JumpingDots = () => (
  <span className="flex items-center gap-1 h-8">
    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
  </span>
);

export default function UserStatsCard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiFetch("/users", { method: "GET" });
      if (!response.ok) throw new Error(`Failed to fetch users`);
      const usersData: User[] = await response.json();
      setUsers(usersData);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => !u.isBlocked).length;
    const blocked = users.filter((u) => u.isBlocked).length;
    const verified = users.filter((u) => u.isVerified).length;
    return { total, active, verified, blocked };
  }, [users]);

  const statCards = [
    {
      title: "Total Users",
      value: stats.total,
      icon: <Users className="h-6 w-6 text-indigo-500" />,
      glow: "shadow-[0_0_12px_-4px_rgba(99,102,241,0.4)]",
    },
    {
      title: "Active Users",
      value: stats.active,
      icon: <UserCheck className="h-6 w-6 text-emerald-500" />,
      glow: "shadow-[0_0_12px_-4px_rgba(16,185,129,0.4)]",
    },
    {
      title: "Verified Users",
      value: stats.verified,
      icon: <UserCircle className="h-6 w-6 text-blue-500" />,
      glow: "shadow-[0_0_12px_-4px_rgba(59,130,246,0.4)]",
    },
    {
      title: "Blocked Users",
      value: stats.blocked,
      icon: <UserX className="h-6 w-6 text-rose-500" />,
      glow: "shadow-[0_0_12px_-4px_rgba(244,63,94,0.4)]",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
      {statCards.map((stat) => (
        <div
          key={stat.title}
          className="group relative bg-white/70 backdrop-blur-xl border border-gray-100 rounded-xl px-5 py-4 flex flex-col items-start justify-center transition-all duration-300 hover:bg-white hover:shadow-md hover:-translate-y-[2px]"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg bg-white shadow-sm ${stat.glow}`}>
              {stat.icon}
            </div>
            <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
              {stat.title}
            </span>
          </div>

          <h3 className="mt-3 text-2xl font-semibold text-gray-800 tracking-tight group-hover:text-gray-900">
            {loading ? <JumpingDots /> : stat.value.toLocaleString()}
          </h3>
        </div>
      ))}
    </div>
  );
}