import { Suspense } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { GapAnalyzer } from "@/components/ai/GapAnalyzer";

export default function AIReportsPage() {
  return (
    <>
      <PageHeader
        title="AI Learning Gap Analyzer"
        description="Turn a rough tutor note into a structured learning-gap analysis and action plan."
      />
      <Suspense fallback={null}>
        <GapAnalyzer />
      </Suspense>
    </>
  );
}
