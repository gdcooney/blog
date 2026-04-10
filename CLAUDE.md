# Blog Project — CLAUDE.md

## Project Overview

Personal chronicle blog called **proveItsMe.io** ("No theory. Just the work."). Built on **Astro 5** with SSR, backed by a **Supabase** PostgreSQL database. Deployed on **Vercel**.

## Tech Stack

- **Framework:** Astro 5.5+ (SSR mode, `output: "server"`)
- **Language:** TypeScript 5.8
- **Styling:** TailwindCSS 4 + Tailwind Typography
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel (serverless adapter)
- **Search:** Pagefind (client-side)
- **OG Images:** Satori + Sharp (dynamic per post)
- **Date handling:** dayjs
- **File uploads:** AWS S3 with presigned URLs
- **Testing:** Vitest (integration tests against local dev server)

## Dev Commands

```bash
npm run dev         # Start dev server at localhost:4321
npm run build       # Production build
npm run preview     # Preview production build
npm test            # Run integration tests (requires dev server on port 4322)
npm run test:watch  # Re-run tests on file changes
```

To run tests, start the dev server on port 4322 first:
```bash
npm run dev -- --port 4322
npm test
```

Docker is also available (`docker-compose up`) for local/self-hosted runs.

## Key Directory Structure

```
src/
  pages/
    index.astro                 # Homepage
    [username].astro            # Chronicle feed page (/gee)
    [username]/
      [date].astro              # Single entry page (/gee/2026-04-10)
    posts/[slug].astro          # Legacy post route
    log/[slug].astro            # Legacy log route
    api/log.ts                  # POST endpoint: inserts into Supabase `logs` table
    rss.xml.ts                  # RSS feed
    og.png.ts                   # OG image generation
  layouts/
    Layout.astro                # Main layout (SEO, structured data)
    PostDetails.astro           # Individual post layout (legacy)
  components/
    SiteHeader.astro            # Top bar: URL text + PI avatar + email link
    AthleteHeader.astro         # Profile: avatar, name, bio, social links, sprint card
    SprintCard.astro            # Sprint name, progress bar, Day X of Y
    JournalEntry.astro          # Date meta, day badge, mood dots, HTML body, annotations
    CoachAnnotation.astro       # Left-border block: coach avatar, name, italic body, feedback
    Header.astro                # Legacy header
    Footer.astro                # Footer
    Card.astro                  # Legacy card component
    (and other legacy components)
  lib/
    supabase.ts                 # Public Supabase client (anon key)
    supabase-server.ts          # Server-only client (service role key, bypasses RLS)
  utils/                        # Helpers: sorting, filtering, OG, slugify, etc.
  config.ts                     # Site-wide configuration
  constants.ts                  # Social links and share config
  types.ts                      # TypeScript interfaces
api/
  get-presigned-url.ts          # Vercel serverless function for S3 uploads
tests/
  blog.test.ts                  # Integration tests (28 tests)
vitest.config.ts                # Vitest configuration
```

## Content Architecture

Content lives in **Supabase**, not markdown files. The main table is `ms_daily_logs`:

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `log_date` | Date | Used as URL slug (YYYY-MM-DD) |
| `journal_content` | HTML string | From Tiptap editor — render with `set:html`, never as plain text |
| `mood_score` | 1–5 | Mood rating |
| `is_published` | boolean | Draft/published flag — always filter `eq('is_published', true)` |
| `detected_tags` | text[] | Internal AI signals — **do NOT display** |

URL pattern: `/[username]/[date]` (e.g. `/gee/2026-04-10`)

## Supabase Query Notes

### Two Supabase clients

| Client | File | Key | Use for |
|--------|------|-----|---------|
| `supabase` | `lib/supabase.ts` | anon key | Public data: profiles, logs, annotations |
| `supabaseServer` | `lib/supabase-server.ts` | service role key | RLS-protected tables: `ms_sprints`, `ms_annotation_feedback` |

**`ms_sprints` has RLS enabled** — the anon key returns nothing. Always use `supabaseServer` for sprint queries.

### Persona registry join — use explicit FK hint

`ms_annotations` has two FKs to `ms_persona_registry`, which causes an HTTP 300 ambiguity error if you don't specify which to use:

```typescript
// CORRECT — explicit FK hint
ms_annotations(
  id, author_type, author_role, content, persona_id,
  ms_persona_registry!ms_annotations_persona_id_fkey(display_name, specialty)
)

// WRONG — ambiguous, returns empty data silently
ms_annotations(
  id, ...,
  ms_persona_registry(name, specialty)   // 'name' column doesn't exist either
)
```

The persona registry column is `display_name`, not `name`.

### Active sprint query

```typescript
const today = new Date().toISOString().split("T")[0];
supabaseServer
  .from("ms_sprints")
  .eq("user_id", profile.id)
  .lte("start_date", today)
  .gte("end_date", today)
  .maybeSingle()
```

No `status` column exists — active = `start_date <= today <= end_date`.

## Environment Variables

```
PUBLIC_SUPABASE_URL          # Supabase project URL
PUBLIC_SUPABASE_ANON_KEY     # Supabase anonymous key (public)
SUPABASE_SERVICE_ROLE_KEY    # Server-side key — bypasses RLS. Set in Vercel.
                             # Also add to .env for local dev (file is gitignored).
# AWS credentials for S3 are set in Vercel environment
```

## Chronicle Page Design

### CSS custom properties

Set inline on `<body>` from `ms_profiles` values:

| Profile field | CSS / style effect |
|---|---|
| `blog_accent_color` | `--accent` CSS var (coral `#D85A30` default) |
| `blog_bg` | background: `light`=#fff, `warm`=#FAF8F4, `dark`=#1A1917 |
| `blog_font` | font-family: `serif`=Georgia stack, `sans`=system-ui stack |

`--accent` drives: annotation left border, mood dot fill, sprint progress bar, avatar tints.

### Privacy flags (always respect)

| Flag | Effect |
|---|---|
| `blog_enabled = false` | Return 404 |
| `display_avatar = false` | Render no avatar anywhere |
| `display_links = false` | Render no social links |

### Layout

- Max-width 720px, centred
- `<header>` → SiteHeader (site URL + PI avatar + email)
- `<section>` → AthleteHeader (profile + sprint card)
- `<main>` → feed of JournalEntry articles
- `<footer>` → URL slug

### Semantic HTML

- `<article>` per journal entry
- `<time datetime="YYYY-MM-DD">` for all dates
- `<address>` wrapping social links / contact info

## Site Configuration (`src/config.ts`)

- `website`: `https://blog.proveitsme.io`
- `author`: `Gee`
- `timezone`: `Australia/Melbourne`
- `editPost` URL: `https://lab.proveitsme.io/?date=` (external editor)

## Code Conventions

- **Prettier:** 2-space tabs, trailing commas (ES5), semicolons, Tailwind class sorting
- **TypeScript:** Strict mode, NodeNext module resolution
- **Import style:** Use `@/` alias (e.g. `@/lib/supabase.js` — `.js` extension required with NodeNext)
- **Components:** PascalCase for `.astro` files
- **Commits:** Conventional commits style (cz.yaml present)

## Testing

Integration tests in `tests/blog.test.ts` cover:
- Feed page: HTTP 200, articles present, no empty-state fallback, dates/badges/mood, JSON-LD `Blog`
- Single-entry page: HTTP 200, one article, canonical URL, prev/next links, JSON-LD `BlogPosting`, coach annotation
- 404 cases: unknown username, unknown date, unknown user on entry route

Tests make real HTTP requests to the running dev server — they require a live Supabase connection. Run with `npm test` (server must be on port 4322).
