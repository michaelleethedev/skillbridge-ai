import type { SupportLevel, GoalStatus } from "@/types";

/** Tiny className combiner (avoids pulling in clsx for a prototype). */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Tailwind classes for a support-level badge. */
export const supportLevelStyles: Record<SupportLevel, string> = {
  "On Track": "bg-emerald-500/10 text-emerald-300 ring-emerald-400/20",
  Improving: "bg-blue-500/10 text-blue-300 ring-blue-400/20",
  "Needs Support": "bg-amber-500/10 text-amber-300 ring-amber-400/20",
  "High Priority": "bg-rose-500/10 text-rose-300 ring-rose-400/20",
};

export const goalStatusStyles: Record<GoalStatus, string> = {
  "Not Started": "bg-white/[0.06] text-slate-400 ring-white/10",
  "In Progress": "bg-blue-500/10 text-blue-300 ring-blue-400/20",
  Achieved: "bg-emerald-500/10 text-emerald-300 ring-emerald-400/20",
};

/** Color for a mastery percentage (text + bar). */
export function masteryColor(value: number): string {
  if (value >= 80) return "text-emerald-600";
  if (value >= 65) return "text-blue-600";
  if (value >= 50) return "text-amber-600";
  return "text-rose-600";
}

export function masteryBarColor(value: number): string {
  if (value >= 80) return "bg-emerald-500";
  if (value >= 65) return "bg-blue-500";
  if (value >= 50) return "bg-amber-500";
  return "bg-rose-500";
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
