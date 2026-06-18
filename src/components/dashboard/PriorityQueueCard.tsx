import Link from "next/link";
import { Info } from "lucide-react";
import { CommandCard, CommandCardHeader, PanelLink } from "./CommandCard";

const rows = [
  { initials: "BT", name: "Bruce Thompson", grade: 5, priority: "High", gap: "Fractions", mastery: 32, trend: "↓ 12%", color: "from-rose-500 to-orange-500" },
  { initials: "EB", name: "Elijah Brooks", grade: 4, priority: "High", gap: "Decoding & Word Attack", mastery: 38, trend: "↓ 8%", color: "from-violet-500 to-fuchsia-500" },
  { initials: "MS", name: "Maya Singh", grade: 3, priority: "Medium", gap: "Multi-digit Addition", mastery: 58, trend: "↓ 5%", color: "from-cyan-500 to-blue-500" },
  { initials: "JT", name: "James Taylor", grade: 2, priority: "Medium", gap: "Sight Words", mastery: 62, trend: "↓ 3%", color: "from-amber-500 to-orange-500" },
  { initials: "OW", name: "Olivia Walker", grade: 5, priority: "Low", gap: "Reading Comprehension", mastery: 78, trend: "↑ 4%", color: "from-emerald-500 to-cyan-500" },
] as const;

const priorityStyles = {
  High: "border-rose-400/20 bg-rose-500/10 text-rose-300",
  Medium: "border-amber-400/20 bg-amber-500/10 text-amber-300",
  Low: "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
};

export function PriorityQueueCard() {
  return (
    <CommandCard>
      <CommandCardHeader
        title="AI Priority Queue"
        subtitle="Students who need your attention most"
        action={<Link href="/students"><PanelLink>View all →</PanelLink></Link>}
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left">
          <thead>
            <tr className="border-b border-white/[0.055] text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-600">
              <th className="px-5 py-3">Student</th><th className="px-3 py-3">Grade</th><th className="px-3 py-3">Priority</th><th className="px-3 py-3">Top gap</th><th className="px-5 py-3 text-right">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {rows.map((row) => (
              <tr key={row.initials} className="group transition-colors hover:bg-white/[0.025]">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${row.color} text-[10px] font-bold text-white shadow-lg`}>{row.initials}</span>
                    <span className="text-xs font-medium text-slate-200">{row.name}</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-xs text-slate-500">Grade {row.grade}</td>
                <td className="px-3 py-3"><span className={`rounded-full border px-2 py-1 text-[9px] font-semibold ${priorityStyles[row.priority]}`}>{row.priority}</span></td>
                <td className="px-3 py-3"><p className="text-xs text-slate-300">{row.gap}</p><p className="mt-0.5 text-[10px] text-slate-600">Mastery {row.mastery}%</p></td>
                <td className={`px-5 py-3 text-right text-xs font-semibold ${row.trend.startsWith("↑") ? "text-emerald-400" : "text-rose-400"}`}>{row.trend}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-2 border-t border-white/[0.055] px-5 py-3 text-[10px] text-slate-600">
        <Info className="h-3.5 w-3.5 text-blue-400" /> Priority is based on recent sessions, skill gaps, and mastery trends.
      </div>
    </CommandCard>
  );
}
