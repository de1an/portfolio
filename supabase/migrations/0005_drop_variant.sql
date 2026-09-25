-- Drops the featured/compact variant distinction — every project card now
-- renders the same way (what used to be the "featured" style: cover image,
-- tech pills, summary).

alter table public.projects
  drop constraint projects_variant_check;

alter table public.projects
  drop column variant;
