"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { DemoFloatingGuide } from "@/components/demo/DemoFloatingGuide";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const landing = pathname === "/";
  const commandCenter = pathname === "/demo";

  if (landing) {
    return <main className="min-h-screen bg-[#070b14]">{children}</main>;
  }

  return (
    <div className="app-surface flex min-h-screen bg-[#070b14]">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 bg-[#070b14] px-4 pb-24 pt-6 lg:px-7 lg:pb-28 lg:pt-7">
          <div className={commandCenter ? "mx-auto w-full max-w-[1600px] space-y-5" : "mx-auto w-full max-w-[1480px] space-y-6"}>{children}</div>
        </main>
        <DemoFloatingGuide />
      </div>
    </div>
  );
}
