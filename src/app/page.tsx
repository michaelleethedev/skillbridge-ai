import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  FileText,
  GraduationCap,
  Sparkles,
  Users,
} from "lucide-react";

const stack = ["Next.js", "TypeScript", "Tailwind CSS", "Recharts", "Mock AI APIs", "localStorage demo state"];

const workflows = [
  { icon: Users, label: "Select a student", text: "Open a fictional learner profile with realistic skills, sessions, and goals." },
  { icon: CalendarCheck, label: "Log a session", text: "Capture notes, score performance, and update the student timeline instantly." },
  { icon: Sparkles, label: "Analyze the gap", text: "Turn tutor notes into evidence, priority, causes, and next actions." },
  { icon: ClipboardList, label: "Generate a plan", text: "Create a structured practice plan and save it back to the demo workspace." },
  { icon: FileText, label: "Build a report", text: "Draft parent or administrator summaries from current student data." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#070b14] text-slate-100">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-lg shadow-blue-600/20">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <p className="text-base font-bold tracking-tight text-white">SkillBridge AI</p>
            <p className="text-xs text-slate-500">Portfolio demo with fictional data</p>
          </div>
        </div>
        <Link
          href="/demo"
          className="hidden rounded-lg border border-white/10 bg-white/[0.045] px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08] sm:inline-flex"
        >
          Launch Demo
        </Link>
      </header>

      <main>
        <section className="relative mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-10 pt-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_520px] lg:px-8">
          <div className="absolute inset-x-0 top-12 -z-0 h-64 bg-[radial-gradient(circle_at_35%_20%,rgba(59,130,246,.24),transparent_36%),radial-gradient(circle_at_70%_5%,rgba(20,184,166,.16),transparent_32%)]" />

          <div className="relative z-10 max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-300">
              <BrainCircuit className="h-3.5 w-3.5" />
              Interactive EdTech SaaS Demo
            </div>
            <h1 className="max-w-4xl text-4xl font-semibold leading-[1.03] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Tutor progress tracking, AI gap analysis, and parent-ready reports in one swift workspace.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              SkillBridge AI helps tutors, teachers, program leads, and administrators understand student progress quickly, turn session notes into action, and keep families informed without spreadsheet sprawl.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/demo"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:brightness-110"
              >
                Launch Interactive Demo
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/students/stu-bruce?tour=1"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.045] px-5 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/[0.075]"
              >
                Start Guided Tour
              </Link>
            </div>

            <div className="mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                ["10", "fictional students"],
                ["3", "demo roles"],
                ["5 min", "core workflow"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-4">
                  <p className="text-2xl font-semibold text-white">{value}</p>
                  <p className="mt-1 text-xs text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <div className="rounded-2xl border border-white/[0.08] bg-[#0d1422] p-4 shadow-[0_24px_80px_-36px_rgba(37,99,235,.6)]">
              <div className="flex items-center justify-between border-b border-white/[0.07] pb-3">
                <div>
                  <p className="text-sm font-semibold text-white">Demo workflow</p>
                  <p className="text-xs text-slate-500">Click through the same path a tutor would use.</p>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">Live state</span>
              </div>
              <div className="mt-4 space-y-3">
                {workflows.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] p-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-300">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-100">
                          {index + 1}. {item.label}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">{item.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/[0.07] bg-white/[0.025]">
          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
            {[
              ["The problem", "Tutoring programs lose insight when notes, progress, and reporting live in separate tools."],
              ["The users", "Tutors, teachers, program leads, and administrators who need fast, shared visibility."],
              ["The AI assist", "Gap analysis, practice plans, and progress summaries are mocked but shaped like production workflows."],
            ].map(([title, text]) => (
              <div key={title}>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-cyan-300">
                <BarChart3 className="h-4 w-4" />
                Technology stack
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Built as a recruiter-friendly product demo.</h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              No account or payment required
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {stack.map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-slate-300">
                {item}
              </span>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
