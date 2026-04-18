/**
 * One-shot migration: seeds Turso from the static menu.ts data.
 * Run with: npx tsx lib/data/menu-seed.ts
 * Safe to re-run — uses INSERT OR IGNORE.
 */
import { createClient } from '@libsql/client'
import { menuCategories } from './menu'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

async function seed() {
  const statements: { sql: string; args: (string | number | null)[] }[] = []

  for (let ci = 0; ci < menuCategories.length; ci++) {
    const cat = menuCategories[ci]
    statements.push({
      sql: `INSERT OR IGNORE INTO menu_categories (id, label, emoji, sort_order) VALUES (?, ?, ?, ?)`,
      args: [cat.id, cat.label, cat.emoji, ci],
    })
    for (let ii = 0; ii < cat.items.length; ii++) {
      const item = cat.items[ii]
      statements.push({
        sql: `INSERT OR IGNORE INTO menu_items
          (category_id, name, description, price, price_gf, is_vegetarian, is_gluten_free, is_seafood, badge, sort_order)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          cat.id,
          item.name,
          item.description ?? '',
          item.price ?? null,
          item.priceGF ?? null,
          item.isVegetarian ? 1 : 0,
          item.isGlutenFree ? 1 : 0,
          item.isSeafood ? 1 : 0,
          item.badge ?? null,
          ii,
        ],
      })
    }
  }

  await db.batch(statements, 'write')
  console.log(`✓ Seeded ${menuCategories.length} categories and ${statements.length - menuCategories.length} items`)
}

seed().catch((e) => { console.error(e); process.exit(1) })
