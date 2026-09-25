-- Storage bucket for project cover/gallery images, uploaded from the admin form.

insert into storage.buckets (id, name, public)
values ('work', 'work', true)
on conflict (id) do nothing;

create policy "public read work images"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'work');

create policy "admin write work images"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'work'
    and (auth.jwt() ->> 'email') = 'dejan.lukic98@gmail.com'
  );

create policy "admin update work images"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'work'
    and (auth.jwt() ->> 'email') = 'dejan.lukic98@gmail.com'
  );

create policy "admin delete work images"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'work'
    and (auth.jwt() ->> 'email') = 'dejan.lukic98@gmail.com'
  );
