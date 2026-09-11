"use client";

import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export function StatusDonut({ projects = [] }: { projects?: any[] }) {
  const chartData = useMemo(() => {
    let active = 0, completed = 0, review = 0, delayed = 0;
    
    projects.forEach(p => {
      if (p.status === "قيد التنفيذ") active++;
      else if (p.status === "مكتمل") completed++;
      else if (p.status === "قيد المراجعة") review++;
      else if (p.status === "متأخر") delayed++;
    });

    // توزيع الألوان حسب التصميم
    return [
      { name: "قيد التنفيذ", value: active, color: "#3b82f6" },   // أزرق
      { name: "مكتمل", value: completed, color: "#10b981" },      // أخضر
      { name: "تحت المراجعة", value: review, color: "#f59e0b" },  // برتقالي
      { name: "متأخر", value: delayed, color: "#ef4444" },        // أحمر
    ].filter(d => d.value > 0); // إخفاء الحالات الفارغة
  }, [projects]);

  const total = projects.length;

  return (
    <div className="relative mx-auto h-[190px] w-[190px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            innerRadius={65}
            outerRadius={90}
            paddingAngle={5} // الفواصل البيضاء بين الألوان
            cornerRadius={5} // حواف دائرية
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-[#14161f] dark:text-white">{total}</span>
        <span className="text-xs text-[#8b8f9c]">مشروع</span>
      </div>
    </div>
  );
}