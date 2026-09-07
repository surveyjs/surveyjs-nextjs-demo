"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { getFormEntry } from "./forms";

/**
 * Survey Creator is a browser application: it measures the DOM as it lays the
 * designer out, so there is nothing useful to prerender and it is loaded on the
 * client only.
 */
const CreatorPane = dynamic(() => import("./CreatorPane"), {
  ssr: false,
  loading: () => (
    <div className="text-muted-foreground flex h-svh items-center justify-center text-sm">
      Loading the designer…
    </div>
  ),
});

/**
 * The designer every form in the template opens in.
 *
 * It carries no chrome of its own on purpose: `?form=` says which form is being
 * edited, and there is nothing else on the page — no sidebar, no list of the
 * others. A reviewer arrives here from a form and leaves back to it.
 */
export function SurveyDesigner() {
  const params = useSearchParams();
  const form = getFormEntry(params.get("form"));

  // Keyed, so arriving at a different form builds a designer of its own.
  return <CreatorPane key={form.id} form={form} />;
}
