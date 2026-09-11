"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const MONTH_NAMES = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
];

export function ProgressChart({ projects = [] }: { projects: any[] }) {
  const [timeRange, setTimeRange] = useState("12M");

  const chartData = useMemo(() => {
    const counts = Array(12).fill(0);

    projects.forEach((p) => {
      const dateVal = p.createdAt || p.updatedAt;
      if (dateVal) {
        const date = new Date(dateVal);
        const monthIndex = date.getMonth();
        if (monthIndex >= 0 && monthIndex < 12) {
          counts[monthIndex] += 1;
        }
      }
    });

    const fullData = MONTH_NAMES.map((month, index) => ({
      month,
      value: counts[index],
    }));

    if (timeRange === "6M") return fullData.slice(6, 12);
    return fullData;
  }, [projects, timeRange]);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-4 flex w-full justify-start" dir="ltr">
        <div className="flex items-center gap-1 rounded-full border border-gray-100 bg-white p-1 shadow-sm dark:border-gray-800 dark:bg-[#111827]">
          {["6M", "12M", "All"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`rounded-full px-4 py-1 text-xs font-bold transition-all ${
                timeRange === range
                  ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                  : "text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              {range === "6M" ? "6M" : range === "12M" ? "12M" : "All"}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[240px] w-full" dir="rtl">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="progressFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 6" vertical={false} stroke="#eceef2" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "#8b8f9c", fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              reversed={true}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#8b8f9c", fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              orientation="left"
            />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: "1px solid #eceef2", fontSize: 12, direction: "rtl" }}
              labelStyle={{ fontWeight: 700, color: '#14161f' }}
              itemStyle={{ color: '#3b82f6', fontWeight: 700 }}
              formatter={(value: any) => [`${value} مشروع`, ""]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#progressFill)"
              name="المشاريع"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}