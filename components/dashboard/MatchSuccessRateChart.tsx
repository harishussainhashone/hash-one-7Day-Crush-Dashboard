"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useMemo } from "react";
import { matchesData } from "@/app/data/usersData";

// You can still define static colors for non-gradient slices
const COLORS = ["url(#successGradient)", "#e8e2e1"]; // gradient for success, light gray for fail

export default function MatchSuccessRateChart() {
  const data = useMemo(() => {
    const totalMatches = matchesData.length;
    const successfulMatches = Math.floor(totalMatches * 0.65); // 65% success rate
    const failedMatches = totalMatches - successfulMatches;

    return [
      { name: "Successful", value: successfulMatches },
      { name: "Failed", value: failedMatches },
    ];
  }, []);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 p-6">
      <h2 className="text-lg font-semibold text-red-700 mb-4">
        Match Success Rate
      </h2>

      <div className="h-64 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {/* Define gradient for the success color */}
            <defs>
              <linearGradient id="successGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#5f3d91" stopOpacity={0.95} /> {/* purple-500 */}
                <stop offset="100%" stopColor="#438691" stopOpacity={0.9} /> {/* blue-500 */}
              </linearGradient>
            </defs>

            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              innerRadius={70}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  className="transition-all duration-300 hover:opacity-80"
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                borderColor: "#E5E7EB",
                backgroundColor: "white",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Centered total text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-800">
            {((data[0].value / total) * 100).toFixed(1)}%
          </span>
          <span className="text-sm text-gray-500">Success Rate</span>
        </div>
      </div>
    </div>
  );
}
