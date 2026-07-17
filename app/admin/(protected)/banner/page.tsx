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
