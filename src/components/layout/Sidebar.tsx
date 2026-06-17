"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, X } from "lucide-react";
import { navItems } from "./nav";
import { cn } from "@/lib/utils";

function isActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  // Group nav items in order while preserving first-seen group order.
  const groups: { name: string; items: typeof navItems }[] = [];
  navItems.forEach((item) => {
    const name = item.group ?? "";
    let group = groups.find((g) => g.name === name);
    if (!group) {
      group = { name, items: [] };
      groups.push(group);
    }
    group.items.push(item);
  });

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 border-b border-slate-200 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-md shadow-brand-600/25">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <p className="text-[15px] font-bold tracking-tight text-slate-900">SkillBridge AI</p>
          <p className="text-[11px] font-medium text-slate-500">Tutoring Intelligence</p>
        </div>
        <button
          onClick={onClose}
          className="ml-auto rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {groups.map((group) => (
          <div key={group.name}>
            <p className="px-3 pb-2 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              {group.name}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href, pathname);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                      active
                        ? "bg-brand-50 text-brand-700 shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                    )}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand-600" />
                    )}
                    <Icon
                      className={cn(
                        "h-[18px] w-[18px] transition-colors",
                        active ? "text-brand-600" : "text-slate-400 group-hover:text-slate-600",
                      )}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 pb-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 items-center justify-center">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            </span>
            <p className="text-xs font-semibold text-slate-800">Demo workspace</p>
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">
            Sample data. AI runs on a mock engine until an API key is added.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:block">
        {content}
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={onClose}
        />
        <aside
          className={cn(
            "absolute left-0 top-0 h-full w-64 bg-white shadow-2xl transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          {content}
        </aside>
      </div>
    </>
  );
}
