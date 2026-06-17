import { Suspense } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ReportBuilder } from "@/components/reports/ReportBuilder";

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        title="Reports"
        description="Generate shareable parent and admin progress summaries."
      />
      <Suspense fallback={null}>
        <ReportBuilder />
      </Suspense>
    </>
  );
}
