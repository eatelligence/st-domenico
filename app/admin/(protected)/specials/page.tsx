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
