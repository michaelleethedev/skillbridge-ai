import { Suspense } from "react";
import { FileBarChart } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ReportBuilder } from "@/components/reports/ReportBuilder";
import { DemoPageGuide } from "@/components/demo/DemoPageGuide";

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        title="Reports"
        description="Generate shareable parent and admin progress summaries."
      />
      <DemoPageGuide
        eyebrow="Guided tour step 6 of 6"
        title="Finish with a shareable progress report"
        description="Create a parent, tutor, student, or administrator summary from the live demo state and save it back to the student profile."
        steps={["Choose audience, tone, and detail level.", "Generate a report from current sessions and skills.", "Save or copy the report for the final demo artifact."]}
        primaryHref="/demo"
        primaryLabel="Back to dashboard"
        icon={FileBarChart}
      />
      <Suspense fallback={null}>
        <ReportBuilder />
      </Suspense>
    </>
  );
}
