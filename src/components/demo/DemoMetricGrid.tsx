"use client";

import { BrainCircuit, Gauge, GraduationCap, LifeBuoy, Target } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { useDemo } from "@/components/demo/DemoProvider";

export function DemoMetricGrid() {
  const { dashboardStats } = useDemo();

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <MetricCard label="Total Students" value={dashboardStats.totalStudents} badge="Demo data" subtitle="Across grades 1-5" icon={GraduationCap} accent="blue" />
      <MetricCard label="Students Needing Support" value={dashboardStats.needingSupport} badge="Action needed" subtitle="Live from roster" icon={LifeBuoy} accent="amber" />
      <MetricCard label="Sessions This Week" value={dashboardStats.sessionsThisWeek} badge="Updates on save" subtitle="Logged across program" icon={Target} accent="cyan" />
      <MetricCard label="Avg. Skill Mastery" value={`${dashboardStats.averageMastery}%`} badge="Live average" subtitle="Based on active students" icon={Gauge} accent="emerald" />
      <MetricCard label="Saved AI Outputs" value={dashboardStats.reportsGenerated + dashboardStats.activePlans} subtitle="Reports, analyses, and plans" secondarySubtitle="Persists locally" icon={BrainCircuit} accent="violet" />
    </div>
  );
}
