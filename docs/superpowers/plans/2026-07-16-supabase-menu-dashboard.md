# Supabase Menu Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate St Domenico's existing Next.js menu-management admin from Turso/libsql + iron-session to Supabase Postgres + Supabase Auth, with RLS, keeping the responsive UI and the public menu's static fallback.

**Architecture:** Reuse the existing `app/admin/(protected)` UI and server-action structure. Swap the data layer to Supabase via `@supabase/ssr`: a cookie-bound server client for admin reads/writes (RLS `authenticated`), a keyless anon client for the cached public read (RLS `anon`, active rows only), and a browser client for the login form. Supabase Auth replaces the bcrypt password; a root middleware guards `/admin`.

**Tech Stack:** Next.js App Router, TypeScript, `@supabase/supabase-js`, `@supabase/ssr`, zod, Tailwind. Supabase project "Stdomanico" (`ref maqflisummdlfwtxioio`, `https://maqflisummdlfwtxioio.supabase.co`).

## Global Constraints

- Data model stays **normalized**: `menu_categories` + `menu_items` (FK, `ON DELETE CASCADE`). Do not denormalize.
- **No service-role key in the app runtime.** App reads/writes use the anon key under RLS. The service-role key is used ONLY by the local one-off seed script (Task 3) via `.env.local`, never committed, never set on Vercel.
- **RLS everywhere:** `anon` → `SELECT` where `is_active = true`; `authenticated` → `ALL`.
- **Preserve the public menu static fallback** in `components/sections/MenuServer.tsx` (falls back to `lib/data/menu.ts` when the query is empty).
- Public read keeps `unstable_cache` (tag `menu`, `revalidate: 3600`). It MUST use the keyless anon client (no `cookies()`), because `cookies()` cannot be called inside `unstable_cache`.
- Scope is **menu only** (categories + items). No events/hours/specials/packages.
- Env var names: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Seed-only: `SUPABASE_SERVICE_ROLE_KEY`.
- After migration, remove `@libsql/client`, `bcryptjs`, `@types/bcryptjs`, `iron-session` and their code.
- No automated test runner exists in this repo; tasks are verification-driven (build, typecheck, SQL queries via the Supabase MCP, and driving the admin UI). Do not add a test framework (YAGNI).

---

### Task 1: Dependencies, env, and Supabase client helpers

**Files:**
- Modify: `package.json` (add deps)
- Create: `.env.local` (local env; gitignored)
- Create: `lib/supabase/server.ts`
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/anon.ts`
- Create: `lib/supabase/middleware.ts`
- Create: `middleware.ts` (repo root)

**Interfaces:**
- Produces:
  - `createClient(): Promise<SupabaseClient>` from `lib/supabase/server.ts` — cookie-bound server client (auth context).
  - `requireUser(): Promise<{ supabase: SupabaseClient, user: User }>` from `lib/supabase/server.ts` — redirects to `/admin/login` if no session.
  - `createClient(): SupabaseClient` from `lib/supabase/client.ts` — browser client.
  - `createAnonClient(): SupabaseClient` from `lib/supabase/anon.ts` — keyless (no cookies) anon client for cached public reads.
  - `updateSession(request): Promise<NextResponse>` from `lib/supabase/middleware.ts`.

- [ ] **Step 1: Install new dependencies (do NOT remove the old ones yet)**

Run:
```bash
npm install @supabase/supabase-js @supabase/ssr
```
Expected: install succeeds. **Do NOT uninstall `@libsql/client`, `bcryptjs`, `@types/bcryptjs`, `iron-session` here** — existing files still import them until Tasks 4–7, and removing them now breaks `npm run build`. They are uninstalled in Task 8 after all their code is gone.

- [ ] **Step 2: Fetch the anon key and write `.env.local`**

Get the project URL and publishable/anon key from the Supabase MCP (`get_project_url`, `get_publishable_keys` for project `maqflisummdlfwtxioio`) or the Supabase dashboard → Settings → API. Write `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://maqflisummdlfwtxioio.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon or sb_publishable_ key>
```
Confirm `.env.local` is gitignored (it is — `.gitignore` lists `.env.local`).

- [ ] **Step 3: Create the cookie-bound server client + `requireUser`**

`lib/supabase/server.ts`:
```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // called from a Server Component — safe to ignore; middleware refreshes the session
          }
        },
      },
    }
  )
}

export async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')
  return { supabase, user }
}
```

- [ ] **Step 4: Create the browser client**

`lib/supabase/client.ts`:
```ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 5: Create the keyless anon client (for cached public reads)**

`lib/supabase/anon.ts`:
```ts
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// No cookies — safe to call inside unstable_cache. RLS anon policy applies (active rows only).
export function createAnonClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  )
}
```

- [ ] **Step 6: Create the middleware session refresher + guard**

`lib/supabase/middleware.ts`:
```ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login') && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
```

`middleware.ts` (repo root):
```ts
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

- [ ] **Step 7: Verify it builds/typechecks**

Run: `npx tsc --noEmit`
Expected: no type errors from the new files. (Existing files still import the old `db` — they are rewritten in later tasks; if `tsc` flags only those, that's expected. To isolate, this step passes if there are no errors originating in `lib/supabase/*` or `middleware.ts`.)

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json lib/supabase middleware.ts
git commit -m "feat(admin): add Supabase client helpers, middleware, deps"
```

---

### Task 2: Database schema + RLS

**Files:**
- Create: `supabase/migrations/0001_menu_schema.sql`

**Interfaces:**
- Produces: Supabase tables `public.menu_categories`, `public.menu_items` with RLS policies. Column names consumed by all later tasks: categories(`id`,`label`,`emoji`,`sort_order`,`is_active`,`created_at`,`updated_at`); items(`id`,`category_id`,`name`,`description`,`price`,`price_gf`,`is_vegetarian`,`is_gluten_free`,`is_seafood`,`badge`,`allergens`,`sort_order`,`is_active`,`created_at`,`updated_at`).

- [ ] **Step 1: Write the migration SQL**

`supabase/migrations/0001_menu_schema.sql`:
```sql
-- updated_at auto-touch
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
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
```

- [ ] **Step 2: Apply the migration to Supabase**

Apply via the Supabase MCP `apply_migration` (project `maqflisummdlfwtxioio`, name `menu_schema`, the SQL above), or `supabase db push` if the CLI is configured.

- [ ] **Step 3: Verify tables + RLS exist**

Use the Supabase MCP `list_tables` (project `maqflisummdlfwtxioio`, schema `public`, verbose true).
Expected: `menu_categories` and `menu_items` present with the columns above, FK on `category_id`, and RLS enabled. Also run `get_advisors` (type `security`) and confirm no "RLS disabled" warnings on these tables.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/0001_menu_schema.sql
git commit -m "feat(db): Supabase menu schema + RLS"
```

---

### Task 3: Seed the real menu data

**Files:**
- Create: `lib/data/supabase-seed.ts`
- Delete: `lib/data/menu-seed.ts` (old Turso seed)

**Interfaces:**
- Consumes: `menuCategories` from `lib/data/menu.ts` (existing static data), and its `MenuItem`/`MenuCategory` shapes.

- [ ] **Step 1: Confirm the `MenuItem` field names**

Read `lib/data/menu.ts` and confirm item fields: `name`, `description?`, `price?`, `priceGF?`, `isVegetarian?`, `isGlutenFree?`, `isSeafood?`, `badge?`, and whether `allergens?` exists. The seed below reads `allergens` defensively.

- [ ] **Step 2: Add the seed-only service-role key to `.env.local`**

From the Supabase dashboard → Settings → API → `service_role` secret (or MCP), add to `.env.local` ONLY:
```
SUPABASE_SERVICE_ROLE_KEY=<service_role secret>
```
Do NOT commit it and do NOT add it to Vercel.

- [ ] **Step 3: Write the seed script**

`lib/data/supabase-seed.ts`:
```ts
/**
 * One-time seed: loads Supabase from the static menu.ts data.
 * Run with: npx tsx lib/data/supabase-seed.ts
 * Uses the service-role key (local .env.local only) to bypass RLS for seeding.
 */
import { createClient } from '@supabase/supabase-js'
import { menuCategories } from './menu'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

async function seed() {
  for (let ci = 0; ci < menuCategories.length; ci++) {
    const cat = menuCategories[ci]
    const { data: inserted, error } = await supabase
      .from('menu_categories')
      .insert({ label: cat.label, emoji: cat.emoji, sort_order: ci })
      .select('id')
      .single()
    if (error) throw error

    const rows = cat.items.map((item, ii) => ({
      category_id: inserted.id,
      name: item.name,
      description: item.description ?? '',
      price: item.price ?? null,
      price_gf: item.priceGF ?? null,
      is_vegetarian: !!item.isVegetarian,
      is_gluten_free: !!item.isGlutenFree,
      is_seafood: !!item.isSeafood,
      badge: item.badge ?? null,
      allergens: (item as { allergens?: string }).allergens ?? null,
      sort_order: ii,
    }))
    const { error: itemErr } = await supabase.from('menu_items').insert(rows)
    if (itemErr) throw itemErr
    console.log(`✓ ${cat.label}: ${rows.length} items`)
  }
  console.log('Seed complete.')
}

seed()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
```

- [ ] **Step 4: Run the seed**

Run: `npx tsx lib/data/supabase-seed.ts`
Expected: one `✓ <Category>: N items` line per category, then `Seed complete.`

- [ ] **Step 5: Verify row counts**

Via Supabase MCP `execute_sql` (project `maqflisummdlfwtxioio`):
```sql
select (select count(*) from menu_categories) as cats,
       (select count(*) from menu_items) as items;
```
Expected: `cats` equals the number of categories in `menu.ts` (6: Pizze, Stuzzichini, Pasta, Pasticceria, Sweet Pizze, Drinks) and `items` equals the total items in `menu.ts`.

- [ ] **Step 6: Delete old seed + commit**

```bash
git rm lib/data/menu-seed.ts
git add lib/data/supabase-seed.ts
git commit -m "feat(db): seed Supabase menu from static data"
```

---

### Task 4: Auth — login, logout, protected layout

**Files:**
- Modify: `app/admin/actions/auth.ts` (replace bcrypt/iron-session)
- Modify: `app/admin/login/_components/LoginForm.tsx` (email + password via Supabase Auth)
- Modify: `app/admin/login/page.tsx` (add email field context if needed — verify)
- Modify: `app/admin/(protected)/layout.tsx` (Supabase `getUser` guard)
- Note: `lib/auth/session.ts` is NOT deleted here — `categories.ts`/`menu.ts` still import it until Tasks 6–7. It is removed in Task 8.

**Interfaces:**
- Consumes: `createClient` (browser) from `lib/supabase/client.ts`; `createClient` (server) from `lib/supabase/server.ts`.
- Produces: `logout(): Promise<void>` server action from `app/admin/actions/auth.ts`.

- [ ] **Step 1: Rewrite the auth action (logout only; login moves client-side)**

`app/admin/actions/auth.ts`:
```ts
'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
```

- [ ] **Step 2: Rewrite the login form to use Supabase Auth**

`app/admin/login/_components/LoginForm.tsx`:
```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError('')
    const form = new FormData(e.currentTarget)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get('email') ?? ''),
      password: String(form.get('password') ?? ''),
    })
    if (error) {
      setError('Incorrect email or password.')
      setPending(false)
      return
    }
    router.replace('/admin/menu')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-charcoal/70 mb-1.5">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full border border-gold/30 bg-cream px-4 py-3 text-charcoal focus:outline-none focus:border-terracotta transition-colors"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-charcoal/70 mb-1.5">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full border border-gold/30 bg-cream px-4 py-3 text-charcoal focus:outline-none focus:border-terracotta transition-colors"
        />
      </div>

      {error && (
        <p className="text-sm text-terracotta bg-terracotta/5 border border-terracotta/20 px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-charcoal text-cream font-bebas tracking-[0.2em] py-3.5 hover:bg-terracotta transition-colors disabled:opacity-50"
      >
        {pending ? 'Signing in...' : 'Enter Kitchen'}
      </button>
    </form>
  )
}
```

- [ ] **Step 3: Rewrite the protected layout guard**

`app/admin/(protected)/layout.tsx`:
```tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminNav from '../_components/AdminNav'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  return (
    <div className="flex min-h-screen bg-[#F0EBE0]">
      <AdminNav />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
    </div>
  )
}
```

- [ ] **Step 4: Check `app/admin/login/page.tsx` and `AdminNav`**

Read `app/admin/login/page.tsx`; ensure it just renders `<LoginForm />` (no server-side session redirect referencing the old `getSession`). If it imports from `lib/auth/session`, remove that import and instead let middleware handle redirect-if-authenticated (optional). Read `app/admin/_components/AdminNav.tsx`; confirm its logout calls `logout` from `app/admin/actions/auth` (unchanged signature) — no edit needed if so.

- [ ] **Step 5: Leave `lib/auth/session.ts` in place (for now)**

Do NOT delete it yet. `app/admin/actions/categories.ts` and `app/admin/actions/menu.ts` still import `getAdminSession` from it and still use the old `db` client; they are rewritten in Tasks 6–7. Deleting `session.ts` now would break their build. It is removed in Task 8 after those rewrites, once the Task 8 grep confirms no references remain.

- [ ] **Step 6: Create a test admin user in Supabase**

In the Supabase dashboard → Authentication → Users → Add user, create an email+password user (e.g. the client's email). This is required to log in.

- [ ] **Step 7: Verify auth (redirect + login session)**

Run: `npm run build && npm run start` (ensure `.env.local` is loaded).
- Visit `http://localhost:3000/admin` → expect redirect to `/admin/login`.
- Log in with the test user → the guard passes and you are routed to `/admin/menu` without being bounced back to `/admin/login` (this confirms the Supabase session works).
- Note: the admin data pages (category list / items) still read from Turso until Tasks 6–7, so they may show a data/loading error at this point — that is expected and fixed in Tasks 6–7. This step only verifies the redirect + login/session behaviour and that the build compiles.
- Click logout → back to `/admin/login`; visiting `/admin` again redirects to login.

- [ ] **Step 8: Commit**

```bash
git add app/admin/actions/auth.ts app/admin/login app/admin/\(protected\)/layout.tsx
git commit -m "feat(admin): Supabase Auth login/logout + route guard"
```

---

### Task 5: Public menu read → Supabase

**Files:**
- Modify: `lib/db/queries/menu.ts` (rewrite to Supabase, keep path + export + cache)

**Interfaces:**
- Consumes: `createAnonClient` from `lib/supabase/anon.ts`; `MenuCategory`, `MenuItem` types from `lib/data/menu.ts`.
- Produces: `getMenuCategories(): Promise<MenuCategory[]>` (same signature `components/sections/MenuServer.tsx` already imports).

- [ ] **Step 1: Rewrite the public read**

`lib/db/queries/menu.ts`:
```ts
import { unstable_cache } from 'next/cache'
import { createAnonClient } from '@/lib/supabase/anon'
import type { MenuCategory, MenuItem } from '@/lib/data/menu'

async function fetchMenu(): Promise<MenuCategory[]> {
  const supabase = createAnonClient()

  const { data: cats } = await supabase
    .from('menu_categories')
    .select('id, label, emoji')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (!cats || cats.length === 0) return []

  const categories: MenuCategory[] = []
  for (const c of cats) {
    const { data: items } = await supabase
      .from('menu_items')
      .select(
        'name, description, price, price_gf, is_vegetarian, is_gluten_free, is_seafood, badge, allergens'
      )
      .eq('category_id', c.id)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    const mapped: MenuItem[] = (items ?? []).map((r) => ({
      name: r.name,
      description: r.description,
      price: r.price ?? undefined,
      priceGF: r.price_gf ?? undefined,
      isVegetarian: r.is_vegetarian,
      isGlutenFree: r.is_gluten_free,
      isSeafood: r.is_seafood,
      badge: r.badge ?? undefined,
      allergens: r.allergens ?? undefined,
    }))

    categories.push({ id: c.id, label: c.label, emoji: c.emoji, items: mapped })
  }

  return categories
}

export const getMenuCategories = unstable_cache(fetchMenu, ['menu-categories'], {
  tags: ['menu'],
  revalidate: 3600,
})
```

- [ ] **Step 2: Verify the public menu renders from Supabase**

Run: `npm run build && npm run start`. Visit `http://localhost:3000/` and scroll to the menu (`/#menu`).
Expected: the menu shows the seeded categories/items (same content as before, now from Supabase). Confirm no build/runtime errors referencing `lib/db/client`.

- [ ] **Step 3: Verify the static fallback still works**

Temporarily rename `.env.local`'s `NEXT_PUBLIC_SUPABASE_URL` to an invalid value (or point at an empty table) and reload — the menu should still render via `lib/data/menu.ts` (MenuServer fallback). Restore the env after.
Expected: menu still visible (static fallback), no crash.

- [ ] **Step 4: Commit**

```bash
git add lib/db/queries/menu.ts
git commit -m "feat(menu): read public menu from Supabase (cached, static fallback)"
```

---

### Task 6: Admin categories — queries + actions → Supabase

**Files:**
- Modify: `lib/db/queries/admin.ts` (rewrite category reads; keep item reads for Task 7)
- Modify: `app/admin/actions/categories.ts` (rewrite to Supabase)

**Interfaces:**
- Consumes: `createClient`/`requireUser` from `lib/supabase/server.ts`.
- Produces (unchanged names/types so UI keeps working):
  - `getAdminCategories(): Promise<AdminCategory[]>`, `AdminCategory` = `{ id, label, emoji, sortOrder, isActive, itemCount }`.
  - `createCategory`, `updateCategory`, `deleteCategory`, `reorderCategories` server actions with existing signatures.

- [ ] **Step 1: Rewrite category reads in `lib/db/queries/admin.ts`**

Add `import { createClient } from '@/lib/supabase/server'` and rewrite `getAdminCategories` to the Supabase version below. **Keep** the existing `import { db } from '../client'` line and the item-read functions (`getAdminCategoryItems`, `getAdminItem`, `rowToItem`) unchanged for now — they still use `db` and are rewritten in Task 7. Keep the `AdminMenuItem`/`AdminCategory` types. New `getAdminCategories`:
```ts
import { createClient } from '@/lib/supabase/server'
// (keep the existing `import { db } from '../client'` — item reads still use it until Task 7)

// ...types AdminMenuItem, AdminCategory unchanged...

export async function getAdminCategories(): Promise<AdminCategory[]> {
  const supabase = await createClient()
  const { data: cats } = await supabase
    .from('menu_categories')
    .select('id, label, emoji, sort_order, is_active')
    .order('sort_order', { ascending: true })
  const { data: items } = await supabase
    .from('menu_items')
    .select('category_id')
    .eq('is_active', true)

  const counts = new Map<string, number>()
  for (const i of items ?? []) {
    counts.set(i.category_id, (counts.get(i.category_id) ?? 0) + 1)
  }

  return (cats ?? []).map((c) => ({
    id: c.id,
    label: c.label,
    emoji: c.emoji,
    sortOrder: c.sort_order,
    isActive: c.is_active,
    itemCount: counts.get(c.id) ?? 0,
  }))
}
```

- [ ] **Step 2: Rewrite `app/admin/actions/categories.ts`**

```ts
'use server'

import { revalidateTag, revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireUser } from '@/lib/supabase/server'

const CatSchema = z.object({
  label: z.string().min(1, 'Name is required'),
  emoji: z.string().default('🍽️'),
})

function invalidate() {
  revalidateTag('menu')
  revalidatePath('/admin/menu', 'page')
  revalidatePath('/admin/categories', 'page')
}

export async function createCategory(prevState: { error: string }, formData: FormData) {
  const { supabase } = await requireUser()
  try {
    const data = CatSchema.parse({
      label: formData.get('label'),
      emoji: formData.get('emoji') || '🍽️',
    })
    const { data: maxRow } = await supabase
      .from('menu_categories')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle()
    const sortOrder = (maxRow?.sort_order ?? -1) + 1
    const { error } = await supabase
      .from('menu_categories')
      .insert({ label: data.label, emoji: data.emoji, sort_order: sortOrder })
    if (error) throw error
    invalidate()
    return { error: '' }
  } catch (e) {
    return { error: e instanceof z.ZodError ? e.issues[0]?.message ?? 'Invalid data.' : 'Error saving.' }
  }
}

export async function updateCategory(id: string, prevState: { error: string }, formData: FormData) {
  const { supabase } = await requireUser()
  try {
    const data = CatSchema.parse({ label: formData.get('label'), emoji: formData.get('emoji') || '🍽️' })
    const { error } = await supabase
      .from('menu_categories')
      .update({ label: data.label, emoji: data.emoji })
      .eq('id', id)
    if (error) throw error
    invalidate()
    return { error: '' }
  } catch (e) {
    return { error: e instanceof z.ZodError ? e.issues[0]?.message ?? 'Invalid data.' : 'Error saving.' }
  }
}

export async function deleteCategory(id: string) {
  const { supabase } = await requireUser()
  const { count } = await supabase
    .from('menu_items')
    .select('id', { count: 'exact', head: true })
    .eq('category_id', id)
    .eq('is_active', true)
  if ((count ?? 0) > 0) {
    return { error: 'Remove all products from this category first.' }
  }
  const { error } = await supabase.from('menu_categories').update({ is_active: false }).eq('id', id)
  if (error) return { error: 'Error deleting.' }
  invalidate()
  return { error: '' }
}

export async function reorderCategories(orderedIds: string[]) {
  const { supabase } = await requireUser()
  await Promise.all(
    orderedIds.map((id, i) =>
      supabase.from('menu_categories').update({ sort_order: i }).eq('id', id)
    )
  )
  invalidate()
}
```

- [ ] **Step 3: Verify category management in the UI**

Run `npm run build && npm run start`, log in, go to `/admin/categories` (or wherever categories render). Verify:
- Existing seeded categories list with correct item counts.
- Create a new category → appears.
- Rename it → updates.
- Delete the empty new category → disappears; deleting a category with active items shows the "Remove all products first" error.

- [ ] **Step 4: Commit**

```bash
git add lib/db/queries/admin.ts app/admin/actions/categories.ts
git commit -m "feat(admin): category reads + actions on Supabase"
```

---

### Task 7: Admin items — queries + actions → Supabase

**Files:**
- Modify: `lib/db/queries/admin.ts` (rewrite item reads: `getAdminCategoryItems`, `getAdminItem`)
- Modify: `app/admin/actions/menu.ts` (rewrite item CRUD to Supabase)

**Interfaces:**
- Consumes: `createClient`/`requireUser` from `lib/supabase/server.ts`; `AdminMenuItem` type (unchanged).
- Produces (unchanged names/types): `getAdminCategoryItems(categoryId): Promise<AdminMenuItem[]>`, `getAdminItem(id): Promise<AdminMenuItem | null>`, and `createMenuItem`, `updateMenuItem`, `deleteMenuItem`, `restoreMenuItem` actions with existing signatures.

- [ ] **Step 1: Rewrite item reads in `lib/db/queries/admin.ts`**

Replace `getAdminCategoryItems`, `getAdminItem`, and the `rowToItem` helper with Supabase versions (the `db.execute` calls are removed; the file no longer imports the old client):
```ts
type ItemRow = {
  id: string
  category_id: string
  name: string
  description: string
  price: string | null
  price_gf: string | null
  is_vegetarian: boolean
  is_gluten_free: boolean
  is_seafood: boolean
  badge: string | null
  allergens: string | null
  sort_order: number
  is_active: boolean
}

const ITEM_COLS =
  'id, category_id, name, description, price, price_gf, is_vegetarian, is_gluten_free, is_seafood, badge, allergens, sort_order, is_active'

function rowToItem(r: ItemRow): AdminMenuItem {
  return {
    id: r.id,
    categoryId: r.category_id,
    name: r.name,
    description: r.description,
    price: r.price,
    priceGF: r.price_gf,
    isVegetarian: r.is_vegetarian,
    isGlutenFree: r.is_gluten_free,
    isSeafood: r.is_seafood,
    badge: r.badge,
    allergens: r.allergens,
    sortOrder: r.sort_order,
    isActive: r.is_active,
  }
}

export async function getAdminCategoryItems(categoryId: string): Promise<AdminMenuItem[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('menu_items')
    .select(ITEM_COLS)
    .eq('category_id', categoryId)
    .order('sort_order', { ascending: true })
  return (data ?? []).map((r) => rowToItem(r as ItemRow))
}

export async function getAdminItem(id: string): Promise<AdminMenuItem | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('menu_items').select(ITEM_COLS).eq('id', id).maybeSingle()
  return data ? rowToItem(data as ItemRow) : null
}
```

- [ ] **Step 2: Rewrite `app/admin/actions/menu.ts`**

```ts
'use server'

import { revalidateTag, revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireUser } from '@/lib/supabase/server'

const ItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().default(''),
  price: z.string().optional(),
  priceGF: z.string().optional(),
  allergens: z.string().optional(),
  badge: z.string().optional(),
  isVegetarian: z.boolean().default(false),
  isGlutenFree: z.boolean().default(false),
  isSeafood: z.boolean().default(false),
})

function parseForm(formData: FormData) {
  return ItemSchema.parse({
    name: formData.get('name'),
    description: formData.get('description') ?? '',
    price: formData.get('price') || undefined,
    priceGF: formData.get('priceGF') || undefined,
    allergens: formData.get('allergens') || undefined,
    badge: formData.get('badge') || undefined,
    isVegetarian: formData.get('isVegetarian') === 'on',
    isGlutenFree: formData.get('isGlutenFree') === 'on',
    isSeafood: formData.get('isSeafood') === 'on',
  })
}

function invalidate(categoryId: string) {
  revalidateTag('menu')
  revalidatePath(`/admin/menu/${categoryId}`, 'page')
}

export async function createMenuItem(categoryId: string, prevState: { error: string }, formData: FormData) {
  const { supabase } = await requireUser()
  try {
    const data = parseForm(formData)
    const { data: maxRow } = await supabase
      .from('menu_items')
      .select('sort_order')
      .eq('category_id', categoryId)
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle()
    const sortOrder = (maxRow?.sort_order ?? -1) + 1
    const { error } = await supabase.from('menu_items').insert({
      category_id: categoryId,
      name: data.name,
      description: data.description,
      price: data.price ?? null,
      price_gf: data.priceGF ?? null,
      is_vegetarian: data.isVegetarian,
      is_gluten_free: data.isGlutenFree,
      is_seafood: data.isSeafood,
      badge: data.badge ?? null,
      allergens: data.allergens ?? null,
      sort_order: sortOrder,
    })
    if (error) throw error
    invalidate(categoryId)
    return { error: '' }
  } catch (e) {
    return { error: e instanceof z.ZodError ? e.issues[0]?.message ?? 'Invalid data.' : 'Error saving.' }
  }
}

export async function updateMenuItem(id: string, categoryId: string, prevState: { error: string }, formData: FormData) {
  const { supabase } = await requireUser()
  try {
    const data = parseForm(formData)
    const { error } = await supabase
      .from('menu_items')
      .update({
        name: data.name,
        description: data.description,
        price: data.price ?? null,
        price_gf: data.priceGF ?? null,
        is_vegetarian: data.isVegetarian,
        is_gluten_free: data.isGlutenFree,
        is_seafood: data.isSeafood,
        badge: data.badge ?? null,
        allergens: data.allergens ?? null,
      })
      .eq('id', id)
    if (error) throw error
    invalidate(categoryId)
    return { error: '' }
  } catch (e) {
    return { error: e instanceof z.ZodError ? e.issues[0]?.message ?? 'Invalid data.' : 'Error saving.' }
  }
}

export async function deleteMenuItem(id: string, categoryId: string) {
  const { supabase } = await requireUser()
  await supabase.from('menu_items').update({ is_active: false }).eq('id', id)
  invalidate(categoryId)
}

export async function restoreMenuItem(id: string, categoryId: string) {
  const { supabase } = await requireUser()
  await supabase.from('menu_items').update({ is_active: true }).eq('id', id)
  invalidate(categoryId)
}
```

- [ ] **Step 3: Verify item management in the UI**

Run `npm run build && npm run start`, log in, open a category's items page (`/admin/menu/<categoryId>`). Verify:
- Items list with badges/prices/flags matching the seed.
- Add an item (fill name, price, toggle VEG/GF) → appears in the list and on the public `/#menu` after reload.
- Edit it → changes persist.
- Delete (soft) → row greys out; Restore → returns.

- [ ] **Step 4: Commit**

```bash
git add lib/db/queries/admin.ts app/admin/actions/menu.ts
git commit -m "feat(admin): item reads + CRUD on Supabase"
```

---

### Task 8: Cleanup, build, deploy, live verification

**Files:**
- Delete: `lib/db/client.ts`, `lib/db/schema.sql`, `lib/auth/session.ts`
- Modify: `lib/db/queries/admin.ts` (drop the now-unused `import { db } from '../client'` if still present after Task 7)
- Modify: any remaining imports of removed modules (grep first)

- [ ] **Step 1: Remove dead Turso/auth files and confirm no references remain**

Run:
```bash
grep -rn "libsql\|@/lib/db/client\|from '../client'\|iron-session\|bcrypt\|getAdminSession\|lib/auth/session\|ADMIN_PASSWORD_HASH\|TURSO_" app lib components middleware.ts
```
Expected: no matches. If `lib/db/queries/admin.ts` still shows an unused `import { db } from '../client'`, remove that line. Then:
```bash
git rm lib/db/client.ts lib/db/schema.sql lib/auth/session.ts
```
(If any other match remains, fix that file to use the Supabase equivalents before continuing.)

Then uninstall the now-unused old dependencies (deferred here from Task 1):
```bash
npm uninstall @libsql/client bcryptjs @types/bcryptjs iron-session
```

- [ ] **Step 2: Full build + typecheck**

Run: `npm run build`
Expected: `✓ Compiled successfully`, all routes build, no errors about missing `db`/`libsql`/`iron-session`.

- [ ] **Step 3: Set Vercel environment variables**

In Vercel → Project `st-domenico` → Settings → Environment Variables (Production + Preview), add:
- `NEXT_PUBLIC_SUPABASE_URL=https://maqflisummdlfwtxioio.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon/publishable key>`
Do NOT add `SUPABASE_SERVICE_ROLE_KEY`. Remove any old `TURSO_*` / `SESSION_SECRET` / `ADMIN_PASSWORD_HASH` vars.

- [ ] **Step 4: Merge/deploy to production**

Follow the user's deploy preference (commit to `main` → Vercel auto-deploys). If the work was on a branch, merge to `main`.

- [ ] **Step 5: Live verification**

- `https://stdomenicopizzabar.com/#menu` → renders the menu from Supabase.
- `https://stdomenicopizzabar.com/admin` → redirects to `/admin/login`.
- Log in with the client's Supabase user → dashboard; add/edit an item → after ~revalidation the public menu reflects it.
- Confirm anon cannot write: `curl` an insert against the REST endpoint with the anon key returns an RLS error (401/403).

- [ ] **Step 6: Commit any final cleanup**

```bash
git add -A
git commit -m "chore(admin): remove Turso/iron-session remnants"
```

---

## Notes for the implementer

- Category ids are now uuids; the admin route `/admin/menu/[categoryId]` carries uuids — opaque, no change needed.
- The public read uses the keyless anon client specifically so it can live inside `unstable_cache`; do not switch it to the cookie-bound server client.
- All admin writes go through `requireUser()`, which both authorizes (redirect if no session) and returns the RLS-bound client — keep that pattern for any new action.
- If `npm run start` doesn't load `.env.local`, use `npm run dev` for local verification, or export the vars inline.
