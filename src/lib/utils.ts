import type { SupportLevel, GoalStatus } from "@/types";

/** Tiny className combiner (avoids pulling in clsx for a prototype). */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Tailwind classes for a support-level badge. */
export const supportLevelStyles: Record<SupportLevel, string> = {
  "On Track": "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Improving: "bg-blue-50 text-blue-700 ring-blue-600/20",
  "Needs Support": "bg-amber-50 text-amber-700 ring-amber-600/20",
  "High Priority": "bg-rose-50 text-rose-700 ring-rose-600/20",
};

export const goalStatusStyles: Record<GoalStatus, string> = {
  "Not Started": "bg-slate-100 text-slate-600 ring-slate-500/20",
  "In Progress": "bg-blue-50 text-blue-700 ring-blue-600/20",
  Achieved: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
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
