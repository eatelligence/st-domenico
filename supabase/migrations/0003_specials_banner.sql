create table public.specials (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  subtitle    text not null default '',
  description text not null default '',
  highlight   text,
  days        text not null default '',
  "time"      text,
  note        text,
  image_url   text not null,
  theme       text not null default 'charcoal'
              check (theme in ('green', 'terracotta', 'charcoal')),
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- singleton: unique + check(true) allows exactly one row to exist
create table public.site_banner (
  id         uuid primary key default gen_random_uuid(),
  singleton  boolean not null default true unique check (singleton),
  message    text not null,
  href       text not null default '#bookings',
  is_active  boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_specials_order on public.specials(sort_order);

create trigger trg_specials_updated before update on public.specials
  for each row execute function public.set_updated_at();
create trigger trg_banner_updated before update on public.site_banner
  for each row execute function public.set_updated_at();

alter table public.specials enable row level security;
alter table public.site_banner enable row level security;

create policy public_read_specials on public.specials
  for select to anon using (is_active = true);
create policy admin_all_specials on public.specials
  for all to authenticated using (true) with check (true);

create policy public_read_banner on public.site_banner
  for select to anon using (is_active = true);
create policy admin_all_banner on public.site_banner
  for all to authenticated using (true) with check (true);
