import { CardSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="shimmer h-6 w-40 rounded" />
        <div className="shimmer h-4 w-72 rounded" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="shimmer h-72 rounded-xl lg:col-span-2" />
        <div className="shimmer h-72 rounded-xl" />
      </div>
    </div>
  );
}
