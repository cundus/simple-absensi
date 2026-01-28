import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getCurrentUser, getAllAttendances } from '@/lib/database'
import AdminAttendanceTable from '@/components/AdminAttendanceTable'

export default async function AdminAttendancePage() {
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

  // Get all attendances (last 100)
  const attendances = await getAllAttendances(100)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Kelola Absensi</h1>
        <p className="text-gray-600 mt-2">
          Lihat dan kelola absensi semua karyawan
        </p>
      </div>

      <AdminAttendanceTable attendances={attendances} />
    </div>
  )
}
