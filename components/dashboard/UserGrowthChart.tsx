"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// You can later replace this with real user growth data
const userGrowthData = [
  { month: "Apr", users: 120 },
  { month: "May", users: 180 },
  { month: "Jun", users: 260 },
  { month: "Jul", users: 310 },
  { month: "Aug", users: 420 },
  { month: "Sep", users: 530 },
  { month: "Oct", users: 690 },
];

export default function UserGrowthChart() {
  return (
    <Card className="border-none shadow-sm bg-white/70 backdrop-blur-xl rounded-2xl hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-red-800 mb-4">
           User Growth Over Time
        </CardTitle>
      </CardHeader>
      <CardContent className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={userGrowthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
                fontSize: "0.85rem",
              }}
            />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
