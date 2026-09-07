"use client";

import { useEffect, useMemo, useRef } from "react";
import { ArrowLeftIcon, PencilRulerIcon } from "lucide-react";
import { Model, type Question } from "survey-core";
import { Dashboard, type IDashboardOptions } from "survey-analytics";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import {
  TIMESTAMP_FIELD,
  analyticsPreset,
  demoResponses,
} from "@/analytics/demo-responses";
import { configureHref } from "@/lib/routes";
import type { FormEntry } from "@/components/configure/forms";

import "@/lib/surveyjs-license";
import "survey-core/survey-core.css";
import "survey-analytics/survey.analytics.css";

/**
 * SurveyJS Dashboard, on one form's responses.
 *
 * The dashboard is built from the same two things the form is: the definition,
 * and the answers people gave it. Nothing here maps questions to charts by hand
 * — `questions: survey.getAllQuestions()` hands the library the schema and it
 * picks a visualization per question type, offers the alternatives in each
 * item's menu, and does the aggregation, filtering and cross-filtering itself.
 * The preset only overrides the handful of picks worth stating (an NPS rating
 * wants the NPS visualizer, not a histogram).
 *
 * The responses are generated — see `demo-responses.ts` — because a template
 * cannot ship real ones and a dashboard drawn on five rows proves nothing.
 *
 * `dateFieldName` is what puts the date filter above the grid; every generated
 * response carries a timestamp inside the last ninety days.
 */
export default function DashboardPane({ form }: { form: FormEntry }) {
  const container = useRef<HTMLDivElement>(null);

  const preset = useMemo(() => analyticsPreset(form.id), [form.id]);
  const responses = useMemo(() => demoResponses(form.id, form.json), [form]);

  /**
   * Only questions somebody answered get a chart.
   *
   * A form asks for things no chart can say anything about — a name, an email
   * address, a signature — and the generated responses leave those empty on
   * purpose. Left in, they would open the dashboard with a row of empty word
   * clouds. Deciding it from the data rather than from a list per form means a
   * form edited in the Creator cannot bring one back.
   */
  const isCharted = useMemo(() => {
    const answered = new Set<string>();
    for (const response of responses) {
      for (const [name, answer] of Object.entries(response)) {
        if (answer !== undefined && answer !== null) answered.add(name);
      }
    }
    return (question: Question | string) =>
      answered.has(
        typeof question === "string" ? question : question.getValueName(),
      );
  }, [responses]);

  useEffect(() => {
    const host = container.current;
    if (!host) return;

    const survey = new Model(form.json);
    const dashboard = new Dashboard({
      questions: survey.getAllQuestions().filter(isCharted),
      data: responses,
      items: preset.items
        ? ([...preset.items].filter((item) =>
            isCharted(typeof item === "string" ? item : String(item.name)),
          ) as IDashboardOptions["items"])
        : undefined,
      dateFieldName: TIMESTAMP_FIELD,
    });

    dashboard.render(host);

    return () => {
      dashboard.clear();
      host.innerHTML = "";
    };
  }, [form, isCharted, preset, responses]);

  return (
    <div className="bg-background text-foreground flex min-h-svh flex-col">
      <header className="flex shrink-0 flex-wrap items-center gap-3 border-b px-4 py-2.5 sm:px-6">
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold tracking-tight">
            {form.label} — analytics
          </h1>
          <p className="text-muted-foreground truncate text-xs">
            {responses.length} responses, generated for this demo. Change a
            chart type in any item&apos;s menu, or filter by clicking a bar.
          </p>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-2" asChild>
            <a href={form.href}>
              <ArrowLeftIcon />
              <span className="hidden sm:inline">Back</span>
            </a>
          </Button>
          <ThemeSwitcher />
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <a href={configureHref(form.id)}>
              <PencilRulerIcon />
              Open in Creator
            </a>
          </Button>
        </div>
      </header>

      {/* The dashboard toolbar is a little wider than a phone: it scrolls here
          rather than dragging the whole page sideways. */}
      <div className="min-h-0 flex-1 overflow-x-auto px-4 py-4 sm:px-6">
        <div ref={container} />
      </div>
    </div>
  );
}
