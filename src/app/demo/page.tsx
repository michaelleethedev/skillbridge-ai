import { BrainCircuit } from "lucide-react";
import { DashboardActions } from "@/components/dashboard/DashboardActions";
import { PriorityQueueCard } from "@/components/dashboard/PriorityQueueCard";
import { WeeklyPlanCard } from "@/components/dashboard/WeeklyPlanCard";
import { AttentionMatrixCard } from "@/components/dashboard/AttentionMatrixCard";
import { InsightsRecommendationCard } from "@/components/dashboard/InsightsRecommendationCard";
import { DemoDashboardIntro } from "@/components/demo/DemoDashboardIntro";
import { DemoMetricGrid } from "@/components/demo/DemoMetricGrid";
import { DemoWorkflowPanel } from "@/components/demo/DemoWorkflowPanel";

export default function DashboardPage() {
  return (
    <div className="animate-fade-in space-y-5 text-slate-100">
      <DemoDashboardIntro />
      <DemoWorkflowPanel />

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

      <DemoMetricGrid />

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
