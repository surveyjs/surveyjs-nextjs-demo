import Link from "next/link";
import { ChartColumnIcon, PencilRulerIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * The heading over a form, and the two places it leads: the designer this form
 * is edited in, and the dashboard its answers land in.
 */
export function PageHeader({
  title,
  description,
  configureHref,
  analyticsHref,
}: {
  title: string;
  description: string;
  configureHref?: string;
  analyticsHref?: string;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {analyticsHref && (
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link href={analyticsHref}>
              <ChartColumnIcon />
              View analytics
            </Link>
          </Button>
        )}
        {configureHref && (
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link href={configureHref}>
              <PencilRulerIcon />
              Open in Creator
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
