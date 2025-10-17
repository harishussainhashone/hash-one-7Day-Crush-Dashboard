"use client";

import { useMemo } from "react";
import { UserPlus, CalendarDays, BarChart3 } from "lucide-react";
import { newUsersData } from "@/app/data/usersData";

export default function NewUsersTrendCard() {
  const stats = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    // Monday of this week
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay() + 1);

    const todayCount = newUsersData.filter(
      (u) => u.createdAt === todayStr
    ).length;

    const thisWeekCount = newUsersData.filter((u) => {
      const createdDate = new Date(u.createdAt);
      return createdDate >= firstDayOfWeek && createdDate <= today;
    }).length;

    // Last week for trend
    const lastWeekStart = new Date(firstDayOfWeek);
    lastWeekStart.setDate(firstDayOfWeek.getDate() - 7);
    const lastWeekEnd = new Date(firstDayOfWeek);
    lastWeekEnd.setDate(firstDayOfWeek.getDate() - 1);

    const lastWeekCount = newUsersData.filter((u) => {
      const createdDate = new Date(u.createdAt);
      return createdDate >= lastWeekStart && createdDate <= lastWeekEnd;
    }).length;

    const trend =
      lastWeekCount > 0
        ? ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100
        : thisWeekCount > 0
        ? 100
        : 0;

    return { today: todayCount, thisWeek: thisWeekCount, trend };
  }, []);

  const statCards = [
    {
      title: "New Users Today",
      value: stats.today,
      icon: <UserPlus className="h-8 w-8 text-blue-600" />,
      color: "bg-blue-100",
    },
    {
      title: "New Users This Week",
      value: stats.thisWeek,
      icon: <CalendarDays className="h-8 w-8 text-green-600" />,
      color: "bg-green-100",
    },
    {
      title: "Weekly Trend",
      value: `${stats.trend.toFixed(1)}%`,
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
      color: "bg-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {statCards.map((stat) => (
        <div
          key={stat.title}
          className="flex items-center p-5 rounded-2xl shadow bg-white border border-gray-100"
        >
          <div
            className={`p-4 rounded-full ${stat.color} flex items-center justify-center`}
          >
            {stat.icon}
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">{stat.title}</p>
            <h3 className="text-2xl font-semibold text-gray-800">
              {stat.value}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}
