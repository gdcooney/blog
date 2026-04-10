# Claude Code — Blog project prompt

## Context

This is the second of two tasks for the blog redesign. The first task (lab project) has already:
- Added blog profile config columns to ms_profiles
- The shared Supabase database is used by both the lab (lab.proveitsme.io) and blog (blog.proveitsme.io) projects

Read the attached CLAUDE.md for blog project conventions before starting.

## Live schema reference

### ms_profiles

| column_name       | data_type                   | is_nullable | column_default        |
|-------------------|-----------------------------|-------------|-----------------------|
| id                | uuid                        | NO          | null                  |
| display_name      | text                        | YES         | null                  |
| coach_persona     | text                        | YES         | 'stoic'               |
| created_at        | timestamp with time zone    | YES         | now()                 |
| dob               | date                        | YES         | null                  |
| height_cm         | integer                     | YES         | null                  |
| preferred_units   | text                        | YES         | 'metric'              |
| body_type_score   | integer                     | YES         | 50                    |
| about_me          | text                        | YES         | null                  |
| target_protein    | integer                     | YES         | 200                   |
| target_calories   | integer                     | YES         | 2500                  |
| target_steps      | integer                     | YES         | 10000                 |
| username          | text                        | NO          | null                  |
| avatar_url        | text                        | YES         | null                  |
| blog_accent_color | text                        | NO          | '#D85A30'             |
| blog_font         | text                        | NO          | 'serif'               |
| blog_bg           | text                        | NO          | 'light'               |
| social_links      | jsonb                       | NO          | '[]'                  |
| blog_enabled      | boolean                     | NO          | true                  |
| display_avatar    | boolean                     | NO          | true                  |
| display_links     | boolean                     | NO          | true                  |

> Note: the bio/about field is `about_me` (text, nullable).

### ms_daily_logs

| column_name     | data_type                   | is_nullable | column_default      |
|-----------------|-----------------------------|-------------|---------------------|
| id              | uuid                        | NO          | gen_random_uuid()   |
| user_id         | uuid                        | NO          | null                |
| sprint_id       | uuid                        | YES         | null                |
| log_date        | date                        | NO          | CURRENT_DATE        |
| journal_content | text                        | YES         | null                |
| mood_score      | integer                     | YES         | 3                   |
| meta_summary    | text                        | YES         | null                |
| embedding       | halfvec(3072)               | YES         | null                |
| is_published    | boolean                     | YES         | false               |
| updated_at      | timestamp with time zone    | YES         | now()               |
| draft_content   | text                        | YES         | null                |
| detected_tags   | text[]                      | YES         | '{}'                |

> Note: `journal_content` stores HTML (from Tiptap editor). Render as HTML, not plain text.
> Note: `detected_tags` are internal AI signals — do NOT display on the blog.

### ms_annotations

| column_name      | data_type                   | is_nullable | column_default    |
|------------------|-----------------------------|-------------|-------------------|
| id               | uuid                        | NO          | gen_random_uuid() |
| log_id           | uuid                        | NO          | null              |
| author_type      | text                        | NO          | null              |
| author_role      | text                        | NO          | null              |
| content          | text                        | NO          | null              |
| embedding        | vector(1536)                | YES         | null              |
| user_rating      | integer                     | YES         | null              |
| human_correction | text                        | YES         | null              |
| created_at       | timestamp with time zone    | YES         | now()             |
| user_id          | uuid                        | YES         | null              |
| applied_rules    | uuid[]                      | YES         | '{}'              |
| persona_id       | uuid                        | YES         | null              |

> Note: join `persona_id` to `ms_persona_registry` to get the coach name and specialty for display.

### ms_annotation_feedback

| column_name      | data_type                   | is_nullable | column_default    |
|------------------|-----------------------------|-------------|-------------------|
| id               | uuid                        | NO          | gen_random_uuid() |
| profile_id       | uuid                        | NO          | null              |
| annotation_id    | uuid                        | NO          | null              |
| log_id           | uuid                        | NO          | null              |
| signal           | text                        | NO          | null              |
| reason_code      | text                        | YES         | null              |
| reason_text      | text                        | YES         | null              |
| original_content | text                        | YES         | null              |
| correction       | text                        | YES         | null              |
| source           | text                        | NO          | 'user'            |
| tag_keys         | text[]                      | YES         | null              |
| processed        | boolean                     | NO          | false             |
| created_at       | timestamp with time zone    | YES         | now()             |

> Note: `signal` values are `'up'` or `'down'`. Use this to render feedback notes below annotations.
> Note: there is no `vote` column — use `signal` instead.

### ms_sprints

| column_name   | data_type                   | is_nullable | column_default    |
|---------------|-----------------------------|-------------|-------------------|
| id            | uuid                        | NO          | gen_random_uuid() |
| user_id       | uuid                        | NO          | null              |
| misogi_id     | uuid                        | YES         | null              |
| sprint_number | integer                     | NO          | null              |
| start_date    | date                        | NO          | null              |
| end_date      | date                        | NO          | null              |
| created_at    | timestamp with time zone    | YES         | now()             |
| focus_area    | text                        | YES         | null              |
| targets       | jsonb                       | YES         | '[]'              |
| title         | text                        | YES         | null              |
| goals         | jsonb                       | YES         | '[]'              |

> Note: active sprint = `start_date <= today AND end_date >= today`. No `status` column exists — use date range.

## Task: Redesign the blog to match the approved design spec

### Design spec

The approved design has these characteristics:
- Clean editorial layout, max-width 720px, centred
- Serif body text for journal entries and coach annotations
- Coral accent colour (#D85A30) applied via CSS custom property --accent, driven by blog_accent_color from ms_profiles
- Font family driven by blog_font ('serif' or 'sans')
- Background driven by blog_bg: light = white/transparent, warm = #FAF8F4, dark = #1A1917

### Site header

- Left: stylized URL text — blog.proveitsme.io/[username] — plain text, not a link
- Right: small circular avatar (28px) using the site contact avatar (initials "PI") + email link to info@proveitsme.io
- Separated from content below by a 0.5px border

### Athlete header (profile section)

- Left side:
  - Circular avatar (56px): if display_avatar = true AND avatar_url is set → render <img>; if display_avatar = true AND avatar_url is null → render initials circle (first letter of display_name) using --accent colour family; if display_avatar = false → render nothing
  - Display name (serif, 32px)
  - Bio text (from ms_profiles.about_me — this is the bio field in the live schema)
  - Social links row: if display_links = true, map social_links jsonb array to <a> elements. Email platform gets mailto: prefix. All others open _blank with rel="noopener noreferrer"
- Right side: sprint card (see below)
- Separated from entries below by a 0.5px border

### Sprint card

- Background: secondary surface
- Label: "Sprint [number]" in uppercase 11px
- Sprint name
- Progress bar (3px height, --accent fill, width = dayNumber/totalDays as percentage)
- "Day X of Y" label
- Data comes from ms_sprints — fetch the active sprint for the user (where start_date <= today <= end_date)

### Journal entries (feed)

Each entry:
- Meta row: date (uppercase, 12px), day badge (pill), mood dots (5 dots, filled with --accent up to mood_score)
- Body text: journal_content rendered as HTML (it is stored as HTML from Tiptap editor), serif font
- DO NOT display detected_tags or any hashtag content — these are internal AI signals only
- Coach annotation block below body (see below)
- Entries separated by a 0.5px divider

### Coach annotation block

- 2px left border in --accent colour
- Coach avatar (26px initials circle, --accent colour family)
- Coach name + specialty from ms_annotations (join to ms_persona_registry for persona name/specialty)
- Annotation body: italic serif, 14px
- Feedback note (below annotation body, 12px, normal weight, sans):
  - Query ms_annotation_feedback for this annotation_id
  - If signal = 'down' → render "↓ [display_name] found this advice unhelpful."
  - If signal = 'up' → render "↑ [display_name] found this advice useful."
  - If no row → render nothing

### Routing

- /[username] — profile feed page. Check ms_profiles where username matches. If no row OR blog_enabled = false → return 404.
- /[username]/[date] — single entry page (date = YYYY-MM-DD). Same profile check. Set canonical URL.

### SEO and structured data

Add JSON-LD to <head> on every page:

Profile feed page:
```json
{
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "[display_name]'s Chronicle",
  "url": "https://blog.proveitsme.io/[username]",
  "author": { "@type": "Person", "name": "[display_name]" }
}
```

Individual entry page:
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Day [N] of [total] — [date formatted as readable string]",
  "datePublished": "[ISO date]",
  "author": { "@type": "Person", "name": "[display_name]" },
  "url": "https://blog.proveitsme.io/[username]/[date]"
}
```

Use semantic HTML throughout:
- <article> per journal entry
- <time datetime="[ISO]"> for all dates
- <address> wrapping social links / contact info
- <header>, <main>, <footer> at page level

### Component breakdown

Create or refactor these components:

```
SiteHeader.astro        — URL display + contact avatar + email
AthleteHeader.astro     — avatar, name, bio, social links, sprint card
SprintCard.astro        — sprint name, progress bar, day count
JournalEntry.astro      — date meta, mood dots, body HTML, annotation
CoachAnnotation.astro   — avatar, name, specialty, italic body, feedback note
```

### CSS custom properties

Set on <body> or :root from ms_profiles values:
```css
--accent: [blog_accent_color]
```

Use --accent for: annotation left border, mood dot fill, sprint progress bar fill, avatar background tint.
For avatar background tint use --accent at 10% opacity: `background: color-mix(in srgb, var(--accent) 15%, transparent)`

### Privacy rules

The blog must respect ms_profiles flags:
- blog_enabled = false → 404
- display_avatar = false → no avatar rendered anywhere
- display_links = false → no social links rendered

### Existing code to preserve

Check the existing codebase before creating new files:
- RSS feed (rss.xml.ts) — update to use new routing if slug pattern changes, otherwise leave alone
- OG image generation (og.png.ts) — leave alone
- Pagefind search — leave alone
- Light/dark mode toggle — preserve existing behaviour
- Prev/Next navigation — update to use new URL pattern if changed

### Build requirement

Run npm run build after all changes. Fix any TypeScript or build errors before considering the task complete. Do not hand back with a broken build.
