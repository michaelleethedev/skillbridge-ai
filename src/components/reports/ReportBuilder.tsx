"use client";

import { useState } from "react";
import { FileBarChart } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

export function ReportBuilder() {
  return (
    <EmptyState
      icon={FileBarChart}
      title="Reports Builder"
      description="Advanced reporting features coming soon. Generate custom reports, export data, and share insights with parents and administrators."
    />
  );
}
