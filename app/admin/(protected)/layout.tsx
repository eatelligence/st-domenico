import { getAdminSession } from '@/lib/auth/session'
import AdminNav from '../_components/AdminNav'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  await getAdminSession()

  return (
    <div className="flex min-h-screen bg-[#F0EBE0]">
      <AdminNav />
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
    </div>
  )
}
