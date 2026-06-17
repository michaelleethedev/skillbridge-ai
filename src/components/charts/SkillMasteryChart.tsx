"use client";

import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const colorFor = (v: number) =>
  v >= 80 ? "#10b981" : v >= 65 ? "#3366ff" : v >= 50 ? "#f59e0b" : "#ef4444";

export function SkillMasteryChart({
  data,
}: {
  data: { name: string; mastery: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(180, data.length * 52)}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 40, left: 8, bottom: 4 }}
      >
        <XAxis type="number" domain={[0, 100]} hide />
        <YAxis
          type="category"
          dataKey="name"
          width={150}
          tick={{ fontSize: 12, fill: "#475569" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "#f8fafc" }}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid #e2e8f0",
            fontSize: 12,
          }}
          formatter={(v: number) => [`${v}%`, "Mastery"]}
        />
        <Bar dataKey="mastery" radius={[0, 6, 6, 0]} maxBarSize={22}>
          {data.map((d) => (
            <Cell key={d.name} fill={colorFor(d.mastery)} />
          ))}
          <LabelList
            dataKey="mastery"
            position="right"
            formatter={(v: number) => `${v}%`}
            style={{ fontSize: 12, fill: "#64748b", fontWeight: 600 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
