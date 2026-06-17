import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("shimmer rounded-md", className)} />;
}

/** A reusable loading placeholder for card-based pages. */
export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-4 h-8 w-16" />
      <Skeleton className="mt-3 h-3 w-32" />
    </div>
  );
}
