import Link from "next/link";
import {
  Users,
  LifeBuoy,
  CalendarCheck,
  Gauge,
  Sparkles,
  ChevronRight,
  Clock,
  ArrowUpRight,
  CalendarRange,
  Lightbulb,
} from "lucide-react";
import {
  getDashboardStats,
  getAttentionQueue,
  getMasteryBySubject,
  getStudentsBySupportLevel,
  getSessionTrend,
  getDashboardInsights,
  getWeeklyPlan,
  getStudentTrend,
  fullName,
  initials,
} from "@/data";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { SupportLevelBadge } from "@/components/ui/SupportLevelBadge";
import { TrendBadge } from "@/components/ui/TrendBadge";
import { PageHeader } from "@/components/ui/PageHeader";
import { DashboardActions } from "@/components/dashboard/DashboardActions";
import { MasteryBySubjectChart } from "@/components/charts/MasteryBySubjectChart";
import { SupportLevelChart } from "@/components/charts/SupportLevelChart";
import { SessionTrendChart } from "@/components/charts/SessionTrendChart";

export default function DashboardPage() {
  const stats = getDashboardStats();
  const queue = getAttentionQueue();
  const masteryBySubject = getMasteryBySubject();
  const supportLevels = getStudentsBySupportLevel();
  const trend = getSessionTrend();
  const insights = getDashboardInsights(4);
  const weeklyPlan = getWeeklyPlan();

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="AI-powered snapshot of student progress, skill gaps, and recommended next steps across your tutoring program."
        action={<DashboardActions />}
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total students"
          value={stats.totalStudents}
          icon={Users}
          trend={{ value: "+2 enrolled", positive: true }}
          hint="Across grades 1–5"
        />
        <StatCard
          label="Needing support"
          value={stats.needingSupport}
          icon={LifeBuoy}
          iconClass="bg-amber-50 text-amber-600"
          trend={{ value: "Action needed", positive: false }}
        />
        <StatCard
          label="Sessions this week"
          value={stats.sessionsThisWeek}
          icon={CalendarCheck}
          iconClass="bg-blue-50 text-blue-600"
          trend={{ value: "+3 vs last week", positive: true }}
        />
        <StatCard
          label="Avg. skill mastery"
          value={`${stats.averageMastery}%`}
          icon={Gauge}
          iconClass="bg-emerald-50 text-emerald-600"
          trend={{ value: "+4% this month", positive: true }}
        />
      </div>

      {/* AI insights / action items */}
      <Card className="overflow-hidden">
        <div className="border-l-4 border-brand-500">
          <CardHeader
            title={
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-600" />
                AI insights &amp; action items
              </span>
            }
            subtitle="Prioritized students based on recent sessions, skill gaps, and mastery trends"
            action={
              <Link
                href="/students"
                className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
              >
                View all
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <CardBody className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {insights.map((item) => (
              <div
                key={item.studentId}
                className="group flex flex-col rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/50 p-4 transition-all hover:border-brand-200 hover:shadow-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <span className="text-xs text-slate-400">Grade {item.grade}</span>
                  </div>
                  <SupportLevelBadge level={item.supportLevel} />
                </div>

                <div className="mt-1.5">
                  <TrendBadge trend={item.trend} />
                </div>

                <div className="mt-3 space-y-1.5 text-sm">
                  <p className="text-slate-600">
                    <span className="font-medium text-slate-500">Reason:</span> {item.reason}
                  </p>
                  <p className="text-slate-600">
                    <span className="font-medium text-slate-500">Next step:</span> {item.nextStep}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-400">Confidence</span>
                    <span className="text-sm font-semibold text-emerald-600">
                      {item.confidence}%
                    </span>
                  </div>
                  <Link
                    href={`/students/${item.studentId}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
                  >
                    View student
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            ))}
          </CardBody>
        </div>
      </Card>

      {/* AI Weekly Plan */}
      <Card id="weekly-plan" className="overflow-hidden scroll-mt-20">
        <CardHeader
          title={
            <span className="flex items-center gap-2">
              <CalendarRange className="h-4 w-4 text-brand-600" />
              AI Weekly Plan
            </span>
          }
          subtitle="Recommended focus, activities, and time allocation for the week ahead"
          action={
            <Link
              href="/practice-plans"
              className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
            >
              Open planner
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-left text-[11px] uppercase tracking-[0.08em] text-slate-500">
                <th className="px-5 py-3 font-semibold">Student</th>
                <th className="px-5 py-3 font-semibold">Focus skill</th>
                <th className="px-5 py-3 font-semibold">Recommended activity</th>
                <th className="px-5 py-3 font-semibold">Time</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {weeklyPlan.map((row) => (
                <tr key={row.studentId} className="group transition-colors hover:bg-slate-50/80">
                  <td className="whitespace-nowrap px-5 py-3.5">
                    <Link
                      href={`/students/${row.studentId}`}
                      className="font-medium text-slate-900 group-hover:text-brand-700"
                    >
                      {row.student}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-slate-700">{row.skill}</td>
                  <td className="px-5 py-3.5 text-slate-600">{row.activity}</td>
                  <td className="whitespace-nowrap px-5 py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-slate-600">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {row.time}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge
                      className={
                        row.status === "Priority"
                          ? "bg-rose-50 text-rose-700 ring-rose-600/20"
                          : "bg-amber-50 text-amber-700 ring-amber-600/20"
                      }
                    >
                      {row.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/students/${row.studentId}`}
                      className="inline-flex items-center text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-500"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Skill mastery by subject"
            subtitle="Average mastery across all tracked skills"
            action={
              <Link
                href="/skills"
                className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
              >
                View details
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <CardBody>
            <MasteryBySubjectChart data={masteryBySubject} />
            <ChartInsight text="Reading mastery is trending lower among students marked High Priority." />
          </CardBody>
        </Card>
        <Card>
          <CardHeader
            title="Students by support level"
            action={
              <Link
                href="/students"
                className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
              >
                View details
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <CardBody>
            <SupportLevelChart data={supportLevels} />
            <ChartInsight text="Students marked Improving increased by 4% this month." />
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Session performance trend"
            subtitle="Performance scores across recent sessions"
            action={
              <Link
                href="/sessions"
                className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
              >
                View details
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <CardBody>
            <SessionTrendChart data={trend} />
            <ChartInsight text="Average session performance is climbing steadily over the last several sessions." />
          </CardBody>
        </Card>

        {/* Attention queue */}
        <Card>
          <CardHeader
            title="Attention queue"
            subtitle="Students needing follow-up"
            action={
              <Link
                href="/students"
                className="text-xs font-medium text-brand-600 hover:text-brand-700"
              >
                View all
              </Link>
            }
          />
          <CardBody className="space-y-1 py-2">
            {queue.map((s) => (
              <Link
                key={s.id}
                href={`/students/${s.id}`}
                className="group flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-slate-50"
              >
                <Avatar initials={initials(s)} color={s.avatarColor} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {fullName(s)}
                  </p>
                  <p className="text-xs text-slate-500">
                    Grade {s.grade} · {s.subjectFocus}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <SupportLevelBadge level={s.supportLevel} />
                  <TrendBadge trend={getStudentTrend(s.id)} />
                </div>
              </Link>
            ))}
          </CardBody>
        </Card>
      </div>
    </>
  );
}

/** Small AI-insight footnote shown beneath a chart. */
function ChartInsight({ text }: { text: string }) {
  return (
    <div className="mt-4 flex items-start gap-2 border-t border-slate-100 pt-3">
      <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" />
      <p className="text-xs leading-relaxed text-slate-500">{text}</p>
    </div>
  );
}
