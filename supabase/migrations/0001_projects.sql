-- Projects table: one row per portfolio project, jsonb blocks for the
-- repeatable case-study sections (context, challenges, delivered, timeline,
-- metrics, stack, gallery) since they're always authored as a single unit
-- from one admin form.

create extension if not exists "pgcrypto";

create table public.projects (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  title          text not null,
  type_key       text not null check (type_key in ('tCrm', 'tWebApp', 'tInternal', 'tSite')),
  variant        text not null default 'compact' check (variant in ('featured', 'compact')),
  sort_order     int not null default 0,
  published      boolean not null default false,
  tech           text[] not null default '{}',

  summary        jsonb not null,            -- {en, sr} — card blurb + <meta description>
  cover          jsonb,                     -- {src, width, height, alt:{en,sr}}

  -- Case study fields. has_case_study = false means the card renders but isn't a link.
  has_case_study boolean not null default false,
  year           text,
  role           jsonb,                     -- {en, sr}
  client         text,
  scope          jsonb,                     -- {en, sr}, e.g. "Solo" / "Backend, team of 4"
  status         text check (status in ('live', 'internal', 'archived')),
  url            text,
  context        jsonb not null default '[]',  -- [{en,sr}] paragraphs
  challenges     jsonb not null default '[]',  -- [{problem:{en,sr}, solution:{en,sr}}] — optional ("what went wrong")
  delivered      jsonb not null default '[]',  -- [{title:{en,sr}, detail:{en,sr}}] — required ("what shipped")
  timeline       jsonb not null default '[]',  -- [{label:{en,sr}, detail:{en,sr}}] — growth phases
  metrics        jsonb not null default '[]',  -- [{value:'300+', label:{en,sr}}]
  stack          jsonb not null default '[]',  -- [{group:{en,sr}, items:text[]}]
  gallery        jsonb not null default '[]',  -- [{src,width,height,alt,caption}], max 5
  note           jsonb,                        -- NDA / internal-system disclaimer

  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),

  constraint gallery_max_5 check (jsonb_array_length(gallery) <= 5)
);

create index projects_sort_order_idx on public.projects (sort_order);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger projects_set_updated_at
  before update on public.projects
  for each row
  execute function public.set_updated_at();

alter table public.projects enable row level security;

-- Public: anyone (including anonymous visitors) can read published projects.
create policy "public read published"
  on public.projects
  for select
  to anon, authenticated
  using (published = true);

-- Admin: the one authorized account can do anything, published or not.
create policy "admin full access"
  on public.projects
  for all
  to authenticated
  using ((auth.jwt() ->> 'email') = 'dejan.lukic98@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'dejan.lukic98@gmail.com');
