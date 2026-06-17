"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const colorFor = (v: number) =>
  v >= 80 ? "#10b981" : v >= 65 ? "#3366ff" : v >= 50 ? "#f59e0b" : "#ef4444";

export function MasteryBySubjectChart({
  data,
}: {
  data: { subject: string; mastery: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f6" />
        <XAxis
          dataKey="subject"
          tick={{ fontSize: 12, fill: "#64748b" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 12, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          unit="%"
        />
        <Tooltip
          cursor={{ fill: "#f1f5f9" }}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid #e2e8f0",
            fontSize: 12,
            boxShadow: "0 8px 24px -6px rgb(16 24 40 / 0.12)",
          }}
          formatter={(v: number) => [`${v}%`, "Avg mastery"]}
        />
        <Bar dataKey="mastery" radius={[6, 6, 0, 0]} maxBarSize={56}>
          {data.map((d) => (
            <Cell key={d.subject} fill={colorFor(d.mastery)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
