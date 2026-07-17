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
