# Blog Project — CLAUDE.md

## Project Overview

Personal chronicle blog called **proveItsMe.io** ("No theory. Just the work."). Built on **Astro 5** with SSR, backed by a **Supabase** PostgreSQL database. Deployed on **Vercel**.

## Tech Stack

- **Framework:** Astro 5.5.2 (SSR mode, `output: "server"`)
- **Language:** TypeScript 5.8
- **Styling:** TailwindCSS 4 + Tailwind Typography
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel (serverless adapter)
- **Search:** Pagefind (client-side, zero-JS server requirement)
- **OG Images:** Satori + Sharp (dynamic per post)
- **Date handling:** dayjs
- **File uploads:** AWS S3 with presigned URLs

## Dev Commands

```bash
npm run dev       # Start dev server at localhost:4321
npm run build     # Production build
npm run preview   # Preview production build
```

Docker is also available (`docker-compose up`) for local/self-hosted runs.

## Key Directory Structure

```
src/
  pages/
    index.astro           # Homepage — lists all published log entries
    posts/[slug].astro    # Dynamic post page (slug = YYYY-MM-DD date)
    log/                  # Log entry pages
    api/log.ts            # POST endpoint: inserts into Supabase `logs` table
    rss.xml.ts            # RSS feed
    og.png.ts             # OG image generation
  layouts/
    Layout.astro          # Main layout (SEO, structured data)
    PostDetails.astro     # Individual post layout
  components/             # Astro components (Header, Footer, Card, etc.)
  lib/
    supabase.ts           # Supabase client initialization
  utils/                  # Helpers: sorting, filtering, OG, slugify, etc.
  config.ts               # Site-wide configuration
  constants.ts            # Social links and share config
  types.ts                # TypeScript interfaces
api/
  get-presigned-url.ts    # Vercel serverless function for S3 uploads
```

## Content Architecture

Content lives in **Supabase**, not markdown files. The main table is `ms_daily_logs`:

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `log_date` | Date | Used as URL slug (YYYY-MM-DD) |
| `journal_content` | HTML string | From Tiptap editor |
| `mood_score` | 1–5 | Mood rating |
| `title` | text | Optional |
| `description` | text | Optional |
| `tags` | array | Tag list |
| `is_published` | boolean | Draft/published flag |

URL pattern: `/log/YYYY-MM-DD`

## Environment Variables

```
PUBLIC_SUPABASE_URL          # Supabase project URL
PUBLIC_SUPABASE_ANON_KEY     # Supabase anonymous key (public)
SUPABASE_SERVICE_ROLE_KEY    # Server-side Supabase key (API routes)
# AWS credentials for S3 are set in Vercel environment
```

## Site Configuration (`src/config.ts`)

- `website`: `https://blog.proveitsme.io`
- `author`: `Gee`
- `timezone`: `Australia/Melbourne`
- `postPerPage`: 4
- `editPost` URL: `https://lab.proveitsme.io/?date=` (external editor)

## Code Conventions

- **Prettier:** 2-space tabs, trailing commas (ES5), semicolons, Tailwind class sorting
- **TypeScript:** Strict mode, ESNext target
- **Components:** PascalCase for `.astro` files
- **Path alias:** `@/` → `src/`
- **Commits:** Commitizen/conventional commits style (cz.yaml present)

## Notable Features

- Light/dark mode toggle
- Prev/Next navigation between log entries
- Scroll progress bar
- Copy-to-clipboard for code blocks
- Heading anchor links
- Dynamic OG image per post
- RSS feed at `/rss.xml`
- Pagefind full-text search
- Vercel Analytics integrated
- Markdown: Remark plugins for TOC and collapsible sections
- Syntax highlighting: Shiki (`min-light` / `night-owl` themes)
