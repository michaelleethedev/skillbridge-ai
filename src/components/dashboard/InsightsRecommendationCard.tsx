import Link from "next/link";
import { BookOpenCheck, Lightbulb, Sparkles, Target } from "lucide-react";
import { CommandCard, CommandCardHeader, PanelLink } from "./CommandCard";

const insights = [
  { title: "Fractions Mastery Gap Detected", text: "Bruce and 2 others are struggling with fractions. Consider a 15-min small group intervention this week.", badge: "High Impact", icon: Target, accent: "border-rose-400/15 bg-rose-500/[0.065] text-rose-300", iconStyle: "bg-rose-500/10 text-rose-400" },
  { title: "Reading Decoding Needs Reinforcement", text: "Elijah and 1 other student show recurring decoding errors. Increase practice with multisyllabic words.", badge: "Recommended", icon: BookOpenCheck, accent: "border-blue-400/15 bg-blue-500/[0.065] text-blue-300", iconStyle: "bg-blue-500/10 text-blue-400" },
  { title: "Engagement Opportunity", text: "Olivia performs well but has low engagement. Try gamified practice or new content to boost sessions.", badge: "Consider", icon: Lightbulb, accent: "border-violet-400/15 bg-violet-500/[0.065] text-violet-300", iconStyle: "bg-violet-500/10 text-violet-400" },
];

export function InsightsRecommendationCard() {
  return (
    <CommandCard>
      <CommandCardHeader title="AI Insights & Recommendations" action={<Link href="/ai-reports"><PanelLink>View full insights</PanelLink></Link>} />
      <div className="space-y-3 p-5">
        {insights.map(({ title, text, badge, icon: Icon, accent, iconStyle }) => (
          <div key={title} className={`rounded-xl border p-4 ${accent}`}>
            <div className="flex items-start gap-3">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}><Icon className="h-4 w-4" /></span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-xs font-semibold text-slate-100">{title}</h3><span className="rounded-full border border-current/20 bg-black/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider">{badge}</span></div>
                <p className="mt-2 text-[11px] leading-relaxed text-slate-400">{text}</p>
              </div>
            </div>
          </div>
        ))}
        <p className="flex items-center gap-2 pt-1 text-[10px] text-slate-600"><Sparkles className="h-3.5 w-3.5 text-violet-400" />Insights are updated after each session.</p>
      </div>
    </CommandCard>
  );
}
