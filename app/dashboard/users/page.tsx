import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getCurrentUser, getAllUsers } from '@/lib/database'
import UsersPageClient from './UsersPageClient'

export default async function UsersPage() {
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    redirect('/login')
  }

  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect('/login')
  }

  // Check if user is admin
  if (currentUser.role !== 'admin') {
    redirect('/dashboard')
  }

  // Get all users
  const users = await getAllUsers()

  return <UsersPageClient users={users} />
}
