# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the dev server (Next.js picks the next free port if 3000 is taken, e.g. 3001 — check the terminal output for the actual URL)
- `npm run build` — production build (also runs TypeScript type-checking and ESLint)
- `npm start` — serve the production build (run `build` first)
- `npm run lint` — run ESLint only

There is no test suite yet.

## Architecture

Next.js App Router project (TypeScript, Tailwind CSS), scaffolded as a personal portfolio site with three content sections: About, Projects, Contact.

- `app/layout.tsx` — root layout; wraps every page with the shared `Nav` and `Footer` components and imports `app/globals.css` (Tailwind directives).
- `app/page.tsx`, `app/about/page.tsx`, `app/projects/page.tsx`, `app/contact/page.tsx` — one route per top-level nav item. Each is a server component; only components that need interactivity (like the contact form) are client components.
- `components/` — shared UI: `Nav`, `Footer`, `ProjectCard`, `ContactForm`. `ContactForm` is a `"use client"` component that POSTs JSON to `/api/contact` and renders idle/submitting/success/error states.
- `lib/projects.ts` — the single source of truth for project data (`Project` type + a `projects` array). The Projects page maps over this array and renders a `ProjectCard` per entry. Add new projects here rather than hardcoding cards in the page.
- `app/api/contact/route.ts` — API route backing the contact form. Currently validates input and logs the submission (`console.log`) instead of sending an email — there is no email provider wired up yet. If adding one (e.g. Resend, SMTP), this is the only file that needs to change.

### Styling

Tailwind CSS utility classes throughout, no CSS modules or styled-components. Dark mode is handled via Tailwind's `dark:` variant driven by `prefers-color-scheme` (no theme toggle exists — this follows Tailwind's default `media` strategy).

## Known gaps / intentional stubs

- The contact form does not actually send email yet — `app/api/contact/route.ts` only logs the submission server-side.
- Placeholder content: the name in `app/page.tsx`, the bio/skills/experience in `app/about/page.tsx`, and the single example entry in `lib/projects.ts` all need to be replaced with real content.
- Not yet connected to a GitHub remote or a Vercel project — deployment to Vercel is a manual follow-up (the app itself needs zero Vercel-specific config).
