"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function PeakUsageChart() {
  const data = [
    { hour: "12 AM", users: 5 },
    { hour: "1 AM", users: 3 },
    { hour: "2 AM", users: 2 },
    { hour: "3 AM", users: 1 },
    { hour: "4 AM", users: 2 },
    { hour: "5 AM", users: 4 },
    { hour: "6 AM", users: 10 },
    { hour: "7 AM", users: 20 },
    { hour: "8 AM", users: 35 },
    { hour: "9 AM", users: 50 },
    { hour: "10 AM", users: 65 },
    { hour: "11 AM", users: 75 },
    { hour: "12 PM", users: 80 },
    { hour: "1 PM", users: 85 },
    { hour: "2 PM", users: 90 },
    { hour: "3 PM", users: 95 },
    { hour: "4 PM", users: 100 },
    { hour: "5 PM", users: 90 },
    { hour: "6 PM", users: 80 },
    { hour: "7 PM", users: 70 },
    { hour: "8 PM", users: 60 },
    { hour: "9 PM", users: 45 },
    { hour: "10 PM", users: 25 },
    { hour: "11 PM", users: 10 },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 p-6">
      <h2 className="text-lg font-semibold text-red-700 mb-4">
        Peak Usage Hours
      </h2>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            <XAxis
              dataKey="hour"
              tick={{ fill: "#6B7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(239,68,68,0.08)" }}
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "8px",
                borderColor: "#FECACA",
              }}
            />

            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#fca5a5" stopOpacity={0.5} />
              </linearGradient>
            </defs>

            <Bar
              dataKey="users"
              fill="url(#colorUsers)"
              radius={[6, 6, 0, 0]}
              barSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
