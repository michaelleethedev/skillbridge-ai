"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Users as UsersIcon,
  ChevronRight,
  Sparkles,
  Gauge,
  CalendarCheck,
  TriangleAlert,
  TrendingUp,
  RotateCcw,
  Lightbulb,
  Loader2,
  CalendarClock,
  FileText,
} from "lucide-react";
import type { Grade, Student, Subject, SupportLevel } from "@/types";
import type { InsightCategory } from "@/data";
import {
  students as seedStudents,
  fullName,
  initials,
  getDashboardStats,
  getProgramInsightCards,
} from "@/data";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { SupportLevelBadge } from "@/components/ui/SupportLevelBadge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Select } from "@/components/ui/Field";
import { cn, masteryColor, formatShortDate } from "@/lib/utils";
import { AddStudentModal } from "@/components/students/AddStudentModal";

const INSIGHT_CATEGORY: Record<
  InsightCategory,
  { icon: typeof TrendingUp; badge: string }
> = {
  Risk: { icon: TriangleAlert, badge: "bg-rose-50 text-rose-700 ring-rose-600/20" },
  Progress: { icon: TrendingUp, badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" },
  Recommendation: { icon: Lightbulb, badge: "bg-brand-50 text-brand-700 ring-brand-600/20" },
};

const SUBJECTS: Subject[] = ["Reading", "Math", "Writing", "Phonics", "Science"];
const LEVELS: SupportLevel[] = ["On Track", "Improving", "Needs Support", "High Priority"];
const GRADES: Grade[] = [1, 2, 3, 4, 5];

/** Short, action-oriented AI next step derived directly from a student. */
function nextStepFor(student: Student): string {
  if (student.supportLevel === "On Track") return "Ready for next skill";
  const gap = (student.needsSupport[0] ?? student.subjectFocus).toLowerCase();
  const rules: [RegExp, string][] = [
    [/comprehension|main idea/, "Practice text evidence"],
    [/inference/, "Practice drawing inferences"],
    [/fluency/, "Build reading fluency"],
    [/phonics|blend/, "Continue phonics blending"],
    [/vocab/, "Expand vocabulary practice"],
    [/fraction/, "Review fractions with models"],
    [/word problem/, "Review ratio word problems"],
    [/place value/, "Reinforce place value"],
    [/multiplication|division/, "Drill multiplication facts"],
    [/writing|sentence|paragraph/, "Strengthen sentence structure"],
    [/confidence/, "Build confidence with wins"],
  ];
  const match = rules.find(([re]) => re.test(gap));
  return match ? match[1] : `Focus on ${student.needsSupport[0] ?? student.subjectFocus}`;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(seedStudents);
  const [query, setQuery] = useState("");
  const [grade, setGrade] = useState<string>("all");
  const [subject, setSubject] = useState<string>("all");
  const [level, setLevel] = useState<string>("all");
  const [view, setView] = useState<"table" | "grid">("table");
  const [addOpen, setAddOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return students.filter((s) => {
      if (q && !fullName(s).toLowerCase().includes(q)) return false;
      if (grade !== "all" && s.grade !== Number(grade)) return false;
      if (subject !== "all" && s.subjectFocus !== subject) return false;
      if (level !== "all" && s.supportLevel !== level) return false;
      return true;
    });
  }, [students, query, grade, subject, level]);

  const [planLoading, setPlanLoading] = useState(false);
  const [weeklyPlan, setWeeklyPlan] = useState<{ name: string; step: string }[] | null>(null);

  const handleAdd = (student: Student) => {
    setStudents((prev) => [student, ...prev]);
    setAddOpen(false);
  };

  const resetFilters = () => {
    setQuery("");
    setGrade("all");
    setSubject("all");
    setLevel("all");
  };

  const filtersActive =
    query !== "" || grade !== "all" || subject !== "all" || level !== "all";

  // Summary metrics derived from the (live) student list.
  const summary = useMemo(() => {
    const total = students.length;
    const highPriority = students.filter((s) => s.supportLevel === "High Priority").length;
    const avgMastery = Math.round(
      students.reduce((sum, s) => sum + s.averageMastery, 0) / Math.max(1, total),
    );
    return { total, highPriority, avgMastery };
  }, [students]);

  const router = useRouter();
  const sessionsThisWeek = getDashboardStats().sessionsThisWeek;
  const insights = getProgramInsightCards();

  // "AI" weekly plan: prioritize the students who need the most attention.
  const generateWeeklyPlan = async () => {
    setPlanLoading(true);
    setWeeklyPlan(null);
    await new Promise((r) => setTimeout(r, 850));
    const priority: Record<SupportLevel, number> = {
      "High Priority": 0,
      "Needs Support": 1,
      Improving: 2,
      "On Track": 3,
    };
    const plan = [...students]
      .sort(
        (a, b) =>
          priority[a.supportLevel] - priority[b.supportLevel] ||
          a.averageMastery - b.averageMastery,
      )
      .slice(0, 4)
      .map((s) => ({ name: fullName(s), step: nextStepFor(s) }));
    setWeeklyPlan(plan);
    setPlanLoading(false);
  };

  return (
    <>
      <PageHeader
        title="Students"
        description="Monitor every learner's progress, support level, and AI-recommended next step — all in one place."
        action={
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" />
            Add student
          </Button>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total students"
          value={summary.total}
          icon={UsersIcon}
          hint="Across grades 1–5"
        />
        <StatCard
          label="High priority"
          value={summary.highPriority}
          icon={TriangleAlert}
          iconClass="bg-rose-50 text-rose-600"
          trend={{ value: "Needs focus", positive: false }}
        />
        <StatCard
          label="Average mastery"
          value={`${summary.avgMastery}%`}
          icon={Gauge}
          iconClass="bg-emerald-50 text-emerald-600"
          trend={{ value: "+4% this month", positive: true }}
        />
        <StatCard
          label="Sessions this week"
          value={sessionsThisWeek}
          icon={CalendarCheck}
          iconClass="bg-blue-50 text-blue-600"
          hint="Logged across program"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Left: filters + roster */}
        <div className="space-y-4 xl:col-span-2">
          {/* Filter card */}
          <Card className="p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <FilterField label="Search" className="sm:col-span-2 lg:col-span-1">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Name..."
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                  />
                </div>
              </FilterField>
              <FilterField label="Grade">
                <Select value={grade} onChange={(e) => setGrade(e.target.value)} className="h-10">
                  <option value="all">All grades</option>
                  {GRADES.map((g) => (
                    <option key={g} value={g}>
                      Grade {g}
                    </option>
                  ))}
                </Select>
              </FilterField>
              <FilterField label="Subject">
                <Select value={subject} onChange={(e) => setSubject(e.target.value)} className="h-10">
                  <option value="all">All subjects</option>
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              </FilterField>
              <FilterField label="Status">
                <Select value={level} onChange={(e) => setLevel(e.target.value)} className="h-10">
                  <option value="all">All statuses</option>
                  {LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </Select>
              </FilterField>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
              <p className="text-xs text-slate-500">
                Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of{" "}
                {students.length} students
              </p>
              <div className="flex items-center gap-2">
                {filtersActive && (
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset
                  </Button>
                )}
                <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                  <button
                    onClick={() => setView("table")}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all",
                      view === "table"
                        ? "bg-white text-slate-800 shadow-sm"
                        : "text-slate-500 hover:text-slate-700",
                    )}
                  >
                    <List className="h-3.5 w-3.5" />
                    Table
                  </button>
                  <button
                    onClick={() => setView("grid")}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all",
                      view === "grid"
                        ? "bg-white text-slate-800 shadow-sm"
                        : "text-slate-500 hover:text-slate-700",
                    )}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                    Grid
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {filtered.length === 0 ? (
            <EmptyState
              icon={UsersIcon}
              title="No students match your filters"
              description="Try adjusting your search or filters to find who you're looking for."
              action={
                <Button variant="secondary" onClick={resetFilters}>
                  Clear filters
                </Button>
              }
            />
          ) : view === "table" ? (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70 text-left text-[11px] uppercase tracking-[0.08em] text-slate-500">
                      <th className="px-5 py-3.5 font-semibold">Student</th>
                      <th className="px-5 py-3.5 font-semibold">Grade</th>
                      <th className="px-5 py-3.5 font-semibold">Status</th>
                      <th className="px-5 py-3.5 font-semibold">Mastery</th>
                      <th className="px-5 py-3.5 font-semibold">Last session</th>
                      <th className="px-5 py-3.5 font-semibold">Next step</th>
                      <th className="px-5 py-3.5 text-right font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((s) => (
                      <tr
                        key={s.id}
                        onClick={() => router.push(`/students/${s.id}`)}
                        className="group cursor-pointer align-middle transition-colors hover:bg-brand-50/40"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar initials={initials(s)} color={s.avatarColor} size="sm" />
                            <div className="min-w-0">
                              <p className="truncate font-medium text-slate-900 group-hover:text-brand-700">
                                {fullName(s)}
                              </p>
                              <p className="truncate text-xs text-slate-500">{s.guardianName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-slate-600">Grade {s.grade}</td>
                        <td className="px-5 py-4">
                          <SupportLevelBadge level={s.supportLevel} />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <ProgressBar value={s.averageMastery} colorByValue className="w-20" />
                            <span className={cn("text-xs font-semibold tabular-nums", masteryColor(s.averageMastery))}>
                              {s.averageMastery}%
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                            <CalendarClock className="h-3.5 w-3.5 text-slate-400" />
                            {formatShortDate(s.lastSessionOn)}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            title={nextStepFor(s)}
                            className="inline-flex max-w-[200px] items-center gap-1.5 truncate rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-600/15"
                          >
                            <Sparkles className="h-3 w-3 shrink-0" />
                            <span className="truncate">{nextStepFor(s)}</span>
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Link
                            href={`/students/${s.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                          >
                            View profile
                            <ChevronRight className="h-3.5 w-3.5" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {filtered.map((s) => (
                <Link key={s.id} href={`/students/${s.id}`} className="group block">
                  <Card className="h-full p-5 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-slate-300 group-hover:shadow-card-hover">
                    <div className="flex items-center gap-3">
                      <Avatar initials={initials(s)} color={s.avatarColor} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-slate-900 group-hover:text-brand-700">
                          {fullName(s)}
                        </p>
                        <p className="text-xs text-slate-500">
                          Grade {s.grade} · {s.subjectFocus}
                        </p>
                      </div>
                      <SupportLevelBadge level={s.supportLevel} />
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                      <span>Mastery</span>
                      <span className={cn("font-semibold", masteryColor(s.averageMastery))}>
                        {s.averageMastery}%
                      </span>
                    </div>
                    <ProgressBar value={s.averageMastery} colorByValue className="mt-1.5" />
                    <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-600/15">
                        <Sparkles className="h-3 w-3" />
                        {nextStepFor(s)}
                      </span>
                      <span className="inline-flex items-center gap-1 whitespace-nowrap text-[11px] text-slate-400">
                        <CalendarClock className="h-3 w-3" />
                        {formatShortDate(s.lastSessionOn)}
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right: AI Insights panel */}
        <div className="xl:col-span-1">
          <Card className="overflow-hidden xl:sticky xl:top-20">
            <div className="bg-gradient-to-br from-brand-600 to-brand-700 px-5 py-4 text-white">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 ring-1 ring-inset ring-white/20">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold">AI Program Insights</h3>
                  <p className="text-[11px] leading-snug text-white/75">
                    Generated from recent sessions, mastery trends, and support levels.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3 p-5">
              {insights.map((insight, i) => {
                const { icon: Icon, badge } = INSIGHT_CATEGORY[insight.category];
                return (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-soft transition-shadow hover:shadow-card"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Badge className={badge}>
                        <Icon className="h-3 w-3" />
                        {insight.category}
                      </Badge>
                      <span className="text-[11px] font-medium text-slate-400">
                        {insight.confidence}% confidence
                      </span>
                    </div>
                    <p className="mt-2 text-[13px] leading-relaxed text-slate-700">{insight.text}</p>
                  </div>
                );
              })}

              {weeklyPlan && (
                <div className="rounded-xl border border-brand-100 bg-brand-50/50 p-3.5">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-brand-700">
                    Suggested weekly focus
                  </p>
                  <ul className="space-y-1.5">
                    {weeklyPlan.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13px] text-slate-700">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[10px] font-semibold text-brand-700">
                          {i + 1}
                        </span>
                        <span>
                          <span className="font-medium text-slate-800">{item.name}</span> — {item.step}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-2 border-t border-slate-100 pt-3">
                <Button onClick={generateWeeklyPlan} disabled={planLoading} className="w-full">
                  {planLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      {weeklyPlan ? "Regenerate Weekly Plan" : "Generate Weekly Plan"}
                    </>
                  )}
                </Button>
                <Link href="/ai-reports" className="block">
                  <Button variant="secondary" className="w-full">
                    <FileText className="h-4 w-4" />
                    View AI Report
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <AddStudentModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd} />
    </>
  );
}

function FilterField({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <label className="block text-[11px] font-medium uppercase tracking-wide text-slate-500">
        {label}
      </label>
      {children}
    </div>
  );
}
