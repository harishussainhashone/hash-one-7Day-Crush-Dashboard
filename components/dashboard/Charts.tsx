"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Sample Data
const earningsData = [
  { name: "Mon", total: 4000, today: 2400 },
  { name: "Tue", total: 3000, today: 1398 },
  { name: "Wed", total: 2000, today: 9800 },
  { name: "Thu", total: 2780, today: 3908 },
  { name: "Fri", total: 1890, today: 4800 },
  { name: "Sat", total: 2390, today: 3800 },
  { name: "Sun", total: 3490, today: 4300 },
];

// Custom Legend Component
const CustomLegend = ({ payload, hidden, setHidden }: any) => {
  if (!payload) return null;
  return (
    <ul className="flex flex-wrap gap-4">
      {payload.map((entry: any, index: number) => (
        <li
          key={`item-${index}`}
          onClick={() =>
            setHidden((prev: any) => ({
              ...prev,
              [entry.dataKey]: !prev[entry.dataKey],
            }))
          }
          className="cursor-pointer flex items-center gap-2"
        >
          <div
            className="w-4 h-3 rounded"
            style={{
              backgroundColor: entry.color,
              opacity: hidden[entry.dataKey] ? 0.3 : 1,
            }}
          />
          <span
            style={{
              textDecoration: hidden[entry.dataKey] ? "line-through" : "none",
              color: hidden[entry.dataKey] ? "#999" : "#333",
            }}
          >
            {entry.value}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default function DashboardCard() {
  const [hiddenEarning, setHiddenEarning] = useState<{ [key: string]: boolean }>({});

  return (
    <div className="w-full ">
      {/* Earnings Graph */}
      <div className="bg-white rounded-2xl shadow w-full">
        <div className="px-5 py-3  ">
          <h2 className="text-lg font-semibold text-red-800 mb-3">
            Earning Graph
          </h2>
        </div>
        <div className="p-4 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={earningsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" stroke="#555" />
              <YAxis stroke="#555" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  border: "1px solid #ddd",
                }}
              />
              <Legend
                content={(props) => (
                  <CustomLegend
                    {...props}
                    hidden={hiddenEarning}
                    setHidden={setHiddenEarning}
                  />
                )}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#ff6384"
                strokeWidth={2}
                activeDot={{ r: 6 }}
                name="Total Earning"
                hide={hiddenEarning["total"]}
              />
              <Line
                type="monotone"
                dataKey="today"
                stroke="#36a2eb"
                strokeWidth={2}
                activeDot={{ r: 6 }}
                name="Today Earning"
                hide={hiddenEarning["today"]}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
