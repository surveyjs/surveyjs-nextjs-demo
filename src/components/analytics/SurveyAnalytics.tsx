"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { getFormEntry } from "@/components/configure/forms";

/**
 * SurveyJS Dashboard measures its own grid, so there is nothing useful to
 * prerender: it is loaded on the client only.
 */
const DashboardPane = dynamic(() => import("./DashboardPane"), {
  ssr: false,
  loading: () => (
    <div className="text-muted-foreground flex h-svh items-center justify-center text-sm">
      Loading the dashboard…
    </div>
  ),
});

/**
 * The dashboard for one form, on the same contract as the designer: `?form=`
 * says which one, and the page carries no chrome of its own — a reviewer arrives
 * from a form and leaves back to it.
 */
export function SurveyAnalytics() {
  const params = useSearchParams();
  const form = getFormEntry(params.get("form"));

  return <DashboardPane key={form.id} form={form} />;
}
