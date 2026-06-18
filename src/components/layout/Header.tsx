"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, Bell, ChevronDown } from "lucide-react";
import { students, fullName, initials, currentUser } from "@/data";
import { Avatar } from "@/components/ui/Avatar";
import { SupportLevelBadge } from "@/components/ui/SupportLevelBadge";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const blurTimeout = useRef<ReturnType<typeof setTimeout>>();
  const inputRef = useRef<HTMLInputElement>(null);

  // Press "/" anywhere to focus the global search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || target.isContentEditable;
      if (e.key === "/" && !typing) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return students
      .filter(
        (s) =>
          fullName(s).toLowerCase().includes(q) ||
          s.subjectFocus.toLowerCase().includes(q) ||
          s.supportLevel.toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [query]);

  const go = (id: string) => {
    setQuery("");
    setFocused(false);
    router.push(`/students/${id}`);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/[0.07] bg-[#0a0f1b]/90 px-4 backdrop-blur-xl lg:px-7">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-slate-400 hover:bg-white/[0.06] hover:text-white lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (blurTimeout.current) clearTimeout(blurTimeout.current);
            setFocused(true);
          }}
          onBlur={() => {
            blurTimeout.current = setTimeout(() => setFocused(false), 150);
          }}
          placeholder="Search students, subjects, skills, or sessions..."
          className="h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.045] pl-9 pr-12 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-500/70 focus:bg-white/[0.065] focus:outline-none focus:ring-4 focus:ring-blue-500/10"
        />
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded-md border border-white/10 bg-white/[0.05] px-1.5 py-0.5 text-[10px] font-medium text-slate-500 sm:flex">
          /
        </kbd>

        {focused && query.trim() && (
          <div className="absolute left-0 right-0 top-12 z-40 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
            {results.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-slate-500">
                No matches for “{query}”
              </p>
            ) : (
              <ul className="max-h-80 overflow-y-auto py-1">
                {results.map((s) => (
                  <li key={s.id}>
                    <button
                      onMouseDown={() => go(s.id)}
                      className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-white/[0.05]"
                    >
                      <Avatar initials={initials(s)} color={s.avatarColor} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-100">
                          {fullName(s)}
                        </p>
                        <p className="text-xs text-slate-500">
                          Grade {s.grade} · {s.subjectFocus}
                        </p>
                      </div>
                      <SupportLevelBadge level={s.supportLevel} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          className="relative rounded-lg p-2 text-slate-400 hover:bg-white/[0.06] hover:text-white"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white ring-2 ring-[#0a0f1b]">3</span>
        </button>
        <Link
          href="/settings"
          className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-white/[0.06]"
        >
          <Avatar initials="JM" color={currentUser.avatarColor} size="sm" />
          <div className="hidden text-left leading-tight sm:block">
            <p className="text-sm font-medium text-slate-100">{currentUser.name}</p>
            <p className="text-xs capitalize text-slate-500">{currentUser.role}</p>
          </div>
          <ChevronDown className="hidden h-4 w-4 text-slate-500 md:block" />
        </Link>
      </div>
    </header>
  );
}
