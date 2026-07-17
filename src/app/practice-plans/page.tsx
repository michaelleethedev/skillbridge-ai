import { Suspense } from "react";
import { ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { PracticePlanGenerator } from "@/components/ai/PracticePlanGenerator";
import { DemoPageGuide } from "@/components/demo/DemoPageGuide";

export default function PracticePlansPage() {
  return (
    <>
      <PageHeader
        title="Practice Plan Generator"
        description="Create personalized, structured practice plans based on a student's skill gaps."
      />
      <DemoPageGuide
        eyebrow="Guided tour step 5 of 6"
        title="Generate and save a tutoring plan"
        description="Use the suggested skill focus, generate a timed plan, save it to the student profile, then start a demo session from it."
        steps={["Select a student and skill focus.", "Generate a timed practice plan.", "Save it, then start a session from the plan."]}
        primaryHref="/reports"
        primaryLabel="Next: build report"
        icon={ClipboardList}
      />
      <Suspense fallback={null}>
        <PracticePlanGenerator />
      </Suspense>
    </>
  );
}
