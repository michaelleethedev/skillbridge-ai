"use client";

import { useState } from "react";
import { Sparkles, Download, Check } from "lucide-react";

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
      <button onClick={scrollToPlan} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-blue-500/40">
        <Sparkles className="h-4 w-4" />
        Generate Weekly Plan
      </button>
      <button onClick={handleExport} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.045] px-4 text-xs font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/[0.075] hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30">
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
      </button>
    </div>
  );
}
