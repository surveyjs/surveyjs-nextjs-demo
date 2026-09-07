import { Suspense } from "react";
import type { Metadata } from "next";
import { SurveyDesigner } from "@/components/configure/SurveyDesigner";

export const metadata: Metadata = {
  title: "Form designer — SurveyJS Creator + Next.js",
  description:
    "Edit any form in the template in Survey Creator — designer, JSON, logic, preview and theme — then open the page it actually lives in.",
};

/**
 * The one designer in the template, for every form in it.
 *
 * `?form=` picks which one, so a link to a particular form is shareable; the
 * designer reads it with `useSearchParams`, hence the Suspense boundary.
 */
export default function ConfigurePage() {
  return (
    <Suspense fallback={null}>
      <SurveyDesigner />
    </Suspense>
  );
}
