import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  iconClass,
  trend,
  hint,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconClass?: string;
  trend?: { value: string; positive?: boolean };
  hint?: string;
}) {
  return (
    <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-card-hover">
      <div className="flex items-start justify-between">
        <p className="text-[13px] font-medium text-slate-500">{label}</p>
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-inset ring-black/5 transition-transform group-hover:scale-105",
            iconClass ?? "bg-brand-50 text-brand-600",
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-3 text-[32px] font-semibold leading-none tracking-tight text-slate-900">
        {value}
      </p>
      <div className="mt-3 flex items-center gap-2 text-xs">
        {trend && (
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 font-semibold ring-1 ring-inset",
              trend.positive
                ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                : "bg-amber-50 text-amber-700 ring-amber-600/20",
            )}
          >
            {trend.value}
          </span>
        )}
        {hint && <span className="text-slate-400">{hint}</span>}
      </div>
    </div>
  );
}
