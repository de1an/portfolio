-- Collapses the project type taxonomy from four values down to two:
-- tCrm and tInternal were both really "it's a web app", just internal ones —
-- tWebApp already covers that distinction; tSite is unaffected.

update public.projects
set type_key = 'tWebApp'
where type_key in ('tCrm', 'tInternal');

alter table public.projects
  drop constraint projects_type_key_check;

alter table public.projects
  add constraint projects_type_key_check check (type_key in ('tWebApp', 'tSite'));
