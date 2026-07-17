import Link from "next/link";
import { ArrowRight, CheckCircle2, type LucideIcon } from "lucide-react";

interface DemoPageGuideProps {
  eyebrow: string;
  title: string;
  description: string;
  steps: string[];
  primaryHref: string;
  primaryLabel: string;
  icon: LucideIcon;
}

export function DemoPageGuide({
  eyebrow,
  title,
  description,
  steps,
  primaryHref,
  primaryLabel,
  icon: Icon,
}: DemoPageGuideProps) {
  return (
    <section className="rounded-2xl border border-blue-400/15 bg-gradient-to-br from-blue-500/10 via-[#101827] to-[#0d1422] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,.04)]">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-300">
            <Icon className="h-3.5 w-3.5" />
            {eyebrow}
          </div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">{description}</p>
        </div>
        <Link
          href={primaryHref}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-xs font-semibold text-white transition hover:bg-blue-500"
        >
          {primaryLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {steps.map((step) => (
          <div key={step} className="flex items-start gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3 text-xs leading-5 text-slate-400">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
            {step}
          </div>
        ))}
      </div>
    </section>
  );
}
