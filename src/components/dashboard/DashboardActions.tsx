"use client";

import { useState } from "react";
import { Sparkles, Download, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function DashboardActions() {
  const [exported, setExported] = useState(false);

  const scrollToPlan = () => {
    document.getElementById("weekly-plan")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleExport = () => {
    setExported(true);
    setTimeout(() => setExported(false), 2400);
  };

  return (
    <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
      <Button onClick={scrollToPlan}>
        <Sparkles className="h-4 w-4" />
        Generate Weekly Plan
      </Button>
      <Button variant="secondary" onClick={handleExport}>
        {exported ? (
          <>
            <Check className="h-4 w-4 text-emerald-600" />
            Export queued
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            Export Report
          </>
        )}
      </Button>
    </div>
  );
}
