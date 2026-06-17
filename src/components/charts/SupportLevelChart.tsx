"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { SupportLevel } from "@/types";

const COLORS: Record<SupportLevel, string> = {
  "On Track": "#10b981",
  Improving: "#3366ff",
  "Needs Support": "#f59e0b",
  "High Priority": "#ef4444",
};

export function SupportLevelChart({
  data,
}: {
  data: { level: SupportLevel; count: number }[];
}) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
      <div className="relative h-44 w-44 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="level"
              innerRadius={52}
              outerRadius={80}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((d) => (
                <Cell key={d.level} fill={COLORS[d.level]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                fontSize: 12,
              }}
              formatter={(v: number, n) => [`${v} students`, n]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold text-slate-900">{total}</span>
          <span className="text-xs text-slate-500">students</span>
        </div>
      </div>

      <ul className="grid w-full grid-cols-2 gap-3 sm:grid-cols-1">
        {data.map((d) => (
          <li key={d.level} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: COLORS[d.level] }}
            />
            <span className="text-slate-600">{d.level}</span>
            <span className="ml-auto font-medium text-slate-900">{d.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
