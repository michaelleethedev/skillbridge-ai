import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <Compass className="h-7 w-7" />
      </div>
      <h1 className="mt-5 text-2xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        We couldn&apos;t find what you were looking for. It may have been moved or doesn&apos;t exist.
      </p>
      <Link href="/demo" className="mt-6">
        <Button>Back to dashboard</Button>
      </Link>
    </div>
  );
}
