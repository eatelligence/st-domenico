insert into storage.buckets (id, name, public)
values ('specials', 'specials', true)
on conflict (id) do nothing;

create policy specials_public_read on storage.objects
  for select to anon using (bucket_id = 'specials');

create policy specials_auth_write on storage.objects
  for insert to authenticated with check (bucket_id = 'specials');

create policy specials_auth_update on storage.objects
  for update to authenticated using (bucket_id = 'specials');
