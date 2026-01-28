import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardNav from '@/components/DashboardNav'
import { getCurrentUser } from '@/lib/database'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const currentUser = await getCurrentUser()

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav user={user} userRole={currentUser?.role} />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
