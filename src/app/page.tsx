import { BrainCircuit, Gauge, GraduationCap, LifeBuoy, Target } from "lucide-react";
import { DashboardActions } from "@/components/dashboard/DashboardActions";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PriorityQueueCard } from "@/components/dashboard/PriorityQueueCard";
import { WeeklyPlanCard } from "@/components/dashboard/WeeklyPlanCard";
import { AttentionMatrixCard } from "@/components/dashboard/AttentionMatrixCard";
import { InsightsRecommendationCard } from "@/components/dashboard/InsightsRecommendationCard";

export default function DashboardPage() {
  return (
    <div className="animate-fade-in space-y-5 text-slate-100">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-400">
            <BrainCircuit className="h-3.5 w-3.5" /> Student Intelligence Command Center
          </div>
          <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.035em] text-white sm:text-[32px]">Dashboard</h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-500">AI-powered snapshot of student progress, skill gaps, and recommended next steps.</p>
        </div>
        <DashboardActions />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <MetricCard label="Total Students" value={10} badge="+2 enrolled" subtitle="Across grades 1–5" icon={GraduationCap} accent="blue" />
        <MetricCard label="Students Needing Support" value={4} badge="Action needed" subtitle="40% of students" icon={LifeBuoy} accent="amber" />
        <MetricCard label="Sessions This Week" value={3} badge="+3 vs last week" subtitle="Engagement steady" icon={Target} accent="cyan" />
        <MetricCard label="Avg. Skill Mastery" value="65%" badge="+4% this month" subtitle="On track to improve" icon={Gauge} accent="emerald" />
        <MetricCard label="Skills Below Benchmark" value={7} subtitle="Across 5 students" secondarySubtitle="Prioritize intervention" icon={BrainCircuit} accent="violet" />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(350px,.8fr)]">
        <PriorityQueueCard />
        <WeeklyPlanCard />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(420px,1fr)]">
        <AttentionMatrixCard />
        <InsightsRecommendationCard />
      </div>
    </div>
  );
}
