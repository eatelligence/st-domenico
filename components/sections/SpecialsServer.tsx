import { getSpecials } from '@/lib/db/queries/specials'
import { specials as staticSpecials } from '@/lib/data/specials'
import Specials from './Specials'

export default async function SpecialsServer() {
  let specials = await getSpecials().catch(() => [])
  // Fall back to static data if DB returns empty (e.g. during first deploy)
  if (specials.length === 0) specials = staticSpecials
  return <Specials specials={specials} />
}
