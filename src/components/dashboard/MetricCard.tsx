import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CommandCard } from "./CommandCard";

type Accent = "blue" | "amber" | "cyan" | "emerald" | "violet";

const accentStyles: Record<Accent, { icon: string; badge: string; glow: string }> = {
  blue: {
    icon: "border-blue-400/20 bg-blue-500/10 text-blue-400",
    badge: "border-blue-400/20 bg-blue-500/10 text-blue-300",
    glow: "from-blue-500/15",
  },
  amber: {
    icon: "border-amber-400/20 bg-amber-500/10 text-amber-400",
    badge: "border-amber-400/20 bg-amber-500/10 text-amber-300",
    glow: "from-amber-500/15",
  },
  cyan: {
    icon: "border-cyan-400/20 bg-cyan-500/10 text-cyan-400",
    badge: "border-cyan-400/20 bg-cyan-500/10 text-cyan-300",
    glow: "from-cyan-500/15",
  },
  emerald: {
    icon: "border-emerald-400/20 bg-emerald-500/10 text-emerald-400",
    badge: "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
    glow: "from-emerald-500/15",
  },
  violet: {
    icon: "border-violet-400/20 bg-violet-500/10 text-violet-400",
    badge: "border-violet-400/20 bg-violet-500/10 text-violet-300",
    glow: "from-violet-500/15",
  },
};

export interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent: Accent;
  badge?: string;
  subtitle: string;
  secondarySubtitle?: string;
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  accent,
  badge,
  subtitle,
  secondarySubtitle,
}: MetricCardProps) {
  const styles = accentStyles[accent];
  return (
    <CommandCard className="group relative min-h-[150px] p-4 transition-transform duration-200 hover:-translate-y-0.5 hover:border-white/[0.13]">
      <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b to-transparent opacity-35", styles.glow)} />
      <div className="relative flex items-start justify-between gap-3">
        <p className="max-w-[145px] text-[11px] font-medium leading-4 text-slate-400">{label}</p>
        <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border", styles.icon)}>
          <Icon className="h-[17px] w-[17px]" />
        </span>
      </div>
      <div className="relative mt-3 flex items-end gap-2">
        <p className="text-[28px] font-semibold leading-none tracking-[-0.04em] text-white">{value}</p>
        {badge && (
          <span className={cn("mb-0.5 rounded-full border px-2 py-0.5 text-[9px] font-semibold", styles.badge)}>
            {badge}
          </span>
        )}
      </div>
      <p className="relative mt-3 text-[10px] text-slate-500">{subtitle}</p>
      {secondarySubtitle && <p className="relative mt-1 text-[10px] font-medium text-violet-300/80">{secondarySubtitle}</p>}
    </CommandCard>
  );
}
