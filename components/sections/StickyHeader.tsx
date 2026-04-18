'use client'

import { useState } from 'react'
import TopBar from './TopBar'
import Navbar from './Navbar'

export default function StickyHeader() {
  const [topBarVisible, setTopBarVisible] = useState(true)

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {topBarVisible && <TopBar onDismiss={() => setTopBarVisible(false)} />}
      <Navbar />
    </div>
  )
}
