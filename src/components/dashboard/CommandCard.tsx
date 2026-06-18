import { cn } from "@/lib/utils";

export function CommandCard({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d1422] shadow-[0_18px_50px_-32px_rgba(37,99,235,.45),inset_0_1px_0_rgba(255,255,255,.035)]",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export function CommandCardHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/[0.065] px-5 py-4">
      <div>
        <h2 className="text-sm font-semibold tracking-tight text-slate-100">{title}</h2>
        {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function PanelLink({ children }: { children: React.ReactNode }) {
  return (
    <span className="whitespace-nowrap text-xs font-medium text-blue-400 transition-colors hover:text-cyan-300">
      {children}
    </span>
  );
}
