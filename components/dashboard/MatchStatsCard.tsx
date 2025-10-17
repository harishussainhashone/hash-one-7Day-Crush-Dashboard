"use client";

import { useMemo } from "react";
// import { matchesData } from "@/data/matchesData";
import { CalendarDays, CalendarRange, Trophy } from "lucide-react";
import { matchesData } from "@/app/data/usersData";

export default function MatchStatsCard() {
  const stats = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    // Get Monday of this week
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay() + 1);

    const todayCount = matchesData.filter(
      (m) => m.date === todayStr
    ).length;

    const thisWeekCount = matchesData.filter((m) => {
      const matchDate = new Date(m.date);
      return matchDate >= firstDayOfWeek && matchDate <= today;
    }).length;

    const total = matchesData.length;

    return { today: todayCount, thisWeek: thisWeekCount, total };
  }, []);

  const statCards = [
    {
      title: "Matches Today",
      value: stats.today,
      icon: <CalendarDays className="h-8 w-8 text-blue-600" />,
      color: "bg-blue-100",
    },
    {
      title: "Matches This Week",
      value: stats.thisWeek,
      icon: <CalendarRange className="h-8 w-8 text-green-600" />,
      color: "bg-green-100",
    },
    {
      title: "Total Matches",
      value: stats.total,
      icon: <Trophy className="h-8 w-8 text-yellow-600" />,
      color: "bg-yellow-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {statCards.map((stat) => (
        <div
          key={stat.title}
          className="flex items-center p-2 rounded-full shadow bg-[#de402f] "
        >
          <div
            className={`p-4 rounded-full ${stat.color} flex items-center justify-center`}
          >
            {stat.icon}
          </div>
          <div className="ml-4">
            <p className="text-lg text-white">{stat.title}</p>
            <h3 className="text-2xl font-semibold text-white">
              {stat.value}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}
