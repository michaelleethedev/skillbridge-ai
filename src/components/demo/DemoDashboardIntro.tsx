"use client";

import Link from "next/link";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { useDemo, type DemoRole } from "@/components/demo/DemoProvider";
import { cn } from "@/lib/utils";

const roleCopy: Record<DemoRole, { headline: string; focus: string; cta: string; href: string }> = {
  Tutor: {
    headline: "Tutor view",
    focus: "Assigned students, upcoming sessions, learning gaps, practice plans, and parent updates.",
    cta: "Open a student workspace",
    href: "/students/stu-bruce?tour=1",
  },
  "Program Lead": {
    headline: "Program lead view",
    focus: "Program-wide progress, students needing support, tutor activity, and skill trends.",
    cta: "Review student roster",
    href: "/students",
  },
  Administrator: {
    headline: "Administrator view",
    focus: "Performance totals, engagement metrics, report history, data management, and settings.",
    cta: "Build a report",
    href: "/reports",
  },
};

export function RoleSwitcher({ compact = false }: { compact?: boolean }) {
  const { role, setRole } = useDemo();
  const roles: DemoRole[] = ["Tutor", "Program Lead", "Administrator"];

  return (
    <div className={cn("flex rounded-xl border border-white/10 bg-white/[0.045] p-1", compact && "rounded-lg")}>
      {roles.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setRole(item)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
            role === item ? "bg-blue-500 text-white shadow-sm" : "text-slate-400 hover:bg-white/[0.06] hover:text-white",
            compact && "px-2 py-1 text-[11px]",
          )}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export function DemoDashboardIntro() {
  const { role, dashboardStats, activity, resetDemo } = useDemo();
  const copy = roleCopy[role];

  return (
    <section className="rounded-2xl border border-blue-400/15 bg-gradient-to-br from-blue-500/10 via-[#101827] to-[#0d1422] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.04)] sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 ring-1 ring-emerald-400/15">
              <Sparkles className="h-3 w-3" />
              Portfolio demo
            </span>
            <span className="text-xs text-slate-500">All student data is fictional and saved locally in this browser.</span>
          </div>
          <h2 className="text-xl font-semibold text-white">{copy.headline}</h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-400">{copy.focus}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <RoleSwitcher />
          <button
            type="button"
            onClick={resetDemo}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.07] hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ["Students", dashboardStats.totalStudents],
          ["Need support", dashboardStats.needingSupport],
          ["Sessions", dashboardStats.sessionsThisWeek],
          ["Saved outputs", dashboardStats.reportsGenerated + dashboardStats.activePlans],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-white/[0.07] bg-white/[0.035] p-3">
            <p className="text-lg font-semibold text-white">{value}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-white/[0.07] pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          Latest activity: <span className="text-slate-300">{activity[0]?.label ?? "Demo ready"}</span>
        </p>
        <Link href={copy.href} className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200">
          {copy.cta}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
