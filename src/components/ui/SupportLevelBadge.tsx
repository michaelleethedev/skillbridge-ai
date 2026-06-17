import type { SupportLevel } from "@/types";
import { supportLevelStyles, cn } from "@/lib/utils";
import { Badge } from "./Badge";

const dotColor: Record<SupportLevel, string> = {
  "On Track": "bg-emerald-500",
  Improving: "bg-blue-500",
  "Needs Support": "bg-amber-500",
  "High Priority": "bg-rose-500",
};

export function SupportLevelBadge({ level }: { level: SupportLevel }) {
  return (
    <Badge className={supportLevelStyles[level]}>
      <span className={cn("h-1.5 w-1.5 rounded-full", dotColor[level])} />
      {level}
    </Badge>
  );
}
