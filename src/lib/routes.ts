/** Survey Creator, opened on one form — the link every demo points at. */
export function configureHref(formId: string): string {
  return `/configure?form=${encodeURIComponent(formId)}`;
}

/** The dashboard for one form — the same `?form=` contract as the designer. */
export function analyticsHref(formId: string): string {
  return `/analytics?form=${encodeURIComponent(formId)}`;
}
