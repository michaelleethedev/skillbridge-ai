import Link from "next/link";
import { Info } from "lucide-react";
import { CommandCard, CommandCardHeader, PanelLink } from "./CommandCard";

const points = [
  { label: "OW", x: 26, y: 28, color: "bg-emerald-400", ring: "ring-emerald-400/20" },
  { label: "MS", x: 72, y: 22, color: "bg-cyan-400", ring: "ring-cyan-400/20" },
  { label: "EB", x: 78, y: 70, color: "bg-rose-400", ring: "ring-rose-400/20" },
  { label: "BT", x: 32, y: 82, color: "bg-rose-400", ring: "ring-rose-400/20" },
  { label: "JT", x: 64, y: 61, color: "bg-amber-400", ring: "ring-amber-400/20" },
  { label: "CR", x: 43, y: 38, color: "bg-violet-400", ring: "ring-violet-400/20" },
  { label: "AL", x: 87, y: 34, color: "bg-emerald-400", ring: "ring-emerald-400/20" },
  { label: "LM", x: 18, y: 65, color: "bg-amber-400", ring: "ring-amber-400/20" },
  { label: "SD", x: 54, y: 52, color: "bg-cyan-400", ring: "ring-cyan-400/20" },
];

export function AttentionMatrixCard() {
  return (
    <CommandCard>
      <CommandCardHeader title="Student Attention Matrix" subtitle="Performance vs. Engagement" action={<Link href="/students"><PanelLink>View students</PanelLink></Link>} />
      <div className="p-5">
        <div className="relative ml-8 h-[300px] rounded-xl border border-white/[0.07] bg-[#09101c]">
          <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-white/[0.09]" />
          <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-white/[0.09]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.022)_1px,transparent_1px)] bg-[size:25%_25%]" />
          <p className="absolute left-3 top-3 text-[9px] font-medium text-slate-600">High Performance / Low Engagement</p>
          <p className="absolute right-3 top-3 text-right text-[9px] font-medium text-slate-600">High Performance / High Engagement</p>
          <p className="absolute bottom-3 left-3 text-[9px] font-medium text-slate-600">Low Performance / Low Engagement</p>
          <p className="absolute bottom-3 right-3 text-right text-[9px] font-medium text-slate-600">Low Performance / High Engagement</p>
          {points.map((point) => (
            <span key={point.label} style={{ left: `${point.x}%`, top: `${point.y}%` }} className={`absolute z-10 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full ${point.color} text-[9px] font-bold text-slate-950 shadow-lg ring-4 ${point.ring}`}>{point.label}</span>
          ))}
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-medium text-slate-600">Engagement (Sessions / Week) →</span>
          <span className="absolute -left-[86px] top-1/2 -rotate-90 text-[9px] font-medium text-slate-600">Performance (Mastery %) →</span>
        </div>
        <div className="mt-9 flex flex-wrap gap-x-4 gap-y-2">
          {[ ["bg-emerald-400", "High Performance"], ["bg-rose-400", "At Risk"], ["bg-amber-400", "Low Performance"], ["bg-cyan-400", "Strong Engagement"], ["bg-violet-400", "Low Engagement"] ].map(([color, label]) => <span key={label} className="flex items-center gap-1.5 text-[9px] text-slate-500"><i className={`h-1.5 w-1.5 rounded-full ${color}`} />{label}</span>)}
        </div>
        <p className="mt-4 flex items-center gap-2 border-t border-white/[0.05] pt-3 text-[10px] text-slate-600"><Info className="h-3.5 w-3.5 text-cyan-400" />Use this matrix to balance support for at-risk and high-potential students.</p>
      </div>
    </CommandCard>
  );
}
