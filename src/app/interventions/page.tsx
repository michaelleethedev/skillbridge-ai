import Link from "next/link";
import { ArrowRight, Siren, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";

export default function InterventionsPage() {
  return (
    <>
      <PageHeader title="Interventions" description="Turn detected skill gaps into focused, measurable support plans." />
      <Card>
        <CardBody className="flex flex-col items-center px-6 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600"><Siren className="h-7 w-7" /></span>
          <h2 className="mt-5 text-lg font-semibold text-slate-900">AI-guided interventions are coming next</h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-500">Build small-group plans from priority students, assign activities, and track whether each intervention closes the detected gap.</p>
          <Link href="/ai-reports" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700"><Sparkles className="h-4 w-4" />Analyze a learning gap<ArrowRight className="h-4 w-4" /></Link>
        </CardBody>
      </Card>
    </>
  );
}
