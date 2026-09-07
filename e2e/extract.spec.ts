import { test, expect } from "@playwright/test";

/**
 * The paper way into the claims form: a scan, a photo or a PDF goes to
 * `/api/extract`, and the answers come back keyed by question name.
 *
 * These tests deliberately never reach an LLM — the endpoint is asserted on the
 * input it rejects, so the suite costs nothing and needs no key.
 */

test("the claims page offers extraction from a document", async ({ page }) => {
  await page.goto("/claims");

  await expect(page.getByRole("button", { name: "Fill from a document" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Try the sample CMS-1500" })).toBeVisible();

  // The sample ships with the template rather than being fetched from anywhere.
  const sample = await page.request.get("/samples/cms-1500-filled.pdf");
  expect(sample.status()).toBe(200);
});

test("the extract endpoint rejects a request with no document", async ({ request }) => {
  const response = await request.post("/api/extract", {
    multipart: { formId: "medical-form" },
  });

  expect(response.status()).toBe(400);
  expect((await response.json()).error).toContain("No document");
});
