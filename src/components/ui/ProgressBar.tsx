import { cn, masteryBarColor } from "@/lib/utils";

export function ProgressBar({
  value,
  className,
  colorByValue = false,
  barClassName,
}: {
  value: number;
  className?: string;
  /** When true, the bar color reflects the mastery thresholds. */
  colorByValue?: boolean;
  barClassName?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-slate-100", className)}>
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500",
          colorByValue ? masteryBarColor(clamped) : "bg-brand-500",
          barClassName,
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
