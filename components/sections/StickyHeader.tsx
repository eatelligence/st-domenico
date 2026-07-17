import { getBanner } from '@/lib/db/queries/specials'
import StickyHeaderClient from './StickyHeaderClient'

export default async function StickyHeader() {
  const banner = await getBanner().catch(() => null)
  return <StickyHeaderClient banner={banner} />
}
