# Supabase Menu Management Dashboard — Design

**Date:** 2026-07-16
**Project:** st-domenico (stdomenicopizzabar.com)
**Author:** Salvo Rincione / Eatelligence (with Claude)
**Status:** Approved design → ready for implementation plan

## Goal

Give the St Domenico client a real, responsive menu-management dashboard (a "gestionale") where they can create/edit/delete/reorder menu **categories** and **items**, in the spirit of the La Botte d'Oro dashboard. St Domenico already has a working admin for this, built on Turso/libsql with a bcrypt/iron-session password login, but it is not live. This project **migrates that existing admin to Supabase** and switches the login to Supabase Auth.

Scope is **menu only** (categories + items). No events/hours/specials/packages panels (those were explicitly deferred).

## Context / current state

- **Existing admin** lives in `app/admin/(protected)/` — categories manager, per-category item list + form, soft-delete/restore, dietary flags, prices, badge, allergens, sort order. Already responsive (sidebar nav + mobile bottom nav). It is good and will be reused.
- **Current DB:** Turso/libsql (SQLite). Client in `lib/db/client.ts`; SQL schema in `lib/db/schema.sql`; queries in `lib/db/queries/`; server actions in `app/admin/actions/`.
- **Current auth:** `iron-session` cookie + `bcryptjs` password (`lib/auth/session.ts`, `app/admin/login/`).
- **Public menu:** `components/sections/MenuServer.tsx` reads `getMenuCategories()` (cached, tag `menu`, 1h) and **falls back to static `lib/data/menu.ts`** when the DB is empty/unreachable. This fallback must be preserved.
- **Supabase:** project "Stdomanico" (`ref maqflisummdlfwtxioio`, region ap-northeast-1) is ACTIVE and **empty** (no tables yet).
- Deployment: Vercel, auto-deploy from `main`.

## Decisions (locked)

1. **Migrate the existing Next.js admin to Supabase** (reuse UI + server-action structure). Do not rebuild client-side like Botte d'Oro.
2. **Supabase Auth** (email + password) for the client login. No public signup; the admin user is created manually in Supabase.
3. **Scope = menu only** (categories + items).
4. **Data model stays normalized** (separate `menu_categories` + `menu_items`) — cleaner than Botte d'Oro's denormalized single-table model, and the existing UI already assumes it.
5. **Security via RLS** (like Botte d'Oro): anon can read active rows; authenticated has full access. Writes run in server actions using a Supabase server client bound to the logged-in user's cookies — **no service-role key in the app**.

## Architecture

### Data model (Supabase Postgres, `public` schema)

```sql
create table menu_categories (
  id          uuid primary key default gen_random_uuid(),
  label       text not null,
  emoji       text not null default '',
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table menu_items (
  id             uuid primary key default gen_random_uuid(),
  category_id    uuid not null references menu_categories(id) on delete cascade,
  name           text not null,
  description    text not null default '',
  price          text,          -- free text, e.g. "$22"
  price_gf       text,          -- gluten-free variant price
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

create index idx_items_category on menu_items(category_id, sort_order);
create index idx_categories_order on menu_categories(sort_order);
```

- `updated_at` auto-touch trigger on both tables (shared `update_updated_at_column()` function).
- Category `id` moves from the old TEXT slug to `uuid`. The seed keeps the human labels; item→category links use the new uuids.

### RLS policies

```sql
alter table menu_categories enable row level security;
alter table menu_items enable row level security;

-- Public read: only active rows
create policy public_read_categories on menu_categories
  for select to anon using (is_active = true);
create policy public_read_items on menu_items
  for select to anon using (is_active = true);

-- Admin (any authenticated user): full access
create policy admin_all_categories on menu_categories
  for all to authenticated using (true) with check (true);
create policy admin_all_items on menu_items
  for all to authenticated using (true) with check (true);
```

Note: the admin needs to read inactive (soft-deleted) rows to restore them — covered by the `authenticated` `for all` policy. The public server read uses the anon key, so it only sees active rows even though it runs server-side.

### Supabase clients (`lib/supabase/`)

- `server.ts` — server client via `@supabase/ssr` `createServerClient`, reading/writing the Next.js cookie store. Used by server components (public read) and server actions (admin writes, under the user's session/RLS).
- `client.ts` — browser client via `createBrowserClient`, used only by the login form.
- `middleware.ts` helper — refreshes the auth session cookie on each request.

### Auth flow

- `middleware.ts` (root) runs the Supabase session refresh and guards `/admin` (except `/admin/login`): no user → redirect to `/admin/login`.
- `app/admin/login/` — email + password form → `supabase.auth.signInWithPassword`; on success redirect to `/admin`.
- `app/admin/(protected)/layout.tsx` — verifies `supabase.auth.getUser()`; renders nav + children.
- Logout action → `supabase.auth.signOut()`.
- Remove `iron-session`, `bcryptjs`, `lib/auth/session.ts`, and the old password/session env vars.

### Server actions (rewrite, same signatures/UX)

- `app/admin/actions/categories.ts` and `menu.ts` keep their existing exported functions and form-parsing/validation (zod), but replace libsql `db.execute(...)` calls with the Supabase query builder against the cookie-bound server client.
- Keep `revalidateTag('menu')` + `revalidatePath(...)` cache invalidation.
- Sort-order handling (max+1 on insert; reorder) preserved.

### Public read (`lib/db/queries/menu.ts` → Supabase)

- Rewrite `getMenuCategories()` to query Supabase (categories + items, active only, ordered by sort_order) via the server client, keeping `unstable_cache` (tag `menu`, revalidate 3600).
- `MenuServer.tsx` unchanged: still falls back to static `lib/data/menu.ts` when the query returns empty.

### Seed

- One-time seed of the real menu from `lib/data/menu.ts` (categories: Pizze, Stuzzichini, Pasta, Pasticceria, Sweet Pizze, Drinks + their items) into Supabase, via a Supabase SQL migration or a `tsx` seed script. Replaces the old Turso `menu-seed.ts`.

### Env / config

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (from the "Stdomanico" project) in `.env.local` and Vercel.
- Remove `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `SESSION_SECRET`, admin-password vars.
- Add `@supabase/supabase-js` + `@supabase/ssr`; remove `@libsql/client`, `bcryptjs`, `iron-session`.

## Out of scope (YAGNI)

- Events, opening hours, daily specials, packages, gallery, gift cards, messages, QR panels.
- Image uploads on menu items (neither project has item images).
- Public signup / multi-role permissions (single manually-created admin user).
- Drag-and-drop reordering polish beyond the existing sort-order mechanism (can be a later enhancement).

## Testing / verification

- Local: run the app, log in via Supabase Auth, create a category, add/edit/soft-delete/restore an item, reorder, confirm the public `/#menu` reflects changes after revalidation; confirm static fallback still works when Supabase returns empty.
- RLS: verify anon (public) cannot see inactive rows and cannot write; authenticated can.
- Build passes; deploy to Vercel and verify live with the real Supabase project.

## Risks / notes

- Category id type change (TEXT slug → uuid) means the admin routes `menu/[categoryId]` now carry uuids — fine, they're opaque.
- Ensure the Vercel env vars are set before the deploy or the public menu falls back to static (acceptable, non-breaking).
- The client must have a Supabase Auth user created before they can log in.
