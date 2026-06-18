import { TrendingUp, TrendingDown, Clock, Rocket } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { TrendLabel } from "@/data";
import { Badge } from "./Badge";

const config: Record<TrendLabel, { icon: LucideIcon; className: string }> = {
  Improving: {
    icon: TrendingUp,
    className: "bg-emerald-500/10 text-emerald-300 ring-emerald-400/20",
  },
  Declining: {
    icon: TrendingDown,
    className: "bg-rose-500/10 text-rose-300 ring-rose-400/20",
  },
  "No recent session": {
    icon: Clock,
    className: "bg-white/[0.06] text-slate-400 ring-white/10",
  },
  "Ready for next skill": {
    icon: Rocket,
    className: "bg-blue-500/10 text-blue-300 ring-blue-400/20",
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
