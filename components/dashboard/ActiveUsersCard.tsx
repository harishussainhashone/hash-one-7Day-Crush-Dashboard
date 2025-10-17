"use client";

import { useEffect, useState } from "react";
import { UserCheck } from "lucide-react";

export default function ActiveUsersCard() {
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(Math.floor(Math.random() * 5) + 20);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-full bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_8px_40px_rgb(0,0,0,0.07)] hover:-translate-y-0.5">
      {/* Glow ring behind icon */}
      <div className="absolute -top-8 -left-8 w-48 h-28 bg-green-400/20 rounded-full blur-3xl"></div>

      <div className="relative p-4 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 text-white shadow-md shadow-green-200">
              <UserCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Active Users Now
              </p>
              <h3 className="text-4xl font-semibold text-gray-900 tracking-tight">
                {activeUsers}
              </h3>
            </div>
          </div>

          {/* Live badge */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs text-gray-400 font-medium">Live</span>
          </div>
        </div>

       
      </div>
    </div>
  );
}
