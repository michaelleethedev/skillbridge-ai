"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Compass, FileText, Sparkles, UserRoundSearch, X } from "lucide-react";
import { useDemo } from "@/components/demo/DemoProvider";

const links = [
  { href: "/demo", label: "Dashboard", icon: Compass },
  { href: "/students/stu-bruce?tour=1", label: "Student profile", icon: UserRoundSearch },
  { href: "/ai-reports?student=stu-bruce", label: "AI analysis", icon: Sparkles },
  { href: "/reports", label: "Reports", icon: FileText },
];

export function DemoFloatingGuide() {
  const [open, setOpen] = useState(false);
  const { role } = useDemo();

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
      {open && (
        <div className="w-[calc(100vw-2rem)] max-w-xs rounded-2xl border border-white/[0.1] bg-[#0d1422] p-3 shadow-2xl">
          <div className="mb-2 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">Demo guide</p>
              <p className="mt-0.5 text-xs text-slate-500">{role} path shortcuts</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1 text-slate-500 hover:bg-white/[0.06] hover:text-white"
              aria-label="Close demo guide"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-1">
            {links.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                >
                  <Icon className="h-4 w-4 text-blue-300" />
                  <span className="flex-1">{item.label}</span>
                  <ChevronRight className="h-4 w-4 text-slate-600" />
                </Link>
              );
            })}
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-11 items-center gap-2 rounded-xl border border-blue-400/20 bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500"
      >
        <Compass className="h-4 w-4" />
        Demo guide
      </button>
    </div>
  );
}
