import { getSpecials } from '@/lib/db/queries/specials'
import Specials from './Specials'

export default async function SpecialsServer() {
  const specials = await getSpecials().catch((error) => {
    console.error('getSpecials failed:', error)
    return []
  })
  return <Specials specials={specials} />
}
