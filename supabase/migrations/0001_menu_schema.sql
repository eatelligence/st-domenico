-- updated_at auto-touch (search_path pinned per Supabase security advisor 0011)
create or replace function public.set_updated_at()
returns trigger language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end $$;

create table public.menu_categories (
  id          uuid primary key default gen_random_uuid(),
  label       text not null,
  emoji       text not null default '',
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.menu_items (
  id             uuid primary key default gen_random_uuid(),
  category_id    uuid not null references public.menu_categories(id) on delete cascade,
  name           text not null,
  description    text not null default '',
  price          text,
  price_gf       text,
  is_vegetarian  boolean not null default false,
  is_gluten_free boolean not null default false,
  is_seafood     boolean not null default false,
  badge          text,
  allergens      text,
  sort_order     integer not null default 0,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index idx_items_category on public.menu_items(category_id, sort_order);
create index idx_categories_order on public.menu_categories(sort_order);

create trigger trg_categories_updated before update on public.menu_categories
  for each row execute function public.set_updated_at();
create trigger trg_items_updated before update on public.menu_items
  for each row execute function public.set_updated_at();

-- RLS
alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;

create policy public_read_categories on public.menu_categories
  for select to anon using (is_active = true);
create policy public_read_items on public.menu_items
  for select to anon using (is_active = true);

create policy admin_all_categories on public.menu_categories
  for all to authenticated using (true) with check (true);
create policy admin_all_items on public.menu_items
  for all to authenticated using (true) with check (true);
