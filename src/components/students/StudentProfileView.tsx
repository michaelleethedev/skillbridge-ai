"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Sparkles,
  FileText,
  Download,
  Copy,
  Check,
  RefreshCw,
  Target,
  ThumbsUp,
  TriangleAlert,
  Mail,
  CalendarDays,
  CalendarClock,
  Clock,
  Flame,
  BookOpen,
  PencilLine,
  ClipboardCheck,
  ArrowRight,
  Home,
  Flag,
  TrendingUp,
  TrendingDown,
  Minus,
  Loader2,
} from "lucide-react";
import type { Goal, Session, Student, Subject } from "@/types";
import type { GapAnalysis, ProfilePracticePlan, StudentOverview, StudentSummary } from "@/data";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { SupportLevelBadge } from "@/components/ui/SupportLevelBadge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Modal } from "@/components/ui/Modal";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { SkillMasteryChart } from "@/components/charts/SkillMasteryChart";
import { cn, masteryColor, formatDate, formatShortDate, goalStatusStyles } from "@/lib/utils";

const SUBJECTS: Subject[] = ["Reading", "Math", "Writing", "Phonics", "Science"];

interface SkillRow {
  name: string;
  mastery: number;
  previousMastery: number;
}

export interface StudentProfileViewProps {
  student: Student;
  skills: SkillRow[];
  sessions: Session[];
  goals: Goal[];
  overview: StudentOverview;
  gap: GapAnalysis | null;
  plan: ProfilePracticePlan | null;
  summary: StudentSummary | null;
  tutorName: string;
}

export function StudentProfileView({
  student,
  skills,
  sessions: initialSessions,
  goals,
  overview,
  gap,
  plan,
  summary,
  tutorName,
}: StudentProfileViewProps) {
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [addOpen, setAddOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const chartData = useMemo(
    () => skills.map((s) => ({ name: s.name, mastery: s.mastery })),
    [skills],
  );

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2400);
  };

  const summaryText = useMemo(() => {
    if (!summary) return "";
    return [
      `Student progress summary — ${student.firstName} ${student.lastName} (Grade ${student.grade}, ${student.subjectFocus})`,
      "",
      `Strengths: ${summary.strengths.join(", ")}`,
      `Needs support: ${summary.needsSupport.join(", ")}`,
      "",
      `Recent progress: ${summary.recentProgress}`,
      "",
      `Home practice: ${summary.recommendedHomePractice.join(" ")}`,
      `Next steps: ${summary.nextSteps.join(" ")}`,
    ].join("\n");
  }, [summary, student]);

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      flash("Copy is unavailable in this browser.");
    }
  };

  const regenerate = () => {
    setRegenerating(true);
    window.setTimeout(() => {
      setRegenerating(false);
      flash("Summary regenerated from the latest session data.");
    }, 900);
  };

  const handleAddSession = (s: Session) => {
    setSessions((prev) => [s, ...prev]);
    setAddOpen(false);
    flash("Session added to the timeline.");
  };

  return (
    <>
      <Link
        href="/students"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to students
      </Link>

      {/* Profile header */}
      <Card className="overflow-hidden">
        <div className="h-1.5 w-full bg-brand-gradient" />
        <div className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center">
          <Avatar initials={initials(student)} color={student.avatarColor} size="lg" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                {student.firstName} {student.lastName}
              </h1>
              <SupportLevelBadge level={student.supportLevel} />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                Grade {student.grade} · {student.subjectFocus}
              </span>
              <span className="text-slate-300">|</span>
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                {student.guardianName}
              </span>
              <span className="text-slate-300">|</span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarClock className="h-3.5 w-3.5 text-slate-400" />
                Last session {formatShortDate(student.lastSessionOn)}
              </span>
              <span className="text-slate-300">|</span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                Enrolled {formatDate(student.enrolledOn)}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
            <div className="flex items-center gap-3 lg:flex-col lg:items-end lg:gap-0">
              <p className="text-xs text-slate-500">Avg. mastery</p>
              <p className={cn("text-3xl font-semibold leading-none", masteryColor(student.averageMastery))}>
                {student.averageMastery}%
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => setAddOpen(true)}>
                <Plus className="h-4 w-4" />
                Add Session
              </Button>
              <Link href={`/ai-reports?student=${student.id}`}>
                <Button variant="secondary" size="sm">
                  <Sparkles className="h-4 w-4" />
                  Generate AI Report
                </Button>
              </Link>
              <Button variant="secondary" size="sm" onClick={() => flash("Summary exported (demo).")}>
                <Download className="h-4 w-4" />
                Export Summary
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Overview cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <OverviewCard
          icon={<Target className="h-5 w-5" />}
          iconClass="bg-brand-50 text-brand-600"
          label="Current mastery"
          value={`${overview.mastery}%`}
          hint="Across tracked skills"
        />
        <OverviewCard
          icon={<CalendarClock className="h-5 w-5" />}
          iconClass="bg-blue-50 text-blue-600"
          label="Sessions completed"
          value={sessions.length}
          hint="On record"
        />
        <OverviewCard
          icon={<TriangleAlert className="h-5 w-5" />}
          iconClass="bg-amber-50 text-amber-600"
          label="Main learning gap"
          value={overview.mainGap}
          small
        />
        <OverviewCard
          icon={<Sparkles className="h-5 w-5" />}
          iconClass="bg-emerald-50 text-emerald-600"
          label="Recommended next step"
          value={overview.nextStep}
          small
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-4 lg:col-span-2">
          {/* Skill mastery */}
          <Card>
            <CardHeader
              title="Skill mastery"
              subtitle="Current mastery and change since the last assessment"
            />
            <CardBody>
              <SkillMasteryChart data={chartData} />
              <div className="mt-4 grid grid-cols-1 gap-2 border-t border-slate-100 pt-4 sm:grid-cols-2">
                {skills.map((s) => {
                  const delta = s.mastery - s.previousMastery;
                  return (
                    <div key={s.name} className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5">
                      <span className="truncate text-sm text-slate-600">{s.name}</span>
                      <span className="flex items-center gap-2">
                        <span className={cn("text-sm font-semibold tabular-nums", masteryColor(s.mastery))}>
                          {s.mastery}%
                        </span>
                        <DeltaPill delta={delta} />
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>

          {/* AI Learning Gap Summary */}
          {gap && (
            <Card className="overflow-hidden ring-1 ring-brand-100">
              <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-brand-50 to-white px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">AI Learning Gap Summary</h3>
                    <p className="text-[11px] text-slate-500">
                      {gap.generated ? "Generated" : "Analyzed"} {formatShortDate(gap.createdOn)} from session notes &amp; skill data
                    </p>
                  </div>
                </div>
                <Badge className="bg-emerald-50 text-emerald-700 ring-emerald-600/20">
                  {gap.confidence}% confidence
                </Badge>
              </div>
              <CardBody className="space-y-4">
                <GapBlock label="Detected gap" tone="rose" text={gap.detectedGap} />
                <GapBlock label="Likely cause" tone="slate" text={gap.likelyCause} />
                <GapBlock label="Evidence from recent sessions" tone="slate" text={gap.evidence} />
                <GapBlock label="Recommended next step" tone="brand" text={gap.recommendedNextStep} />
              </CardBody>
            </Card>
          )}

          {/* Recent sessions */}
          <Card>
            <CardHeader
              title="Recent sessions"
              subtitle={`${sessions.length} session${sessions.length === 1 ? "" : "s"} on record`}
              action={
                <button
                  onClick={() => setAddOpen(true)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </button>
              }
            />
            <CardBody className="space-y-0">
              <ol className="relative space-y-5 before:absolute before:left-[7px] before:top-1 before:h-full before:w-px before:bg-slate-200">
                {sessions.map((s) => (
                  <li key={s.id} className="relative pl-7">
                    <span
                      className={cn(
                        "absolute left-0 top-1 h-3.5 w-3.5 rounded-full border-2 border-white ring-2",
                        s.performanceScore >= 80
                          ? "bg-emerald-500 ring-emerald-200"
                          : s.performanceScore >= 50
                            ? "bg-amber-500 ring-amber-200"
                            : "bg-rose-500 ring-rose-200",
                      )}
                    />
                    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-slate-100 text-slate-600 ring-slate-500/20">{s.subject}</Badge>
                          <span className="text-sm font-medium text-slate-900">{s.skillFocus}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={cn("text-sm font-semibold tabular-nums", masteryColor(s.performanceScore))}>
                            {s.performanceScore}%
                          </span>
                          <span className="text-xs text-slate-400">{formatShortDate(s.date)}</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.notes}</p>
                      <p className="mt-2 flex items-start gap-1.5 text-xs text-slate-500">
                        <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" />
                        <span>
                          <span className="font-medium text-slate-600">Next step:</span> {s.nextSteps}
                        </span>
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </CardBody>
          </Card>

          {/* AI Practice Plan */}
          {plan && (
            <Card className="overflow-hidden ring-1 ring-brand-100">
              <div className="flex flex-wrap items-center justify-between gap-2 bg-gradient-to-r from-brand-50 to-white px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white">
                    <ClipboardCheck className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">AI Practice Plan</h3>
                    <p className="text-[11px] text-slate-500">Focus: {plan.skillFocus}</p>
                  </div>
                </div>
                <Badge className="bg-brand-50 text-brand-700 ring-brand-600/20">
                  <Clock className="h-3 w-3" />
                  {plan.estimatedTime}
                </Badge>
              </div>
              <CardBody className="space-y-3">
                <PlanStep icon={<Flame className="h-4 w-4" />} label="Warm-up" text={plan.warmUp} time="5 min" />
                <PlanStep icon={<BookOpen className="h-4 w-4" />} label="Guided practice" text={plan.guidedPractice} time="12 min" />
                <PlanStep icon={<PencilLine className="h-4 w-4" />} label="Independent practice" text={plan.independentPractice} time="10 min" />
                <PlanStep icon={<ClipboardCheck className="h-4 w-4" />} label="Exit ticket" text={plan.exitTicket} time="3 min" />
                <div className="flex items-start gap-2 rounded-xl border border-brand-100 bg-brand-50/50 p-3.5">
                  <Flag className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold text-brand-700">Next session focus:</span> {plan.nextSessionFocus}
                  </p>
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Strengths & needs */}
          <Card>
            <CardHeader title="Strengths & needs" />
            <CardBody className="space-y-4">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-600">
                  <ThumbsUp className="h-3.5 w-3.5" />
                  Strengths
                </p>
                <ul className="mt-2 space-y-1.5">
                  {student.strengths.length ? (
                    student.strengths.map((s) => (
                      <li key={s} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                        {s}
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-slate-400">Not yet assessed.</li>
                  )}
                </ul>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-600">
                  <TriangleAlert className="h-3.5 w-3.5" />
                  Needs support
                </p>
                <ul className="mt-2 space-y-1.5">
                  {student.needsSupport.length ? (
                    student.needsSupport.map((s) => (
                      <li key={s} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                        {s}
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-slate-400">Not yet assessed.</li>
                  )}
                </ul>
              </div>
            </CardBody>
          </Card>

          {/* Learning goals */}
          <Card>
            <CardHeader
              title={
                <span className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-slate-400" />
                  Learning goals
                </span>
              }
            />
            <CardBody className="space-y-4">
              {goals.length ? (
                goals.map((g) => (
                  <div key={g.id}>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-slate-800">{g.title}</p>
                      <Badge className={goalStatusStyles[g.status]}>{g.status}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{g.description}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <ProgressBar value={g.progress} className="flex-1" />
                      <span className="text-xs font-medium text-slate-500">{g.progress}%</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400">No goals set yet.</p>
              )}
            </CardBody>
          </Card>

          {/* Parent / admin summary */}
          {summary && (
            <Card className="overflow-hidden">
              <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-brand-50 to-white px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white">
                    <FileText className="h-4 w-4" />
                  </span>
                  <h3 className="text-sm font-semibold text-slate-900">Parent / Admin Summary</h3>
                </div>
                {regenerating && <Loader2 className="h-4 w-4 animate-spin text-brand-500" />}
              </div>
              <CardBody className="space-y-3.5 text-sm">
                <SummaryList label="Strengths" items={summary.strengths} dot="bg-emerald-500" />
                <SummaryList label="Needs support" items={summary.needsSupport} dot="bg-amber-500" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Recent progress</p>
                  <p className="mt-1 leading-relaxed text-slate-600">{summary.recentProgress}</p>
                </div>
                <SummaryList label="Recommended home practice" items={summary.recommendedHomePractice} dot="bg-brand-500" icon={<Home className="h-3.5 w-3.5 text-brand-500" />} />
                <SummaryList label="Next steps" items={summary.nextSteps} dot="bg-slate-400" />

                <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3.5">
                  <Button size="sm" variant="secondary" onClick={copySummary}>
                    {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied" : "Copy Summary"}
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => flash("PDF download is a demo placeholder.")}>
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button size="sm" variant="secondary" onClick={regenerate} disabled={regenerating}>
                    {regenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                    Regenerate
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>

      <AddSessionModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        student={student}
        tutorName={tutorName}
        onAdd={handleAddSession}
      />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-card-hover">
          <Check className="h-4 w-4 text-emerald-600" />
          {toast}
        </div>
      )}
    </>
  );
}

/* ----------------------------- helper bits ----------------------------- */

function initials(s: { firstName: string; lastName: string }) {
  return `${s.firstName[0] ?? ""}${s.lastName[0] ?? ""}`.toUpperCase();
}

function OverviewCard({
  icon,
  iconClass,
  label,
  value,
  hint,
  small,
}: {
  icon: React.ReactNode;
  iconClass: string;
  label: string;
  value: string | number;
  hint?: string;
  small?: boolean;
}) {
  return (
    <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[13px] font-medium text-slate-500">{label}</p>
        <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl ring-1 ring-inset ring-black/5", iconClass)}>
          {icon}
        </span>
      </div>
      <p className={cn("mt-3 font-semibold leading-tight tracking-tight text-slate-900", small ? "text-base" : "text-[30px] leading-none")}>
        {value}
      </p>
      {hint && <p className="mt-2 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

function DeltaPill({ delta }: { delta: number }) {
  if (delta === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
        <Minus className="h-3 w-3" />0
      </span>
    );
  }
  const up = delta > 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
        up ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700",
      )}
    >
      {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {up ? "+" : ""}
      {delta}
    </span>
  );
}

function GapBlock({
  label,
  text,
  tone,
}: {
  label: string;
  text: string;
  tone: "rose" | "brand" | "slate";
}) {
  const toneClass =
    tone === "rose"
      ? "text-rose-600"
      : tone === "brand"
        ? "text-brand-600"
        : "text-slate-400";
  return (
    <div>
      <p className={cn("text-xs font-semibold uppercase tracking-wide", toneClass)}>{label}</p>
      <p className="mt-1 text-sm leading-relaxed text-slate-700">{text}</p>
    </div>
  );
}

function PlanStep({
  icon,
  label,
  text,
  time,
}: {
  icon: React.ReactNode;
  label: string;
  text: string;
  time: string;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-slate-900">{label}</p>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
            <Clock className="h-3 w-3" />
            {time}
          </span>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">{text}</p>
      </div>
    </div>
  );
}

function SummaryList({
  label,
  items,
  dot,
  icon,
}: {
  label: string;
  items: string[];
  dot: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {icon}
        {label}
      </p>
      <ul className="mt-1.5 space-y-1">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2 text-slate-600">
            <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", dot)} />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ----------------------------- Add Session ----------------------------- */

function AddSessionModal({
  open,
  onClose,
  student,
  tutorName,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  student: Student;
  tutorName: string;
  onAdd: (s: Session) => void;
}) {
  const [subject, setSubject] = useState<Subject>(student.subjectFocus);
  const [skillFocus, setSkillFocus] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [score, setScore] = useState("70");
  const [notes, setNotes] = useState("");
  const [nextSteps, setNextSteps] = useState("");
  const [error, setError] = useState(false);

  const submit = () => {
    if (!skillFocus.trim() || !notes.trim()) {
      setError(true);
      return;
    }
    onAdd({
      id: `sess-${Date.now()}`,
      studentId: student.id,
      tutorName,
      date,
      subject,
      skillFocus: skillFocus.trim(),
      notes: notes.trim(),
      performanceScore: Math.max(0, Math.min(100, Number(score) || 0)),
      nextSteps: nextSteps.trim() || "Continue practicing this skill in the next session.",
    });
    // reset
    setSkillFocus("");
    setNotes("");
    setNextSteps("");
    setScore("70");
    setError(false);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add session"
      description={`Log a tutoring session for ${student.firstName}.`}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={submit}>
            <Plus className="h-4 w-4" />
            Add session
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Subject" htmlFor="subject">
            <Select id="subject" value={subject} onChange={(e) => setSubject(e.target.value as Subject)}>
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Date" htmlFor="date">
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Skill focus" htmlFor="skill" error={error && !skillFocus.trim() ? "Required" : undefined}>
            <Input
              id="skill"
              placeholder="e.g. Reading Comprehension"
              value={skillFocus}
              onChange={(e) => setSkillFocus(e.target.value)}
              invalid={error && !skillFocus.trim()}
            />
          </Field>
          <Field label="Performance score (%)" htmlFor="score">
            <Input id="score" type="number" min={0} max={100} value={score} onChange={(e) => setScore(e.target.value)} />
          </Field>
        </div>
        <Field label="Tutor notes" htmlFor="notes" error={error && !notes.trim() ? "Required" : undefined}>
          <Textarea
            id="notes"
            rows={3}
            placeholder="What happened in the session?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            invalid={error && !notes.trim()}
          />
        </Field>
        <Field label="Next steps" htmlFor="next" hint="Optional — defaults to a follow-up reminder.">
          <Textarea
            id="next"
            rows={2}
            placeholder="What should the next session focus on?"
            value={nextSteps}
            onChange={(e) => setNextSteps(e.target.value)}
          />
        </Field>
      </div>
    </Modal>
  );
}
