import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent px-6 py-16 text-center">
      <div className="relative">
        <div className="absolute inset-0 -z-10 blur-xl" aria-hidden>
          <div className="mx-auto h-12 w-12 rounded-full bg-brand-200/40" />
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-500/10">
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <h3 className="mt-5 text-base font-semibold tracking-tight text-slate-100">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-slate-500">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
