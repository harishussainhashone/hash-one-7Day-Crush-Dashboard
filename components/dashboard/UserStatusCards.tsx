"use client";

import { useMemo } from "react";
import { Users, UserCheck, UserX, UserMinus } from "lucide-react";
import { usersData } from "@/app/data/usersData";

export default function UserStatsCard() {
  const stats = useMemo(() => {
    const total = usersData.length;
    const active = usersData.filter((u) => u.status === "active").length;
    const inactive = usersData.filter((u) => u.status === "inactive").length;
    const blocked = usersData.filter((u) => u.status === "blocked").length;

    return { total, active, inactive, blocked };
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.total,
      icon: <Users className="h-6 w-6 text-indigo-500" />,
      color: "text-indigo-600",
      glow: "shadow-[0_0_12px_-4px_rgba(99,102,241,0.4)]",
    },
    {
      title: "Active Users",
      value: stats.active,
      icon: <UserCheck className="h-6 w-6 text-emerald-500" />,
      color: "text-emerald-600",
      glow: "shadow-[0_0_12px_-4px_rgba(16,185,129,0.4)]",
    },
    {
      title: "Inactive Users",
      value: stats.inactive,
      icon: <UserMinus className="h-6 w-6 text-amber-500" />,
      color: "text-amber-600",
      glow: "shadow-[0_0_12px_-4px_rgba(245,158,11,0.4)]",
    },
    {
      title: "Blocked Users",
      value: stats.blocked,
      icon: <UserX className="h-6 w-6 text-rose-500" />,
      color: "text-rose-600",
      glow: "shadow-[0_0_12px_-4px_rgba(244,63,94,0.4)]",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
      {statCards.map((stat) => (
        <div
          key={stat.title}
          className={`group relative bg-white/70 backdrop-blur-xl border border-gray-100 rounded-xl px-5 py-4 flex flex-col items-start justify-center transition-all duration-300 hover:bg-white hover:shadow-md hover:-translate-y-[2px]`}
        >
          {/* Icon + Title Row */}
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-lg bg-white shadow-sm ${stat.glow}`}
            >
              {stat.icon}
            </div>
            <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
              {stat.title}
            </span>
          </div>

          {/* Value */}
          <h3 className="mt-3 text-2xl font-semibold text-gray-800 tracking-tight group-hover:text-gray-900">
            {stat.value}
          </h3>
        </div>
      ))}
    </div>
  );
}
