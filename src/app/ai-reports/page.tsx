import { Suspense } from "react";
import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { GapAnalyzer } from "@/components/ai/GapAnalyzer";
import { DemoPageGuide } from "@/components/demo/DemoPageGuide";

export default function AIReportsPage() {
  return (
    <>
      <PageHeader
        title="AI Learning Gap Analyzer"
        description="Turn a rough tutor note into a structured learning-gap analysis and action plan."
      />
      <DemoPageGuide
        eyebrow="Guided tour step 4 of 6"
        title="Analyze a student learning gap"
        description="Pick a student, use a sample note or recent tutor observation, then save the result so it appears in the demo history."
        steps={["Choose a student for personalization.", "Analyze a real tutor note or sample.", "Save the analysis before generating a plan."]}
        primaryHref="/practice-plans?student=stu-bruce"
        primaryLabel="Next: practice plan"
        icon={Sparkles}
      />
      <Suspense fallback={null}>
        <GapAnalyzer />
      </Suspense>
    </>
  );
}
