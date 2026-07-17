"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  FileText,
  PlayCircle,
  Sparkles,
  UserRoundSearch,
  Users,
} from "lucide-react";
import { useDemo, type DemoRole } from "@/components/demo/DemoProvider";
import { cn } from "@/lib/utils";

const roleActions: Record<
  DemoRole,
  Array<{ title: string; text: string; href: string; icon: typeof Users; label: string }>
> = {
  Tutor: [
    { title: "Open Bruce's profile", text: "Review progress, gaps, sessions, and skill mastery controls.", href: "/students/stu-bruce?tour=1", icon: UserRoundSearch, label: "Student workspace" },
    { title: "Log a session", text: "Save a tutoring note and watch dashboard metrics update.", href: "/sessions", icon: CalendarCheck, label: "Session workflow" },
    { title: "Create a practice plan", text: "Generate, save, and start a session from a plan.", href: "/practice-plans?student=stu-bruce", icon: ClipboardList, label: "AI plan" },
  ],
  "Program Lead": [
    { title: "Review support queue", text: "Sort by lowest progress and identify students needing support.", href: "/students", icon: Users, label: "Roster" },
    { title: "Analyze program gaps", text: "Run AI analysis against notes and save it to history.", href: "/ai-reports?student=stu-bruce", icon: Sparkles, label: "AI insights" },
    { title: "Build summary report", text: "Create an administrator or program-level update.", href: "/reports", icon: BarChart3, label: "Reporting" },
  ],
  Administrator: [
    { title: "Check live metrics", text: "See totals, support counts, saved AI outputs, and report activity.", href: "/demo", icon: BarChart3, label: "Dashboard" },
    { title: "Generate admin report", text: "Create a professional summary from demo data.", href: "/reports", icon: FileText, label: "Reports" },
    { title: "Review settings", text: "Show mocked integrations, AI status, and data readiness.", href: "/settings", icon: CheckCircle2, label: "Readiness" },
  ],
};

const tourSteps = [
  { title: "Launch demo", href: "/demo", icon: PlayCircle },
  { title: "Pick a student", href: "/students/stu-bruce?tour=1", icon: UserRoundSearch },
  { title: "Log session", href: "/sessions", icon: CalendarCheck },
  { title: "Analyze gap", href: "/ai-reports?student=stu-bruce", icon: Sparkles },
  { title: "Generate plan", href: "/practice-plans?student=stu-bruce", icon: ClipboardList },
  { title: "Build report", href: "/reports", icon: FileText },
];

const STORAGE_KEY = "skillbridge-demo-tour-progress-v1";

export function DemoWorkflowPanel() {
  const { role, dashboardStats } = useDemo();
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) setDone(JSON.parse(stored));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
  }, [done]);

  const percent = Math.round((done.length / tourSteps.length) * 100);
  const nextStep = useMemo(() => tourSteps.find((step) => !done.includes(step.title)) ?? tourSteps[0], [done]);

  const toggle = (title: string) => {
    setDone((current) => (current.includes(title) ? current.filter((item) => item !== title) : [...current, title]));
  };

  return (
    <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,.85fr)]">
      <div className="rounded-2xl border border-white/[0.08] bg-[#0d1422] shadow-[0_18px_50px_-32px_rgba(37,99,235,.35),inset_0_1px_0_rgba(255,255,255,.035)]">
        <div className="flex flex-col gap-4 border-b border-white/[0.065] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Guided portfolio walkthrough</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">A recruiter can follow these steps and understand the product value in a few minutes.</p>
          </div>
          <Link href={nextStep.href} className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white transition hover:bg-blue-500">
            Continue tour
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="p-5">
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-400">Tour progress</span>
              <span className="font-semibold text-cyan-300">{percent}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all" style={{ width: `${percent}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {tourSteps.map((step, index) => {
              const Icon = step.icon;
              const active = done.includes(step.title);
              return (
                <div key={step.title} className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => toggle(step.title)}
                      className={cn(
                        "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs font-bold transition",
                        active ? "border-emerald-400/20 bg-emerald-500/15 text-emerald-300" : "border-white/10 bg-white/[0.04] text-slate-500 hover:text-white",
                      )}
                      aria-label={`Mark ${step.title} as ${active ? "not done" : "done"}`}
                    >
                      {active ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                    </button>
                    <div className="min-w-0">
                      <Link href={step.href} className="flex items-center gap-1.5 text-sm font-semibold text-slate-100 hover:text-cyan-300">
                        <Icon className="h-4 w-4 text-blue-300" />
                        {step.title}
                      </Link>
                      <p className="mt-1 text-xs text-slate-600">Click, complete, then mark done.</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-[#0d1422] shadow-[0_18px_50px_-32px_rgba(37,99,235,.35),inset_0_1px_0_rgba(255,255,255,.035)]">
        <div className="border-b border-white/[0.065] px-5 py-4">
          <p className="text-sm font-semibold text-white">{role} quick actions</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Role-specific paths make the demo easy to present live.
          </p>
        </div>
        <div className="space-y-3 p-5">
          {roleActions[role].map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className="group block rounded-xl border border-white/[0.07] bg-white/[0.025] p-3 transition hover:border-blue-400/20 hover:bg-blue-500/[0.055]"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-300">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-100 group-hover:text-white">{action.title}</p>
                      <span className="rounded-full border border-white/10 bg-white/[0.035] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                        {action.label}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{action.text}</p>
                  </div>
                </div>
              </Link>
            );
          })}
          <div className="grid grid-cols-3 gap-2 border-t border-white/[0.06] pt-3">
            <MiniStat label="Students" value={dashboardStats.totalStudents} />
            <MiniStat label="Sessions" value={dashboardStats.sessionsThisWeek} />
            <MiniStat label="Outputs" value={dashboardStats.reportsGenerated + dashboardStats.activePlans} />
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
      <p className="text-lg font-semibold text-white">{value}</p>
      <p className="text-[10px] text-slate-600">{label}</p>
    </div>
  );
}
