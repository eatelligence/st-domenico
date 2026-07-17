# Specials + promo banner on Supabase — design

Date: 2026-07-17
Status: approved

## Problem

The "What's On" specials section and the promo top bar are hardcoded. Changing either
requires a code change and a deploy, so the restaurant owner cannot update them alone.
The immediate trigger: all three specials need rewriting and the "Free Nutella Calzone"
top bar must come down.

Today:

- `lib/data/specials.ts` — a literal `Special[]` of three entries.
- `components/sections/Specials.tsx` — picks image and gradient by array index
  (`specialImages[i]`, `gradients[index]`). A fourth special would read `undefined`
  for both and render broken.
- `components/sections/TopBar.tsx` — the message is a module constant `MSG`.
- The admin dashboard (`app/admin/**`) covers menu categories and items only.
  Specials were explicitly deferred in the 2026-07-16 Supabase menu design.

## Goal

Move specials and the banner into Supabase, add admin panels for both, and remove the
index-based image/gradient coupling — so content changes need no deploy.

## Decisions

| Question | Decision |
|---|---|
| Banner | Editable from the dashboard (text, link, active toggle) — not deleted |
| Special images | Upload to Supabase Storage |
| Card colours | Three fixed themes: `green`, `terracotta`, `charcoal` |
| Number of cards | Unbounded; grid wraps at 3 per row |
| Seed data | All three current specials incl. calzone; banner seeded **inactive** |
| Data model | Two tables (`specials`, `site_banner`) — rejected: one `promos` table with a `kind` column (NULL columns per type), and a generic `site_settings` key/value table (YAGNI) |

## Schema — `supabase/migrations/0003_specials_banner.sql`

Follows `0001_menu_schema.sql`: `set_updated_at` trigger, RLS on, anon reads active
rows, authenticated writes.

```sql
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

create table public.site_banner (
  id         uuid primary key default gen_random_uuid(),
  singleton  boolean not null default true unique check (singleton),
  message    text not null,
  href       text not null default '#bookings',
  is_active  boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

The `singleton` column with `unique` + `check (singleton)` allows exactly one row.

`time` is quoted — it is a reserved word in SQL.

The current `price` field is dropped: `Specials.tsx` never renders it (the card shows
`highlight`, which already contains the price). Keeping it would be a form field nobody
sees.

Index: `create index idx_specials_order on public.specials(sort_order);`

RLS mirrors the menu tables:

```sql
create policy public_read_specials on public.specials
  for select to anon using (is_active = true);
create policy admin_all_specials on public.specials
  for all to authenticated using (true) with check (true);
create policy public_read_banner on public.site_banner
  for select to anon using (is_active = true);
create policy admin_all_banner on public.site_banner
  for all to authenticated using (true) with check (true);
```

Note: the anon banner policy hides the row entirely when inactive, so the public query
returns no row and the bar does not render — the same outcome as reading `is_active`.
The admin panel uses the authenticated client and always sees the row.

## Seed — `supabase/migrations/0004_seed_specials.sql`

Three rows from `lib/data/specials.ts` verbatim (bottomless → `green`, sunday →
`terracotta`, calzone → `charcoal`), with `image_url` set to the **existing local
paths** (`/images/0J5A9373.webp`, `/images/image-asset.webp`,
`/images/STDOM_OCT_PS--07.webp`). Existing photos are not migrated into Storage: Next
`<Image>` handles local paths and remote URLs in the same prop, so only newly uploaded
photos live in the bucket.

One `site_banner` row with today's `MSG` text, `href = '#bookings'`, `is_active = false`
— the bar disappears on deploy with no manual step, but the text survives for reuse.

## Storage

Bucket `specials`, public read, authenticated write.

- Accepted: `image/jpeg`, `image/png`, `image/webp`. Max 5 MB.
- Filename made unique on upload so concurrent uploads cannot overwrite each other.
- `next.config.mjs` gains `images.remotePatterns` for the Supabase project host —
  without it Next refuses to optimise the remote image and the card renders blank.
- Editing a special without choosing a file keeps the current `image_url`.
- Replaced photos are **not** deleted from the bucket. Deliberate: auto-deleting risks
  removing a file still referenced elsewhere, and orphaned objects are harmless.

## Public site

Mirrors the menu's existing DB-with-static-fallback pattern.

- `lib/db/queries/specials.ts` — `createAnonClient()` + `unstable_cache` with tag
  `specials`, `revalidate: 3600`. Also `getBanner()` with tag `banner`.
- `components/sections/SpecialsServer.tsx` — new server component; queries, falls back
  to `lib/data/specials.ts` when the DB returns empty, renders `<Specials specials={…} />`.
  `app/page.tsx` swaps `Specials` for `SpecialsServer`.
- `components/sections/Specials.tsx` — takes `specials` as a prop instead of importing
  it. `specialImages` and the index-keyed `gradients` array are deleted; image comes
  from `special.imageUrl`, gradient from a `theme → class` map with all three Tailwind
  class strings written literally so the JIT compiles them. This closes the
  `specialImages[3] === undefined` bug: any number of cards renders correctly.
- `lib/data/specials.ts` — kept as the static fallback and the source of the `Special`
  type (gains `imageUrl`, `theme`; loses `price`, `color`, `accentColor`). Its three
  literal entries are rewritten to the new shape — `imageUrl` set to the same local
  paths the seed uses, `theme` to `green`/`terracotta`/`charcoal` — so the fallback
  renders identically to the DB path. There is no static fallback for the banner: if
  the query returns nothing, the bar simply does not render.
- `StickyHeader.tsx` — currently a client component owning dismiss state. Splits: a
  server component reads `getBanner()` and renders `<TopBar>` with `message`/`href`
  only when a row comes back; the dismiss state stays in a client child. `TopBar` loses
  the `MSG` constant and takes props.

## Dashboard

Two new `AdminNav` links: Specials, Banner.

- `app/admin/(protected)/specials/page.tsx` + `_components/SpecialList.tsx`,
  `SpecialForm.tsx` — modelled on `menu/[categoryId]`'s `ItemList`/`ItemForm`. List
  shows image thumbnail, title, active state, Edit/Delete. Delete is soft
  (`is_active = false`), restorable — same as menu items. Form has the table's fields,
  theme as a three-way choice, and a file input.
- `app/admin/(protected)/banner/page.tsx` — single form: message, href, active checkbox.
- `app/admin/actions/specials.ts` and `banner.ts` — same shape as `menu.ts`:
  `requireUser()`, Zod parse, check the Supabase `error`, `revalidateTag`, return
  `{ error }` to the form rather than throwing.
- `lib/db/queries/admin.ts` gains `getAdminSpecials()`, `getAdminSpecial(id)`,
  `getAdminBanner()` — the admin reads include inactive rows.
- New specials get `sort_order = max + 1`, as `createMenuItem` does.

## Error handling

| Failure | Behaviour |
|---|---|
| Upload rejected (type/size) | Form shows the message; nothing is saved |
| Storage or DB write fails | Action returns `{ error }`; form shows it |
| DB unreachable on read | Public site falls back to static specials; banner hidden |
| No valid session on write | `requireUser()` redirects to `/admin/login` |

## Verification

No test suite exists in this project, and this design does not introduce one.
Verification is `npm run build` (typecheck + build) plus driving the real flows locally:

1. Create a special with a new photo → card appears on the site.
2. Edit it without re-uploading → image is preserved.
3. Delete it → card disappears from the public section.
4. Turn the banner off → the bar disappears; turn it on → text and link are correct.
5. Create a fourth special → the grid wraps and no gradient or image is `undefined`
   (the regression this design fixes).

## Out of scope

Manual card reordering (creation order stands), automatic cleanup of replaced photos,
edit history, live preview in the form.
