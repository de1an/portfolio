# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the dev server (Next.js picks the next free port if 3000 is taken, e.g. 3001 — check the terminal output for the actual URL)
- `npm run build` — production build (also runs TypeScript type-checking and ESLint)
- `npm start` — serve the production build (run `build` first)
- `npm run lint` — run ESLint only

There is no test suite yet.

### Environment

Copy `.env.example` to `.env.local` and fill in a Supabase project's URL/publishable key plus `ADMIN_EMAIL` (see "Supabase & admin panel" below). Without it, `getProjects()`/`getProject()` log an error and return an empty result instead of throwing — the public site still renders, just with an empty Work section.

## Architecture

Next.js App Router project (TypeScript, Tailwind CSS) — a single-page, snap-scrolling personal site (Hero/Service/About/Work/Experience/Contact) plus per-project case study pages and a Supabase-backed admin panel for managing project content.

- `app/layout.tsx` — root layout; only `<html>`/`<body>`, fonts (`next/font` Anton + Archivo), `globals.css`, and `LanguageProvider`. No page chrome here — that's per route group.
- `app/(site)/layout.tsx` — chrome shared by the public site: `CustomCursor`, `AmbientBackground`, `Nav`, `<main>`, `Footer`.
- `app/(site)/page.tsx` — the home page. Async server component; fetches `getProjects()` and renders the six sections in order, plus `ScrollSnapController` and `SectionDotRail` (mounted here, not in the layout, so they only apply to this one page).
- `app/(site)/work/[slug]/page.tsx` — case study page for one project. Statically generated (`generateStaticParams`, `revalidate = 3600`, `dynamicParams = true`) for every published project that has a case study; `notFound()` otherwise. Renders `components/sections/case-study-view.tsx`.
- `app/(admin)/layout.tsx` + `app/(admin)/admin/**` — the admin panel (login, project list, new/edit forms). No site chrome. Protected by `middleware.ts`.
- `components/sections/` — one component per home-page section, plus `project-card.tsx` (`FeaturedProjectCard`/`CompactProjectCard`) and `case-study-view.tsx`.
- `components/common/` — shared UI and infrastructure: `Section` (snap-scroll wrapper, home page only) vs. `CaseStudySection` (plain scrolling wrapper, case study page only — **do not** use `Section` there, it forces `min-h-screen` + scroll-snap), `LanguageProvider`/`useLanguage`, `Reveal`, `AnimatedHeading`, `GhostWord`, `Pill`, `CtaLink`, `ScrollSnapController`, `SectionDotRail`.
- `components/admin/` — admin-only UI: `ProjectForm` (the whole create/edit form), `Repeater` (generic add/remove/reorder list editor used for every repeatable case-study block), `LocalizedInput`/`LocalizedTextarea` (EN|SR field pairs), `ImageUpload` (uploads straight to Supabase Storage from the browser), `ProjectList`.
- `components/nav.tsx` / `components/Footer.tsx` — global nav (EN/SR toggle) and footer. Nav's section links are absolute (`/#work`, not `#work`) since it's mounted on both the home page and case study pages.
- `hooks/` — `useActiveSection`, `useDragScroll` (Work rail), `useDrift` (parallax), `useSectionScrollNav` (wheel/keyboard one-section-per-gesture, home page only).

### Content model & data layer

Projects live in Supabase, not in the codebase — there's no dashboard-free "edit the array" workflow anymore.

- `lib/project-schema.ts` — the zod schema (`Project`, `ProjectInput`, `CaseStudy`, `Localized`, etc.) that is the single source of truth for the shape of a project. Every text field is `{ en, sr }`. Import types from here (not `lib/projects.ts`) in any **client** component — `lib/projects.ts` pulls in the cookie-based Supabase server client, which can't be bundled for the browser.
- `lib/projects.ts` — server-only data access: `getProjects()`/`getProject(slug)` (published only, anonymous client — safe to call from `generateStaticParams`), `getAdjacentProject(slug)` (next case study, for the "next project" link), `getProjectsForAdmin()`/`getProjectByIdForAdmin(id)` (all rows, cookie-authenticated, used only under `/admin`). Rows are validated with the zod schema on the way out; an invalid row is skipped and logged rather than crashing the page.
- `lib/supabase/public.ts` — anonymous, cookie-free client (RLS limits it to `published = true`). Use for anything that might run at build time.
- `lib/supabase/server.ts` — cookie-aware client for Server Components/Actions that need the admin session (draft rows).
- `lib/supabase/client.ts` — browser client, used by the login form and `ImageUpload`.
- A project's model: cover image (slider + case study top), up to 5 gallery images (DB `check` constraint + zod `.max(5)`), fact strip (year/role/client/scope/status/url), overview paragraphs, **optional** "challenges" (problem → solution pairs — the "what went wrong" block, not every project has one), required "delivered" list (what shipped), optional timeline (growth phases), optional metrics, grouped tech stack, optional NDA/internal-system note.

### Supabase & admin panel

- `supabase/migrations/` — `0001_projects.sql` (table + RLS), `0002_storage.sql` (`work` storage bucket + policies), `0003_seed.sql` (the original 9 projects; `compass-holding` has a fully filled-in case study as a living template, the rest are summary-only). Applied via the Supabase CLI (`devDependency`, invoked with `npx supabase` or through the npm script below) — not raw `psql`, so nothing but the project ref and a one-time login is needed:
  1. `npx supabase login` — one-time, opens a browser to authenticate the CLI.
  2. `npx supabase link --project-ref <ref>` — one-time per machine; `<ref>` is the subdomain of `NEXT_PUBLIC_SUPABASE_URL` (`https://<ref>.supabase.co`), also visible in the dashboard URL. Prompts once for the database password to verify the link.
  3. `npm run db:push` — runs `supabase db push --linked`, applying any migration files not yet recorded in the project's migration history, in filename order. Safe to re-run: already-applied files are skipped, and the seed is additionally idempotent (`on conflict (slug) do nothing`).
- One admin account, created by hand in the Supabase dashboard (Authentication → Users) — there's no signup route. `ADMIN_EMAIL` must match that account's email; it's checked in three independent places: `middleware.ts` (redirects `/admin/*` to `/admin/login`), every server action in `app/(admin)/admin/actions.ts` (`requireAdmin()`), and the `admin full access` RLS policy in the DB (hardcoded to the same email — update it there too if the admin email ever changes).
- Saving a project (`saveProject` in `actions.ts`) validates through `projectInputSchema` and calls `revalidatePath` on `/`, `/work/[slug]` and `/admin` — the public pages are ISR, so a save shows up without a redeploy.
- Images upload directly from the browser to the `work` Storage bucket (`ImageUpload`), scoped by RLS to the authenticated admin; the public URL is what gets stored on the project row.

### Styling

Tailwind CSS utility classes throughout, no CSS modules or styled-components. Dark-only palette (CSS variables in `globals.css`); `darkMode: "media"` is configured in `tailwind.config.ts` but there's no light-mode token set or `dark:` usage yet.

## Known gaps / intentional stubs

- The contact form sends email via Resend (`app/api/contact/route.ts`) — requires `RESEND_API_KEY` and `ADMIN_EMAIL` in env; without a verified sending domain it falls back to Resend's shared `onboarding@resend.dev` sender (fine for delivery to you, but set `CONTACT_FROM_EMAIL` once a domain is verified).
- Only `compass-holding` has a complete case study; the other 8 seeded projects have a summary but no `has_case_study` — their cards render but aren't links until filled in via `/admin`.
- No project has real screenshots yet — `cover`/`gallery` are optional and the UI falls back to a placeholder block.
- Not yet connected to a GitHub remote or a Vercel project — deployment to Vercel (and setting the same env vars there) is a manual follow-up.
