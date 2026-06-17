import { Suspense } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { PracticePlanGenerator } from "@/components/ai/PracticePlanGenerator";

export default function PracticePlansPage() {
  return (
    <>
      <PageHeader
        title="Practice Plan Generator"
        description="Create personalized, structured practice plans based on a student's skill gaps."
      />
      <Suspense fallback={null}>
        <PracticePlanGenerator />
      </Suspense>
    </>
  );
}
