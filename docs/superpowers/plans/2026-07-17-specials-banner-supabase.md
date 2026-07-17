# Specials + Promo Banner on Supabase — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the hardcoded specials array and TopBar promo message into Supabase with admin panels for both, so content changes need no deploy.

**Architecture:** Two new tables (`specials`, `site_banner`) following the existing menu schema conventions. Public reads go through `createAnonClient()` + `unstable_cache` with a tag; admin writes go through server actions using the authenticated client. Special images upload to a public Supabase Storage bucket. Card colours become a `theme` enum mapped to literal Tailwind classes, replacing the index-keyed image/gradient arrays.

**Tech Stack:** Next.js 14.2.5 (App Router), React 18, TypeScript, Tailwind CSS 3.4, Supabase (`@supabase/ssr` 0.12, `@supabase/supabase-js` 2.110), Zod 4, lucide-react.

**Spec:** `docs/superpowers/specs/2026-07-17-specials-banner-supabase-design.md`

## Global Constraints

- **React 18 / Next 14.2.5** — use `useFormState` from `react-dom`, NOT `useActionState`. Match `ItemForm.tsx`.
- **No test suite exists in this project and this plan does not add one.** The spec sets verification as `npm run build` (typecheck + build) plus driving the real flows locally. Every task below ends with a build check and, where there is runtime surface, a manual check with an explicit expected observation. Do not scaffold Jest/Vitest — it is not in scope.
- **No Supabase CLI in this repo.** `supabase/migrations/*.sql` are applied by hand via the Supabase dashboard SQL editor. There is no `supabase db push`.
- **Env vars available:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` only. There is no service-role key — all writes use the authenticated user's client from `requireUser()`.
- **Theme values are exactly** `green`, `terracotta`, `charcoal` — enforced by a DB check constraint and the TS union.
- **Tailwind class strings must be written literally.** Never build a class name by interpolation; the JIT will not compile it.
- **Existing photos stay in `/public/images`.** Do not move them into Storage.
- **Copy is British/AU English**, matching the site ("Complimentary", "Bottomless").
- Follow the existing admin file conventions: `_components/` for UI, `app/admin/actions/` for server actions, `lib/db/queries/admin.ts` for admin reads.

---

## File Structure

**Create:**
- `supabase/migrations/0003_specials_banner.sql` — schema for both tables + RLS
- `supabase/migrations/0004_seed_specials.sql` — 3 specials + 1 inactive banner row
- `supabase/migrations/0005_specials_storage.sql` — bucket + storage policies
- `lib/db/queries/specials.ts` — public cached reads (`getSpecials`, `getBanner`)
- `lib/storage/specials.ts` — `uploadSpecialImage()` helper
- `components/sections/SpecialsServer.tsx` — server component, query + fallback
- `components/sections/StickyHeaderClient.tsx` — client component owning dismiss state
- `app/admin/actions/specials.ts` — create/update/delete/restore
- `app/admin/actions/banner.ts` — update
- `app/admin/(protected)/specials/page.tsx` + `_components/SpecialList.tsx`, `_components/SpecialForm.tsx`
- `app/admin/(protected)/banner/page.tsx` + `_components/BannerForm.tsx`

**Modify:**
- `lib/data/specials.ts` — reshape type + entries (static fallback)
- `components/sections/Specials.tsx` — take props, theme map, delete index arrays
- `components/sections/StickyHeader.tsx` — becomes a server component
- `components/sections/TopBar.tsx` — takes `message`/`href` props, `MSG` deleted
- `app/page.tsx:5,22` — `Specials` → `SpecialsServer`
- `lib/db/queries/admin.ts` — add admin reads for specials + banner
- `app/admin/_components/AdminNav.tsx:8-11` — two new links
- `next.config.mjs` — `images.remotePatterns`

---

### Task 1: Database schema + seed

**Files:**
- Create: `supabase/migrations/0003_specials_banner.sql`
- Create: `supabase/migrations/0004_seed_specials.sql`

**Interfaces:**
- Consumes: nothing.
- Produces: tables `public.specials` (columns: `id, title, subtitle, description, highlight, days, "time", note, image_url, theme, sort_order, is_active, created_at, updated_at`) and `public.site_banner` (`id, singleton, message, href, is_active, created_at, updated_at`). All later tasks read/write these exact column names.

- [ ] **Step 1: Write the schema migration**

Create `supabase/migrations/0003_specials_banner.sql`. Note `"time"` is quoted — it is a keyword. `set_updated_at()` already exists from `0001_menu_schema.sql`; do not redefine it.

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
```

- [ ] **Step 2: Write the seed migration**

Create `supabase/migrations/0004_seed_specials.sql`. Text copied verbatim from the current `lib/data/specials.ts`. `image_url` uses the existing local paths — photos are NOT migrated to Storage. The banner seeds `is_active = false` so the bar disappears on deploy.

```sql
insert into public.specials (title, subtitle, description, highlight, days, "time", note, image_url, theme, sort_order) values
(
  'Bottomless Gnocchi or Pizza',
  'All You Can Eat',
  'Indulge in unlimited gnocchi or pizza with your choice of Gorgonzola, Sorrentina, or Pomodoro sauce. For pizza lovers, enjoy a selection of 5 mixed pizzas — all you can eat in 90 minutes of pure Italian pleasure.',
  '$39 per person',
  'Tuesday · Wednesday · Thursday',
  'From 5:00pm',
  'Please mention ''Bottomless Gnocchi'' in your booking notes to secure this offer.',
  '/images/0J5A9373.webp',
  'green',
  0
),
(
  'Sunday Special',
  'Pizza or Pasta + Spritz',
  'Make your Sunday the most delicious day of the week. Any pizza or pasta paired with a perfectly crafted Aperol Spritz. Valid for one drink per person. Excludes Linguine di Mare.',
  '$35 per person',
  'Every Sunday',
  'All evening',
  'Valid for one Spritz per person. Excludes Linguine di Mare.',
  '/images/image-asset.webp',
  'terracotta',
  1
),
(
  'Free Nutella Calzone',
  'Sweet Ending',
  'End your dinner on the sweetest note — a complimentary Nutella Calzone folded with creamy ricotta and dusted with icing sugar, on us. The perfect Italian finale to your evening.',
  'Complimentary',
  'Tuesday · Wednesday · Thursday',
  'After dinner',
  null,
  '/images/STDOM_OCT_PS--07.webp',
  'charcoal',
  2
);

insert into public.site_banner (message, href, is_active) values
(
  '🍰  Free Nutella Calzone after dinner Tue – Thu  ·  Book Now  ›',
  '#bookings',
  false
);
```

- [ ] **Step 3: Apply both migrations in the Supabase SQL editor**

Open the project's Supabase dashboard → SQL Editor. Paste and run `0003_specials_banner.sql`, then `0004_seed_specials.sql`. There is no CLI in this repo — this is a manual step.

Expected: both run without error.

- [ ] **Step 4: Verify the data landed and RLS behaves**

In the SQL editor:

```sql
select title, theme, sort_order, is_active from public.specials order by sort_order;
select message, is_active from public.site_banner;
```

Expected: 3 specials (`green`/`terracotta`/`charcoal`, sort_order 0/1/2, all active); 1 banner row with `is_active = false`.

Then confirm the singleton constraint actually holds:

```sql
insert into public.site_banner (message) values ('second row');
```

Expected: FAILS with a unique violation on `singleton`. This is the constraint working — do not "fix" it.

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/0003_specials_banner.sql supabase/migrations/0004_seed_specials.sql
git commit -m "feat(db): add specials and site_banner tables with seed"
```

---

### Task 2: Storage bucket + Next image config

**Files:**
- Create: `supabase/migrations/0005_specials_storage.sql`
- Modify: `next.config.mjs`

**Interfaces:**
- Consumes: nothing.
- Produces: a public Storage bucket named `specials`; Next configured to optimise `https://*.supabase.co/storage/v1/object/public/**`.

- [ ] **Step 1: Write the storage migration**

Create `supabase/migrations/0005_specials_storage.sql`:

```sql
insert into storage.buckets (id, name, public)
values ('specials', 'specials', true)
on conflict (id) do nothing;

create policy specials_public_read on storage.objects
  for select to anon using (bucket_id = 'specials');

create policy specials_auth_write on storage.objects
  for insert to authenticated with check (bucket_id = 'specials');

create policy specials_auth_update on storage.objects
  for update to authenticated using (bucket_id = 'specials');
```

- [ ] **Step 2: Apply it in the Supabase SQL editor**

Run `0005_specials_storage.sql`. Expected: no error. Then Dashboard → Storage: a public bucket `specials` is listed.

- [ ] **Step 3: Add remotePatterns to next.config.mjs**

Without this, Next refuses to optimise the remote image and the card renders blank.

```js

const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  experimental: {
    optimizeCss: true,
  },
}

export default nextConfig
```

- [ ] **Step 4: Verify the build still passes**

Run: `npm run build`
Expected: build completes with no error.

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/0005_specials_storage.sql next.config.mjs
git commit -m "feat(storage): add public specials bucket and allow it in next/image"
```

---

### Task 3: Public specials — types, query, render (fixes the index bug)

**Files:**
- Modify: `lib/data/specials.ts`
- Create: `lib/db/queries/specials.ts`
- Create: `components/sections/SpecialsServer.tsx`
- Modify: `components/sections/Specials.tsx`
- Modify: `app/page.tsx:5,22`

**Interfaces:**
- Consumes: `public.specials` from Task 1; `createAnonClient()` from `lib/supabase/anon.ts`.
- Produces:
  - `type SpecialTheme = 'green' | 'terracotta' | 'charcoal'`
  - `type Special = { id, title, subtitle, description, days, time?, note?, highlight?, imageUrl, theme }`
  - `specials: Special[]` (static fallback export, unchanged name)
  - `getSpecials(): Promise<Special[]>` — cached, tag `specials`
  - `Specials({ specials }: { specials: Special[] })` — now takes a prop

- [ ] **Step 1: Reshape the static fallback**

Rewrite `lib/data/specials.ts`. `price`, `color`, `accentColor` are dropped (`price` was never rendered — the card shows `highlight`). `imageUrl` matches the seed paths.

```ts
export type SpecialTheme = 'green' | 'terracotta' | 'charcoal'

export type Special = {
  id: string
  title: string
  subtitle: string
  description: string
  days: string
  time?: string
  note?: string
  highlight?: string
  imageUrl: string
  theme: SpecialTheme
}

// Static fallback — used when the DB returns nothing (e.g. first deploy).
export const specials: Special[] = [
  {
    id: 'bottomless',
    title: 'Bottomless Gnocchi or Pizza',
    subtitle: 'All You Can Eat',
    description:
      'Indulge in unlimited gnocchi or pizza with your choice of Gorgonzola, Sorrentina, or Pomodoro sauce. For pizza lovers, enjoy a selection of 5 mixed pizzas — all you can eat in 90 minutes of pure Italian pleasure.',
    days: 'Tuesday · Wednesday · Thursday',
    time: 'From 5:00pm',
    note: "Please mention 'Bottomless Gnocchi' in your booking notes to secure this offer.",
    highlight: '$39 per person',
    imageUrl: '/images/0J5A9373.webp',
    theme: 'green',
  },
  {
    id: 'sunday',
    title: 'Sunday Special',
    subtitle: 'Pizza or Pasta + Spritz',
    description:
      'Make your Sunday the most delicious day of the week. Any pizza or pasta paired with a perfectly crafted Aperol Spritz. Valid for one drink per person. Excludes Linguine di Mare.',
    days: 'Every Sunday',
    time: 'All evening',
    note: 'Valid for one Spritz per person. Excludes Linguine di Mare.',
    highlight: '$35 per person',
    imageUrl: '/images/image-asset.webp',
    theme: 'terracotta',
  },
  {
    id: 'calzone',
    title: 'Free Nutella Calzone',
    subtitle: 'Sweet Ending',
    description:
      'End your dinner on the sweetest note — a complimentary Nutella Calzone folded with creamy ricotta and dusted with icing sugar, on us. The perfect Italian finale to your evening.',
    days: 'Tuesday · Wednesday · Thursday',
    time: 'After dinner',
    highlight: 'Complimentary',
    imageUrl: '/images/STDOM_OCT_PS--07.webp',
    theme: 'charcoal',
  },
]
```

- [ ] **Step 2: Write the public query**

Create `lib/db/queries/specials.ts`. Mirrors `lib/db/queries/menu.ts` exactly: anon client (no cookies — safe inside `unstable_cache`), log the error, return `[]` on failure so the caller can fall back.

```ts
import { unstable_cache } from 'next/cache'
import { createAnonClient } from '@/lib/supabase/anon'
import type { Special, SpecialTheme } from '@/lib/data/specials'

export type Banner = {
  message: string
  href: string
}

async function fetchSpecials(): Promise<Special[]> {
  const supabase = createAnonClient()
  const { data, error } = await supabase
    .from('specials')
    .select('id, title, subtitle, description, highlight, days, time, note, image_url, theme')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  if (error) console.error('getSpecials failed:', error)

  return (data ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    subtitle: r.subtitle,
    description: r.description,
    days: r.days,
    time: r.time ?? undefined,
    note: r.note ?? undefined,
    highlight: r.highlight ?? undefined,
    imageUrl: r.image_url,
    theme: r.theme as SpecialTheme,
  }))
}

export const getSpecials = unstable_cache(fetchSpecials, ['specials'], {
  tags: ['specials'],
  revalidate: 3600,
})

// The anon RLS policy hides the row when is_active = false, so an inactive
// banner simply returns no row and the bar does not render.
async function fetchBanner(): Promise<Banner | null> {
  const supabase = createAnonClient()
  const { data, error } = await supabase
    .from('site_banner')
    .select('message, href')
    .eq('is_active', true)
    .maybeSingle()
  if (error) console.error('getBanner failed:', error)
  return data ? { message: data.message, href: data.href } : null
}

export const getBanner = unstable_cache(fetchBanner, ['site-banner'], {
  tags: ['banner'],
  revalidate: 3600,
})
```

- [ ] **Step 3: Refactor Specials.tsx to take props and use the theme map**

Modify `components/sections/Specials.tsx`. Four changes; everything else in the file stays byte-for-byte as it is.

1. Change the import at line 5 from `import { specials } from '@/lib/data/specials'` to a type-only import:

```ts
import type { Special } from '@/lib/data/specials'
```

2. Delete the `specialImages` array (lines 8-12) entirely.

3. Replace the `SpecialCard` signature and its `gradients` array. The `index` prop stays — `ScrollReveal` still uses it for the stagger delay — but it no longer selects any content. Class strings are literal so Tailwind compiles them:

```tsx
const themeGradients: Record<Special['theme'], string> = {
  green: 'bg-gradient-to-t from-deep-green/95 via-deep-green/60 to-deep-green/20',
  terracotta: 'bg-gradient-to-t from-terracotta/95 via-terracotta/60 to-terracotta/20',
  charcoal: 'bg-gradient-to-t from-charcoal/95 via-charcoal/70 to-charcoal/30',
}

function SpecialCard({ special, index }: { special: Special; index: number }) {
```

Inside `SpecialCard`, delete the local `gradients` array (lines 50-54), change the `<Image src={imageUrl}` to `<Image src={special.imageUrl}`, and change the gradient div from `${gradients[index]}` to:

```tsx
<div className={`absolute inset-0 ${themeGradients[special.theme]}`} />
```

4. Change the default export to take a prop and drop the now-unused `imageUrl` argument:

```tsx
export default function Specials({ specials }: { specials: Special[] }) {
```

and the map at line 169:

```tsx
{specials.map((special, i) => (
  <SpecialCard key={special.id} special={special} index={i} />
))}
```

- [ ] **Step 4: Create the server wrapper**

Create `components/sections/SpecialsServer.tsx`, mirroring `MenuServer.tsx`:

```tsx
import { getSpecials } from '@/lib/db/queries/specials'
import { specials as staticSpecials } from '@/lib/data/specials'
import Specials from './Specials'

export default async function SpecialsServer() {
  let specials = await getSpecials().catch(() => [])
  // Fall back to static data if DB returns empty (e.g. during first deploy)
  if (specials.length === 0) specials = staticSpecials
  return <Specials specials={specials} />
}
```

- [ ] **Step 5: Wire it into the page**

In `app/page.tsx`, change line 5 to `import SpecialsServer from '@/components/sections/SpecialsServer'` and line 22 from `<Specials />` to `<SpecialsServer />`.

- [ ] **Step 6: Verify the build**

Run: `npm run build`
Expected: PASS. If it fails with "Property 'color' does not exist" or similar, a consumer of the old `Special` shape was missed — grep for it: `grep -rn "accentColor\|specialImages" --include=*.tsx --include=*.ts .` should return nothing.

- [ ] **Step 7: Verify the section renders from the DB**

Run `npm run dev`, open `http://localhost:3000/#specials`.
Expected: three cards, visually identical to before — green, terracotta, charcoal, same photos, same text.

Then prove the index bug is dead. In the Supabase SQL editor:

```sql
insert into public.specials (title, subtitle, description, highlight, days, image_url, theme, sort_order)
values ('Test Fourth', 'Temp', 'Temporary row to prove the grid wraps.', 'Test', 'Monday', '/images/0J5A9373.webp', 'green', 3);
```

Restart `npm run dev` (the query is cached for an hour) and reload.
Expected: a fourth card renders below the first three with a real photo and a real green gradient — no blank image, no missing overlay. This is the regression that `specialImages[3] === undefined` used to cause.

Then remove it:

```sql
delete from public.specials where title = 'Test Fourth';
```

- [ ] **Step 8: Commit**

```bash
git add lib/data/specials.ts lib/db/queries/specials.ts components/sections/Specials.tsx components/sections/SpecialsServer.tsx app/page.tsx
git commit -m "feat(specials): read from Supabase, replace index-keyed images/gradients with theme"
```

---

### Task 4: Public banner — StickyHeader split, TopBar props

**Files:**
- Modify: `components/sections/StickyHeader.tsx`
- Create: `components/sections/StickyHeaderClient.tsx`
- Modify: `components/sections/TopBar.tsx`

**Interfaces:**
- Consumes: `getBanner(): Promise<Banner | null>` from Task 3.
- Produces: `TopBar({ message, href, onDismiss })`; `StickyHeader` is now an async server component taking no props.

**Why the split:** `StickyHeader` currently owns the dismiss state so it must stay a client component, but it now needs an `await`. A server parent fetches and a client child keeps the state.

- [ ] **Step 1: Give TopBar props and delete the hardcoded message**

Rewrite `components/sections/TopBar.tsx`. The `MSG` constant is deleted. The `aria-label` was hardcoded to the calzone offer — it becomes generic, since the message is now editable.

```tsx
'use client'

import { ChevronRight, X } from 'lucide-react'

interface TopBarProps {
  message: string
  href: string
  onDismiss?: () => void
}

export default function TopBar({ message, href, onDismiss }: TopBarProps) {
  return (
    <div className="bg-terracotta text-cream relative overflow-hidden" style={{ height: '36px' }}>
      {/* Marquee track — two copies side-by-side so the loop is seamless */}
      <div className="flex items-center h-full">
        <div className="flex whitespace-nowrap animate-marquee">
          {/* Repeat the message many times so there are no gaps regardless of screen width */}
          {Array.from({ length: 6 }).map((_, i) => (
            <a
              key={i}
              href={href}
              className="inline-flex items-center gap-2 px-12 text-[11px] sm:text-xs font-inter tracking-wide hover:text-gold-light transition-colors"
              aria-label={message}
            >
              <span>{message}</span>
              <ChevronRight size={11} className="opacity-70 shrink-0" />
            </a>
          ))}
        </div>
      </div>

      {/* Dismiss — sits above the marquee */}
      <button
        onClick={onDismiss}
        className="absolute right-0 top-0 bottom-0 w-10 flex items-center justify-center text-cream/60 hover:text-cream transition-colors bg-terracotta z-10"
        aria-label="Close promotional bar"
      >
        <X size={12} />
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Create the client child that owns dismiss state**

Create `components/sections/StickyHeaderClient.tsx` — this is the old `StickyHeader` body, now receiving the banner as a prop:

```tsx
'use client'

import { useState } from 'react'
import TopBar from './TopBar'
import Navbar from './Navbar'
import type { Banner } from '@/lib/db/queries/specials'

export default function StickyHeaderClient({ banner }: { banner: Banner | null }) {
  const [topBarVisible, setTopBarVisible] = useState(true)

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {banner && topBarVisible && (
        <TopBar
          message={banner.message}
          href={banner.href}
          onDismiss={() => setTopBarVisible(false)}
        />
      )}
      <Navbar />
    </div>
  )
}
```

- [ ] **Step 3: Turn StickyHeader into a server component**

Rewrite `components/sections/StickyHeader.tsx`. Note there is no static fallback for the banner: no row means no bar.

```tsx
import { getBanner } from '@/lib/db/queries/specials'
import StickyHeaderClient from './StickyHeaderClient'

export default async function StickyHeader() {
  const banner = await getBanner().catch(() => null)
  return <StickyHeaderClient banner={banner} />
}
```

`app/page.tsx` needs no change — `Home` is a server component, so it can render an async child.

- [ ] **Step 4: Verify the build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 5: Verify the bar is gone**

Run `npm run dev`, open `http://localhost:3000`.
Expected: **no terracotta bar at the top** — the seeded row is `is_active = false`. The navbar sits flush at the top of the viewport. This is the user's original request, now satisfied.

Then confirm the on-state works. In the SQL editor: `update public.site_banner set is_active = true;`, restart `npm run dev`, reload.
Expected: the marquee bar is back with the calzone text, clicking it scrolls to `#bookings`, and the X dismisses it.

Turn it back off: `update public.site_banner set is_active = false;`

- [ ] **Step 6: Commit**

```bash
git add components/sections/StickyHeader.tsx components/sections/StickyHeaderClient.tsx components/sections/TopBar.tsx
git commit -m "feat(banner): drive the promo bar from site_banner instead of a hardcoded message"
```

---

### Task 5: Admin reads + upload helper + specials actions

**Files:**
- Modify: `lib/db/queries/admin.ts`
- Create: `lib/storage/specials.ts`
- Create: `app/admin/actions/specials.ts`

**Interfaces:**
- Consumes: `requireUser()` from `lib/supabase/server.ts`; the `specials` table and bucket.
- Produces:
  - `type AdminSpecial = { id, title, subtitle, description, highlight, days, time, note, imageUrl, theme, sortOrder, isActive }` — nullable text fields are `string | null` (unlike public `Special`, which uses `undefined`)
  - `getAdminSpecials(): Promise<AdminSpecial[]>`, `getAdminSpecial(id): Promise<AdminSpecial | null>`, `getAdminBanner(): Promise<AdminBanner | null>`
  - `uploadSpecialImage(supabase, file): Promise<string>` — returns a public URL, throws `Error` with a user-facing message on invalid input
  - `createSpecial(prevState, formData)`, `updateSpecial(id, prevState, formData)`, `deleteSpecial(id)`, `restoreSpecial(id)` — all returning `{ error: string }` where applicable, matching `menu.ts`

- [ ] **Step 1: Add the admin reads**

Append to `lib/db/queries/admin.ts` (it already imports `createClient` from `@/lib/supabase/server` — reuse it). Admin reads include inactive rows, so no `.eq('is_active', true)` filter.

```ts
export type AdminSpecial = {
  id: string
  title: string
  subtitle: string
  description: string
  highlight: string | null
  days: string
  time: string | null
  note: string | null
  imageUrl: string
  theme: 'green' | 'terracotta' | 'charcoal'
  sortOrder: number
  isActive: boolean
}

export type AdminBanner = {
  id: string
  message: string
  href: string
  isActive: boolean
}

type SpecialRow = {
  id: string
  title: string
  subtitle: string
  description: string
  highlight: string | null
  days: string
  time: string | null
  note: string | null
  image_url: string
  theme: string
  sort_order: number
  is_active: boolean
}

const SPECIAL_COLS =
  'id, title, subtitle, description, highlight, days, time, note, image_url, theme, sort_order, is_active'

function rowToSpecial(r: SpecialRow): AdminSpecial {
  return {
    id: r.id,
    title: r.title,
    subtitle: r.subtitle,
    description: r.description,
    highlight: r.highlight,
    days: r.days,
    time: r.time,
    note: r.note,
    imageUrl: r.image_url,
    theme: r.theme as AdminSpecial['theme'],
    sortOrder: r.sort_order,
    isActive: r.is_active,
  }
}

export async function getAdminSpecials(): Promise<AdminSpecial[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('specials')
    .select(SPECIAL_COLS)
    .order('sort_order', { ascending: true })
  if (error) console.error('getAdminSpecials failed:', error)
  return (data ?? []).map((r) => rowToSpecial(r as SpecialRow))
}

export async function getAdminSpecial(id: string): Promise<AdminSpecial | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('specials').select(SPECIAL_COLS).eq('id', id).maybeSingle()
  if (error) console.error('getAdminSpecial failed:', error)
  return data ? rowToSpecial(data as SpecialRow) : null
}

export async function getAdminBanner(): Promise<AdminBanner | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('site_banner')
    .select('id, message, href, is_active')
    .maybeSingle()
  if (error) console.error('getAdminBanner failed:', error)
  return data ? { id: data.id, message: data.message, href: data.href, isActive: data.is_active } : null
}
```

- [ ] **Step 2: Write the upload helper**

Create `lib/storage/specials.ts`. `crypto.randomUUID()` is available in Node 18+ and keeps concurrent uploads from overwriting each other. Errors carry user-facing text because the action surfaces them straight to the form.

```ts
import type { SupabaseClient } from '@supabase/supabase-js'

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp']

const EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

/**
 * Uploads a special's image to the public `specials` bucket.
 * Returns the public URL. Throws with a user-facing message on invalid input.
 */
export async function uploadSpecialImage(supabase: SupabaseClient, file: File): Promise<string> {
  if (!ALLOWED.includes(file.type)) {
    throw new Error('Image must be a JPEG, PNG or WebP file.')
  }
  if (file.size > MAX_BYTES) {
    throw new Error('Image must be smaller than 5 MB.')
  }

  const path = `${crypto.randomUUID()}.${EXT[file.type]}`
  const { error } = await supabase.storage.from('specials').upload(path, file, {
    contentType: file.type,
    upsert: false,
  })
  if (error) throw new Error('Image upload failed. Please try again.')

  const { data } = supabase.storage.from('specials').getPublicUrl(path)
  return data.publicUrl
}
```

- [ ] **Step 3: Write the specials actions**

Create `app/admin/actions/specials.ts`, following `app/admin/actions/menu.ts` step for step: `requireUser()`, Zod parse, check the Supabase `error`, `revalidateTag`, return `{ error }` rather than throwing.

Note the image rule: required on create, optional on update (no file chosen = keep the existing `image_url`). The `file.size > 0` check matters — an untouched file input still submits an empty `File`.

```ts
'use server'

import { revalidateTag, revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireUser } from '@/lib/supabase/server'
import { uploadSpecialImage } from '@/lib/storage/specials'

const SpecialSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().default(''),
  description: z.string().default(''),
  highlight: z.string().optional(),
  days: z.string().default(''),
  time: z.string().optional(),
  note: z.string().optional(),
  theme: z.enum(['green', 'terracotta', 'charcoal']),
})

function parseForm(formData: FormData) {
  return SpecialSchema.parse({
    title: formData.get('title'),
    subtitle: formData.get('subtitle') ?? '',
    description: formData.get('description') ?? '',
    highlight: formData.get('highlight') || undefined,
    days: formData.get('days') ?? '',
    time: formData.get('time') || undefined,
    note: formData.get('note') || undefined,
    theme: formData.get('theme'),
  })
}

function pickFile(formData: FormData): File | null {
  const file = formData.get('image')
  // An untouched file input still submits an empty File — treat that as "no file".
  if (file instanceof File && file.size > 0) return file
  return null
}

function invalidate() {
  revalidateTag('specials')
  revalidatePath('/admin/specials', 'page')
}

function toMessage(e: unknown): string {
  if (e instanceof z.ZodError) return e.issues[0]?.message ?? 'Invalid data.'
  if (e instanceof Error) return e.message
  return 'Error saving.'
}

export async function createSpecial(prevState: { error: string }, formData: FormData) {
  const { supabase } = await requireUser()
  try {
    const data = parseForm(formData)
    const file = pickFile(formData)
    if (!file) throw new Error('An image is required.')
    const imageUrl = await uploadSpecialImage(supabase, file)

    const { data: maxRow } = await supabase
      .from('specials')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle()
    const sortOrder = (maxRow?.sort_order ?? -1) + 1

    const { error } = await supabase.from('specials').insert({
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      highlight: data.highlight ?? null,
      days: data.days,
      time: data.time ?? null,
      note: data.note ?? null,
      image_url: imageUrl,
      theme: data.theme,
      sort_order: sortOrder,
    })
    if (error) throw error
    invalidate()
    return { error: '' }
  } catch (e) {
    return { error: toMessage(e) }
  }
}

export async function updateSpecial(id: string, prevState: { error: string }, formData: FormData) {
  const { supabase } = await requireUser()
  try {
    const data = parseForm(formData)
    const file = pickFile(formData)

    const fields: Record<string, unknown> = {
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      highlight: data.highlight ?? null,
      days: data.days,
      time: data.time ?? null,
      note: data.note ?? null,
      theme: data.theme,
    }
    // No new file chosen — keep the existing image_url untouched.
    if (file) fields.image_url = await uploadSpecialImage(supabase, file)

    const { error } = await supabase.from('specials').update(fields).eq('id', id)
    if (error) throw error
    invalidate()
    return { error: '' }
  } catch (e) {
    return { error: toMessage(e) }
  }
}

export async function deleteSpecial(id: string) {
  const { supabase } = await requireUser()
  const { error } = await supabase.from('specials').update({ is_active: false }).eq('id', id)
  if (error) { console.error('deleteSpecial failed:', error); return }
  invalidate()
}

export async function restoreSpecial(id: string) {
  const { supabase } = await requireUser()
  const { error } = await supabase.from('specials').update({ is_active: true }).eq('id', id)
  if (error) { console.error('restoreSpecial failed:', error); return }
  invalidate()
}
```

- [ ] **Step 4: Verify the build**

Run: `npm run build`
Expected: PASS. (No UI consumes these yet — this task ships the data layer only.)

- [ ] **Step 5: Commit**

```bash
git add lib/db/queries/admin.ts lib/storage/specials.ts app/admin/actions/specials.ts
git commit -m "feat(admin): add specials reads, image upload helper and server actions"
```

---

### Task 6: Admin specials panel

**Files:**
- Create: `app/admin/(protected)/specials/page.tsx`
- Create: `app/admin/(protected)/specials/_components/SpecialList.tsx`
- Create: `app/admin/(protected)/specials/_components/SpecialForm.tsx`
- Modify: `app/admin/_components/AdminNav.tsx:6,8-11`

**Interfaces:**
- Consumes: `getAdminSpecials()`, `AdminSpecial` (Task 5); `createSpecial`, `updateSpecial`, `deleteSpecial`, `restoreSpecial` (Task 5).
- Produces: the `/admin/specials` route.

- [ ] **Step 1: Write the form**

Create `app/admin/(protected)/specials/_components/SpecialForm.tsx`. Modelled on `ItemForm.tsx` — same `useFormState` pattern (React 18: **not** `useActionState`), same classes. `encType="multipart/form-data"` is required for the file input.

```tsx
'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { useEffect, useRef } from 'react'
import { createSpecial, updateSpecial } from '@/app/admin/actions/specials'
import type { AdminSpecial } from '@/lib/db/queries/admin'

const THEMES = [
  { value: 'green', label: 'Green' },
  { value: 'terracotta', label: 'Terracotta' },
  { value: 'charcoal', label: 'Charcoal' },
] as const

const inputClass =
  'w-full border border-gold/30 px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-terracotta bg-cream/40'
const labelClass = 'block text-xs font-inter text-charcoal/60 mb-1 uppercase tracking-wider'

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex-1 bg-terracotta text-cream font-bebas tracking-[0.15em] py-2.5 hover:bg-terracotta/90 transition-colors disabled:opacity-50 text-sm"
    >
      {pending ? 'Saving...' : label}
    </button>
  )
}

type Props = {
  editSpecial: AdminSpecial | null
  onCancelEdit: () => void
}

export default function SpecialForm({ editSpecial, onCancelEdit }: Props) {
  const isEditing = editSpecial !== null
  const formRef = useRef<HTMLFormElement>(null)

  const boundUpdate = isEditing ? updateSpecial.bind(null, editSpecial.id) : createSpecial

  const [stateCreate, actionCreate] = useFormState(createSpecial, { error: '' })
  const [stateUpdate, actionUpdate] = useFormState(boundUpdate, { error: '' })

  const state = isEditing ? stateUpdate : stateCreate
  const action = isEditing ? actionUpdate : actionCreate

  useEffect(() => {
    if (!isEditing && stateCreate.error === '') {
      formRef.current?.reset()
    }
  }, [stateCreate, isEditing])

  return (
    <div className="bg-white border border-gold/20 p-6">
      <h2 className="font-playfair text-lg text-charcoal mb-5">
        {isEditing ? `Edit: ${editSpecial.title}` : 'Add special'}
      </h2>

      <form ref={formRef} action={action} encType="multipart/form-data" className="space-y-4">
        <div>
          <label className={labelClass}>Title *</label>
          <input name="title" defaultValue={editSpecial?.title ?? ''} required className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Subtitle</label>
          <input name="subtitle" defaultValue={editSpecial?.subtitle ?? ''} placeholder="e.g. All You Can Eat" className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea name="description" defaultValue={editSpecial?.description ?? ''} rows={4}
            className={`${inputClass} resize-none`} />
        </div>

        <div>
          <label className={labelClass}>Highlight</label>
          <input name="highlight" defaultValue={editSpecial?.highlight ?? ''} placeholder="e.g. $39 per person" className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Days</label>
          <input name="days" defaultValue={editSpecial?.days ?? ''} placeholder="e.g. Tuesday · Wednesday · Thursday" className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Time</label>
          <input name="time" defaultValue={editSpecial?.time ?? ''} placeholder="e.g. From 5:00pm" className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Note</label>
          <textarea name="note" defaultValue={editSpecial?.note ?? ''} rows={2}
            placeholder="Small print shown under the card" className={`${inputClass} resize-none`} />
        </div>

        <div>
          <label className={labelClass}>Theme</label>
          <select name="theme" defaultValue={editSpecial?.theme ?? 'charcoal'} className={inputClass}>
            {THEMES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Image {isEditing ? '(leave empty to keep current)' : '*'}</label>
          <input
            type="file"
            name="image"
            accept="image/jpeg,image/png,image/webp"
            className="w-full text-xs font-inter text-charcoal/60 file:mr-3 file:border-0 file:bg-charcoal file:text-cream file:px-3 file:py-1.5 file:text-xs file:font-bebas file:tracking-wider"
          />
          <p className="text-[10px] font-inter text-charcoal/40 mt-1">JPEG, PNG or WebP · max 5 MB</p>
        </div>

        {state.error && (
          <p className="text-xs text-terracotta bg-terracotta/5 border border-terracotta/20 px-3 py-2">{state.error}</p>
        )}

        <div className="flex gap-2 pt-1">
          <SubmitButton label={isEditing ? 'Save changes' : 'Add special'} />
          {isEditing && (
            <button type="button" onClick={onCancelEdit}
              className="px-4 border border-gold/30 text-charcoal/60 font-inter text-sm hover:bg-cream/50 transition-colors">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
```

- [ ] **Step 2: Write the list**

Create `app/admin/(protected)/specials/_components/SpecialList.tsx`, modelled on `ItemList.tsx` (same soft-delete confirm flow, same restore affordance):

```tsx
'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { deleteSpecial, restoreSpecial } from '@/app/admin/actions/specials'
import type { AdminSpecial } from '@/lib/db/queries/admin'
import { Pencil, Trash2, RotateCcw } from 'lucide-react'
import SpecialForm from './SpecialForm'

export default function SpecialList({ specials }: { specials: AdminSpecial[] }) {
  const [editSpecial, setEditSpecial] = useState<AdminSpecial | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleDelete = (id: string) => {
    startTransition(() => {
      deleteSpecial(id)
      setConfirmDelete(null)
    })
  }

  const handleRestore = (id: string) => {
    startTransition(() => restoreSpecial(id))
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 min-w-0">
        <div className="bg-white border border-gold/20">
          {specials.length === 0 && (
            <div className="px-6 py-12 text-center font-inter text-sm text-charcoal/40">
              No specials yet.
            </div>
          )}
          {specials.map((special) => (
            <div
              key={special.id}
              className={`flex items-start gap-3 px-4 py-4 border-b border-gold/10 last:border-0 ${
                !special.isActive ? 'opacity-40 bg-cream/30' : ''
              }`}
            >
              <div className="relative w-16 h-12 shrink-0 bg-cream/50">
                <Image src={special.imageUrl} alt="" fill quality={40} sizes="64px" className="object-cover" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-inter text-sm font-medium text-charcoal">{special.title}</span>
                  <span className="text-[10px] bg-gold/10 text-charcoal/60 px-1.5 py-0.5 font-bebas tracking-wide uppercase">
                    {special.theme}
                  </span>
                  {special.highlight && (
                    <span className="text-[10px] bg-terracotta/10 text-terracotta px-1.5 py-0.5 font-bebas tracking-wide">
                      {special.highlight}
                    </span>
                  )}
                </div>
                {special.subtitle && (
                  <p className="font-inter text-xs text-charcoal/40 mt-0.5 line-clamp-1">{special.subtitle}</p>
                )}
                <div className="flex gap-3 mt-1">
                  {special.days && <span className="font-inter text-xs text-charcoal/60">{special.days}</span>}
                  {special.time && <span className="font-inter text-xs text-charcoal/40">{special.time}</span>}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {!special.isActive ? (
                  <button onClick={() => handleRestore(special.id)} disabled={isPending}
                    className="p-2 text-charcoal/30 hover:text-deep-green transition-colors" title="Restore">
                    <RotateCcw size={14} />
                  </button>
                ) : (
                  <>
                    <button onClick={() => { setEditSpecial(special); setConfirmDelete(null) }}
                      className="p-2 text-charcoal/30 hover:text-terracotta transition-colors" title="Edit">
                      <Pencil size={14} />
                    </button>
                    {confirmDelete === special.id ? (
                      <span className="flex items-center gap-1 text-xs font-inter">
                        <button onClick={() => handleDelete(special.id)} disabled={isPending}
                          className="text-terracotta hover:underline">Yes</button>
                        <span className="text-charcoal/30">/</span>
                        <button onClick={() => setConfirmDelete(null)}
                          className="text-charcoal/40 hover:underline">No</button>
                      </span>
                    ) : (
                      <button onClick={() => setConfirmDelete(special.id)}
                        className="p-2 text-charcoal/30 hover:text-terracotta transition-colors" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:w-80 shrink-0">
        <SpecialForm editSpecial={editSpecial} onCancelEdit={() => setEditSpecial(null)} />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Write the page**

Create `app/admin/(protected)/specials/page.tsx`:

```tsx
import { getAdminSpecials } from '@/lib/db/queries/admin'
import SpecialList from './_components/SpecialList'

export default async function SpecialsAdminPage() {
  const specials = await getAdminSpecials()

  return (
    <div>
      <h1 className="font-playfair text-2xl text-charcoal mb-1">Specials</h1>
      <p className="font-inter text-sm text-charcoal/50 mb-6">
        The cards shown in the &ldquo;What&rsquo;s On&rdquo; section of the site.
      </p>
      <SpecialList specials={specials} />
    </div>
  )
}
```

- [ ] **Step 4: Add the nav link**

In `app/admin/_components/AdminNav.tsx`, change the icon import on line 6 and the `links` array on lines 8-11:

```tsx
import { LayoutGrid, Tag, Sparkles, Megaphone, LogOut } from 'lucide-react'

const links = [
  { href: '/admin/menu', label: 'Menu', icon: LayoutGrid },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/specials', label: 'Specials', icon: Sparkles },
  { href: '/admin/banner', label: 'Banner', icon: Megaphone },
]
```

The `/admin/banner` route arrives in Task 7 — the link 404s until then. Both links are added here because the mobile bottom bar divides space evenly across `links`, so adding them one at a time would mean re-checking the mobile layout twice.

- [ ] **Step 5: Verify the build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 6: Verify the panel end-to-end**

Run `npm run dev`, log in at `http://localhost:3000/admin/login`, open `/admin/specials`. Walk the real flows:

1. The three seeded specials are listed with photo thumbnails, theme badges and highlights.
2. **Create** — fill the form, pick a photo, choose Terracotta, Add special. Expected: the card appears in the list with the new photo. Confirm the file landed: Supabase Dashboard → Storage → `specials` shows a UUID-named object.
3. **Create without an image** — leave the file input empty and submit. Expected: the form shows "An image is required." and nothing is saved.
4. **Oversized image** — try a file over 5 MB. Expected: "Image must be smaller than 5 MB."
5. **Edit without re-uploading** — edit the new special, change only the title, save. Expected: the title changes and **the photo is unchanged** (this is the `file.size > 0` path).
6. **Public site** — open `/#specials` in a new tab. Expected: the new card is there (the action revalidated the `specials` tag; no dev-server restart needed).
7. **Delete** — delete the test special. Expected: it greys out in the admin list and disappears from `/#specials`. Restore brings it back.

Finally delete the test special for good and remove its object from the Storage bucket by hand.

- [ ] **Step 7: Commit**

```bash
git add "app/admin/(protected)/specials" app/admin/_components/AdminNav.tsx
git commit -m "feat(admin): add specials panel with image upload"
```

---

### Task 7: Admin banner panel

**Files:**
- Create: `app/admin/actions/banner.ts`
- Create: `app/admin/(protected)/banner/page.tsx`
- Create: `app/admin/(protected)/banner/_components/BannerForm.tsx`

**Interfaces:**
- Consumes: `getAdminBanner()`, `AdminBanner` (Task 5).
- Produces: `updateBanner(id, prevState, formData): Promise<{ error: string }>`; the `/admin/banner` route.

- [ ] **Step 1: Write the action**

Create `app/admin/actions/banner.ts`. Update only — the single row is created by the seed, and the DB constraint forbids a second one.

```ts
'use server'

import { revalidateTag, revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireUser } from '@/lib/supabase/server'

const BannerSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  href: z.string().min(1, 'Link is required'),
  isActive: z.boolean(),
})

export async function updateBanner(id: string, prevState: { error: string }, formData: FormData) {
  const { supabase } = await requireUser()
  try {
    const data = BannerSchema.parse({
      message: formData.get('message'),
      href: formData.get('href'),
      isActive: formData.get('isActive') === 'on',
    })

    const { error } = await supabase
      .from('site_banner')
      .update({ message: data.message, href: data.href, is_active: data.isActive })
      .eq('id', id)
    if (error) throw error

    revalidateTag('banner')
    revalidatePath('/admin/banner', 'page')
    return { error: '' }
  } catch (e) {
    return { error: e instanceof z.ZodError ? e.issues[0]?.message ?? 'Invalid data.' : 'Error saving.' }
  }
}
```

- [ ] **Step 2: Write the form**

Create `app/admin/(protected)/banner/_components/BannerForm.tsx`:

```tsx
'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { updateBanner } from '@/app/admin/actions/banner'
import type { AdminBanner } from '@/lib/db/queries/admin'

const inputClass =
  'w-full border border-gold/30 px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-terracotta bg-cream/40'
const labelClass = 'block text-xs font-inter text-charcoal/60 mb-1 uppercase tracking-wider'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-terracotta text-cream font-bebas tracking-[0.15em] py-2.5 px-8 hover:bg-terracotta/90 transition-colors disabled:opacity-50 text-sm"
    >
      {pending ? 'Saving...' : 'Save changes'}
    </button>
  )
}

export default function BannerForm({ banner }: { banner: AdminBanner }) {
  const boundUpdate = updateBanner.bind(null, banner.id)
  const [state, action] = useFormState(boundUpdate, { error: '' })

  return (
    <div className="bg-white border border-gold/20 p-6 max-w-xl">
      <form action={action} className="space-y-4">
        <div>
          <label className={labelClass}>Message *</label>
          <textarea name="message" defaultValue={banner.message} rows={2} required className={`${inputClass} resize-none`} />
        </div>

        <div>
          <label className={labelClass}>Link *</label>
          <input name="href" defaultValue={banner.href} required className={inputClass} />
          <p className="text-[10px] font-inter text-charcoal/40 mt-1">
            Where the bar links to — e.g. <code>#bookings</code>
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm font-inter text-charcoal/70 cursor-pointer pt-1">
          <input type="checkbox" name="isActive" defaultChecked={banner.isActive} className="accent-terracotta w-4 h-4" />
          Show the bar on the site
        </label>

        {state.error && (
          <p className="text-xs text-terracotta bg-terracotta/5 border border-terracotta/20 px-3 py-2">{state.error}</p>
        )}

        <div className="pt-1">
          <SubmitButton />
        </div>
      </form>
    </div>
  )
}
```

- [ ] **Step 3: Write the page**

Create `app/admin/(protected)/banner/page.tsx`. The empty state matters: the row comes from the seed, so its absence means the seed never ran.

```tsx
import { getAdminBanner } from '@/lib/db/queries/admin'
import BannerForm from './_components/BannerForm'

export default async function BannerAdminPage() {
  const banner = await getAdminBanner()

  return (
    <div>
      <h1 className="font-playfair text-2xl text-charcoal mb-1">Banner</h1>
      <p className="font-inter text-sm text-charcoal/50 mb-6">
        The scrolling promo bar at the very top of the site.
      </p>
      {banner ? (
        <BannerForm banner={banner} />
      ) : (
        <p className="font-inter text-sm text-charcoal/40">
          No banner row found — run the seed migration.
        </p>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Verify the build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 5: Verify the banner panel end-to-end**

Run `npm run dev`, open `/admin/banner` logged in.

1. Expected: the form is populated with the calzone text and the checkbox **unticked**.
2. Tick "Show the bar on the site", save, open `/` in a new tab. Expected: the terracotta marquee is back with that text.
3. Change the message to something else, save, reload `/`. Expected: the new text scrolls — no dev-server restart needed (the action revalidated the `banner` tag).
4. Clear the message and save. Expected: "Message is required" and nothing saves.
5. Untick and save. Expected: the bar is gone from `/`.

Leave it **unticked** — that is the intended shipping state.

- [ ] **Step 6: Commit**

```bash
git add app/admin/actions/banner.ts "app/admin/(protected)/banner"
git commit -m "feat(admin): add banner panel"
```

---

### Task 8: Final verification and deploy

**Files:** none — verification only.

- [ ] **Step 1: Confirm nothing references the old shape**

Run: `grep -rn "accentColor\|specialImages\|from '@/lib/data/specials'" --include=*.tsx --include=*.ts app components lib`
Expected: the only hits are `SpecialsServer.tsx` (imports the fallback) and `Specials.tsx` / `specials.ts` query (type-only imports). No `accentColor`, no `specialImages`.

- [ ] **Step 2: Full build and lint**

Run: `npm run build && npm run lint`
Expected: both PASS.

- [ ] **Step 3: Walk the spec's verification list once, end to end**

Against `npm run dev`, confirm each item from the spec:

1. Create a special with a new photo → card appears on the site.
2. Edit it without re-uploading → image preserved.
3. Delete it → card disappears from the public section.
4. Banner off → bar gone; banner on → text and link correct.
5. A fourth special → grid wraps, no `undefined` gradient or image.

Clean up any test rows and test Storage objects afterwards.

- [ ] **Step 4: Confirm the shipping state**

In the SQL editor:

```sql
select title, theme, is_active from public.specials order by sort_order;
select message, is_active from public.site_banner;
```

Expected: exactly the three original specials, all active; the banner row `is_active = false`. No test rows survive.

- [ ] **Step 5: Push**

Per the user's stated workflow, commit and push straight to `main`, then verify on production that the specials section renders and the promo bar is gone.

```bash
git push origin main
```

---

## Notes for the implementer

- **The user's immediate goal** is that the "Free Nutella Calzone" bar disappears and the specials become editable without a deploy. The seed keeps all three specials, calzone included — the owner rewrites them from the dashboard afterwards. The bar goes away because the seeded row is inactive, not because the code was deleted.
- **The bug this closes:** `Specials.tsx` indexed `specialImages[i]` and `gradients[index]` into 3-element arrays, so a fourth card would render `undefined` for both. Task 3 removes that coupling — do not reintroduce any index-keyed content lookup.
- **Replaced photos are deliberately left in the bucket.** Do not add cleanup — the spec rules it out (risk of deleting a still-referenced file; orphans are harmless).
- **Out of scope, do not add:** manual card reordering, automatic photo cleanup, edit history, live preview in the form.
