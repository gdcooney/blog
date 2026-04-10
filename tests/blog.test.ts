/**
 * Integration tests for the blog chronicle pages.
 *
 * Prerequisites: dev server must be running on the port set by TEST_PORT
 * (defaults to 4322).  Run `npm run dev -- --port 4322` before executing.
 *
 * Usage:
 *   npm test                  # run once
 *   npm run test:watch        # re-run on file changes
 */

import { describe, it, expect, beforeAll } from "vitest";

// ── config ────────────────────────────────────────────────────────────────────
const BASE_URL = `http://localhost:${process.env.TEST_PORT ?? 4322}`;

/** Known-good username that has published entries in the DB */
const USERNAME = "gee";

/** A date we know has a published entry (confirmed from the DB) */
const KNOWN_DATE = "2026-04-09";

/** A date we know does NOT have an entry */
const UNKNOWN_DATE = "1999-01-01";

// ── helpers ───────────────────────────────────────────────────────────────────
async function get(path: string) {
  const res = await fetch(`${BASE_URL}${path}`);
  const html = await res.text();
  return { status: res.status, html };
}

function countMatches(html: string, pattern: string | RegExp): number {
  if (typeof pattern === "string") {
    return html.split(pattern).length - 1;
  }
  return (html.match(new RegExp(pattern.source, "g")) ?? []).length;
}

// ── smoke: server reachable ───────────────────────────────────────────────────
describe("dev server", () => {
  it("is reachable", async () => {
    const res = await fetch(BASE_URL);
    expect(res.status).toBeLessThan(500);
  });
});

// ── feed page: /[username] ────────────────────────────────────────────────────
describe(`feed page /${USERNAME}`, () => {
  let html = "";

  beforeAll(async () => {
    const res = await get(`/${USERNAME}`);
    html = res.html;
    expect(res.status).toBe(200);
  });

  it("returns HTTP 200", async () => {
    const { status } = await get(`/${USERNAME}`);
    expect(status).toBe(200);
  });

  it("renders the site header with username", () => {
    expect(html).toContain(`blog.proveitsme.io/${USERNAME}`);
  });

  it("renders the athlete display name", () => {
    expect(html).toContain("Gee");
  });

  it("renders at least one journal entry article", () => {
    const count = countMatches(html, "<article");
    expect(count).toBeGreaterThan(0);
  });

  it("renders more than five entries (all published logs)", () => {
    const count = countMatches(html, "<article");
    expect(count).toBeGreaterThan(5);
  });

  it("does NOT show the empty-state fallback", () => {
    expect(html).not.toContain("No published entries yet");
  });

  it("each entry has a <time> date element", () => {
    const timeCount = countMatches(html, /datetime="\d{4}-\d{2}-\d{2}"/);
    const articleCount = countMatches(html, "<article");
    // every entry should have at least one <time>
    expect(timeCount).toBeGreaterThanOrEqual(articleCount);
  });

  it("entries have day-number badges", () => {
    expect(html).toContain("journal-entry__badge");
    expect(html).toMatch(/Day \d+/);
  });

  it("entries have mood dots", () => {
    expect(html).toContain("journal-entry__dot");
  });

  it("entry links use /[username]/[date] URL pattern", () => {
    // Pagination or internal links should follow the new pattern, not /log/
    expect(html).not.toContain(`href="/log/`);
  });

  it("sets --accent CSS custom property on body", () => {
    expect(html).toMatch(/--accent:\s*#[0-9a-fA-F]{6}/);
  });

  it("renders a <main> landmark", () => {
    expect(html).toContain("<main");
  });

  it("renders a <footer>", () => {
    expect(html).toContain("<footer");
  });

  it("includes JSON-LD structured data of type Blog", () => {
    expect(html).toContain('"@type":"Blog"');
  });
});

// ── 404 cases for the feed page ───────────────────────────────────────────────
describe("feed page 404 cases", () => {
  it("returns 404 for an unknown username", async () => {
    const { status } = await get("/this-user-definitely-does-not-exist-xyz");
    expect(status).toBe(404);
  });
});

// ── single-entry page: /[username]/[date] ────────────────────────────────────
describe(`single entry /${USERNAME}/${KNOWN_DATE}`, () => {
  let html = "";

  beforeAll(async () => {
    const res = await get(`/${USERNAME}/${KNOWN_DATE}`);
    html = res.html;
    expect(res.status).toBe(200);
  });

  it("returns HTTP 200", async () => {
    const { status } = await get(`/${USERNAME}/${KNOWN_DATE}`);
    expect(status).toBe(200);
  });

  it("renders exactly one journal entry article", () => {
    const count = countMatches(html, "<article");
    expect(count).toBe(1);
  });

  it("renders the correct date in a <time> element", () => {
    expect(html).toContain(`datetime="${KNOWN_DATE}"`);
  });

  it("has a back-link to the chronicle feed", () => {
    expect(html).toContain(`href="/${USERNAME}"`);
  });

  it("has prev/next pagination links", () => {
    // The entry has neighbours, so at least one pagination link should exist
    const count = countMatches(html, "entry-pagination__link");
    expect(count).toBeGreaterThan(0);
  });

  it("pagination links use /[username]/[date] pattern", () => {
    expect(html).toMatch(
      new RegExp(`href="/${USERNAME}/\\d{4}-\\d{2}-\\d{2}"`)
    );
  });

  it("sets a canonical URL in <head>", () => {
    expect(html).toContain(
      `<link rel="canonical" href="https://blog.proveitsme.io/${USERNAME}/${KNOWN_DATE}"`
    );
  });

  it("includes JSON-LD structured data of type BlogPosting", () => {
    expect(html).toContain('"@type":"BlogPosting"');
  });

  it("includes the ISO date in JSON-LD datePublished", () => {
    expect(html).toContain(`"datePublished":"${KNOWN_DATE}"`);
  });

  it("renders a coach annotation block if one exists", () => {
    // This entry (2026-04-09) is confirmed to have an AI annotation
    expect(html).toContain("coach-annotation");
  });
});

// ── single-entry page 404 cases ───────────────────────────────────────────────
describe("single entry 404 cases", () => {
  it("returns 404 for a valid user but non-existent date", async () => {
    const { status } = await get(`/${USERNAME}/${UNKNOWN_DATE}`);
    expect(status).toBe(404);
  });

  it("returns 404 for an unknown user on entry route", async () => {
    const { status } = await get(`/nobody/${KNOWN_DATE}`);
    expect(status).toBe(404);
  });
});
