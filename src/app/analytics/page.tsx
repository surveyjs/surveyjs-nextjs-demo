import { Suspense } from "react";
import type { Metadata } from "next";
import { SurveyAnalytics } from "@/components/analytics/SurveyAnalytics";

export const metadata: Metadata = {
  title: "Analytics — SurveyJS Dashboard + Next.js",
  description:
    "Charts built from the same JSON definition the form is: SurveyJS Dashboard picks a visualization per question, aggregates the responses and cross-filters them.",
};

/**
 * The dashboard page. `?form=` picks the form, read with `useSearchParams` —
 * hence the Suspense boundary.
 */
export default function AnalyticsPage() {
  return (
    <Suspense fallback={null}>
      <SurveyAnalytics />
    </Suspense>
  );
}
