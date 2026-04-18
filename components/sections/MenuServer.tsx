import { getMenuCategories } from '@/lib/db/queries/menu'
import { menuCategories as staticCategories } from '@/lib/data/menu'
import Menu from './Menu'

export default async function MenuServer() {
  let categories = await getMenuCategories().catch(() => [])
  // Fall back to static data if DB returns empty (e.g. during first deploy)
  if (categories.length === 0) categories = staticCategories
  return <Menu initialCategories={categories} />
}
