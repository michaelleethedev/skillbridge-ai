import { TrendingUp, TrendingDown, Clock, Rocket } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { TrendLabel } from "@/data";
import { Badge } from "./Badge";

const config: Record<TrendLabel, { icon: LucideIcon; className: string }> = {
  Improving: {
    icon: TrendingUp,
    className: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  },
  Declining: {
    icon: TrendingDown,
    className: "bg-rose-50 text-rose-700 ring-rose-600/20",
  },
  "No recent session": {
    icon: Clock,
    className: "bg-slate-100 text-slate-600 ring-slate-500/20",
  },
  "Ready for next skill": {
    icon: Rocket,
    className: "bg-brand-50 text-brand-700 ring-brand-600/20",
  },
};

export function TrendBadge({ trend }: { trend: TrendLabel }) {
  const { icon: Icon, className } = config[trend];
  return (
    <Badge className={className}>
      <Icon className="h-3 w-3" />
      {trend}
    </Badge>
  );
}
