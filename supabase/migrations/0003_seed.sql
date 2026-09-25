-- Seeds the 9 projects that previously lived in lib/projects.ts.
-- compass-holding gets a fully filled-in case study to serve as the living
-- template in the admin panel; the rest carry only a summary for now.

insert into public.projects
  (slug, title, type_key, variant, sort_order, published, tech, summary, has_case_study,
   year, role, client, scope, status, context, challenges, delivered, timeline, metrics, stack, note)
values (
  'compass-holding',
  'Compass Holding',
  'tCrm',
  'featured',
  0,
  true,
  array['Laravel', 'Livewire', 'MSSQL'],
  '{"en": "An internal CRM that replaced spreadsheets and email threads for a multi-company holding.", "sr": "Interni CRM koji je zamenio Excel tabele i email prepisku za holding sa više firmi."}'::jsonb,
  true,
  '2022 — danas',
  '{"en": "Full-stack developer", "sr": "Full-stack developer"}'::jsonb,
  'Compass Holding',
  '{"en": "Solo, ongoing maintenance", "sr": "Samostalno, u stalnom razvoju"}'::jsonb,
  'internal',
  '[
    {"en": "Compass Holding runs several companies under one roof — trucking, funding, legal and accounting — and none of them had a shared system for tracking clients, deals and internal tasks. Everything lived in spreadsheets, inboxes and people''s memory.", "sr": "Compass Holding vodi nekoliko firmi pod jednim krovom — transport, finansiranje, pravne usluge i knjigovodstvo — i nijedna od njih nije imala zajednički sistem za praćenje klijenata, poslova i internih zadataka. Sve je živelo u Excel tabelama, mejlovima i nečijem sećanju."},
    {"en": "I was brought in to build a single internal CRM that every company in the group could use, on top of their existing MSSQL data where possible instead of starting from a blank database.", "sr": "Angažovan sam da napravim jedinstven interni CRM koji bi koristile sve firme u grupi, i to nad njihovim postojećim MSSQL podacima gde god je to bilo moguće, umesto da se kreće od prazne baze."}
  ]'::jsonb,
  '[
    {"problem": {"en": "Client and deal data was scattered across spreadsheets that different people kept in different formats — there was no single source of truth.", "sr": "Podaci o klijentima i poslovima bili su razbacani po tabelama koje su različiti ljudi vodili na različite načine — nije postojao jedan izvor istine."}, "solution": {"en": "Migrated the existing MSSQL tables into a normalized schema and built import tooling so each company could bring its own spreadsheets in without losing history.", "sr": "Migrirao sam postojeće MSSQL tabele u normalizovanu šemu i napravio alat za uvoz podataka kako bi svaka firma mogla da unese svoje tabele bez gubitka istorije."}},
    {"problem": {"en": "Non-technical staff needed to update records constantly, but any UI heavy enough to need a page reload per action was going to get abandoned.", "sr": "Neophodno je bilo da netehničko osoblje stalno ažurira zapise, a svaki UI koji bi za svaku akciju tražio ponovno učitavanje strane bio bi brzo napušten."}, "solution": {"en": "Built the interface in Livewire so edits, filters and inline updates happen without full page reloads, closer to a desktop app than a traditional server-rendered CRUD screen.", "sr": "Interfejs sam napravio u Livewire-u tako da izmene, filteri i unos podataka rade bez ponovnog učitavanja strane — bliže desktop aplikaciji nego klasičnom server-renderovanom CRUD ekranu."}}
  ]'::jsonb,
  '[
    {"title": {"en": "Unified client & deal pipeline", "sr": "Objedinjen pregled klijenata i poslova"}, "detail": {"en": "One place to track every client and deal across all four companies, with per-company permissions.", "sr": "Jedno mesto za praćenje svih klijenata i poslova kroz sve četiri firme, sa dozvolama po firmi."}},
    {"title": {"en": "Task & reminder system", "sr": "Sistem zadataka i podsetnika"}, "detail": {"en": "Assignable internal tasks tied to clients and deals, replacing ad-hoc email follow-ups.", "sr": "Interni zadaci koji se dodeljuju i vezuju za klijente i poslove, umesto praćenja preko mejla."}},
    {"title": {"en": "Role-based access", "sr": "Pristup po ulogama"}, "detail": {"en": "Each company only sees its own data by default; holding-level admins see across all of them.", "sr": "Svaka firma po difoltu vidi samo svoje podatke; administratori na nivou holdinga vide sve."}},
    {"title": {"en": "Reporting dashboard", "sr": "Izveštajni dashboard"}, "detail": {"en": "Added later — pipeline volume and task completion rates per company, on request from management.", "sr": "Dodato naknadno — obim poslova i procenat izvršenih zadataka po firmi, na zahtev menadžmenta."}}
  ]'::jsonb,
  '[
    {"label": {"en": "V1 — Core CRM", "sr": "V1 — Osnovni CRM"}, "detail": {"en": "Client records, deal pipeline, migrated from existing spreadsheets and MSSQL tables.", "sr": "Zapisi o klijentima, pregled poslova, migrirano iz postojećih tabela i MSSQL baze."}},
    {"label": {"en": "V2 — Tasks & permissions", "sr": "V2 — Zadaci i dozvole"}, "detail": {"en": "Internal task assignment and per-company role-based access.", "sr": "Dodeljivanje internih zadataka i pristup po ulogama za svaku firmu."}},
    {"label": {"en": "V3 — Reporting", "sr": "V3 — Izveštavanje"}, "detail": {"en": "Management-facing dashboard with pipeline and task metrics.", "sr": "Dashboard za menadžment sa metrikama poslova i zadataka."}}
  ]'::jsonb,
  '[
    {"value": "4", "label": {"en": "companies on one system", "sr": "firme na jednom sistemu"}},
    {"value": "0", "label": {"en": "spreadsheets left in daily use", "sr": "tabela u svakodnevnoj upotrebi"}}
  ]'::jsonb,
  '[
    {"group": {"en": "Backend", "sr": "Backend"}, "items": ["Laravel", "Livewire", "MSSQL"]},
    {"group": {"en": "Frontend", "sr": "Frontend"}, "items": ["Livewire", "Alpine.js", "Tailwind CSS"]},
    {"group": {"en": "Infra", "sr": "Infrastruktura"}, "items": ["Docker", "Nginx"]}
  ]'::jsonb,
  '{"en": "Internal business system — screenshots are limited to protect client data.", "sr": "Interni poslovni sistem — snimci su ograničeni zbog zaštite podataka klijenata."}'::jsonb
)
on conflict (slug) do nothing;

insert into public.projects (slug, title, type_key, variant, sort_order, published, tech, summary)
values
  ('docdot', 'DocDot', 'tWebApp', 'featured', 1, true,
   array['Next.js', 'Nest.js', 'PostgreSQL'],
   '{"en": "A web app project built with Next.js, Nest.js and PostgreSQL.", "sr": "Veb aplikacija izgrađena u Next.js, Nest.js i PostgreSQL tehnologijama."}'::jsonb),

  ('autoskola-4x4-app', 'AutoSkola 4x4', 'tInternal', 'featured', 2, true,
   array['Laravel', 'Tailwind', 'Docker'],
   '{"en": "An internal scheduling application for a driving school.", "sr": "Interna aplikacija za zakazivanje za autoškolu."}'::jsonb),

  ('compass-funding', 'Compass Funding', 'tInternal', 'compact', 3, true,
   array[]::text[],
   '{"en": "Internal web app for the Compass group.", "sr": "Interna veb aplikacija za Compass grupu."}'::jsonb),

  ('compass-truck-sales', 'Compass Truck Sales', 'tInternal', 'compact', 4, true,
   array[]::text[],
   '{"en": "Internal web app for the Compass group.", "sr": "Interna veb aplikacija za Compass grupu."}'::jsonb),

  ('compass-legal', 'Compass Legal', 'tInternal', 'compact', 5, true,
   array[]::text[],
   '{"en": "Internal web app for the Compass group.", "sr": "Interna veb aplikacija za Compass grupu."}'::jsonb),

  ('compass-accounting', 'Compass Accounting', 'tInternal', 'compact', 6, true,
   array[]::text[],
   '{"en": "Internal web app for the Compass group.", "sr": "Interna veb aplikacija za Compass grupu."}'::jsonb),

  ('ng-one', 'NG-ONE', 'tWebApp', 'compact', 7, true,
   array[]::text[],
   '{"en": "A web application project.", "sr": "Veb aplikacija."}'::jsonb),

  ('autoskola-4x4-site', 'AutoSkola 4x4', 'tSite', 'compact', 8, true,
   array[]::text[],
   '{"en": "A public website for a driving school.", "sr": "Javni veb sajt za autoškolu."}'::jsonb)
on conflict (slug) do nothing;
