import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AttendanceCard from '@/components/AttendanceCard'
import AttendanceHistory from '@/components/AttendanceHistory'
import { getTodayAttendance, getUserAttendances } from '@/lib/database'

export default async function AttendancePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get today's attendance
  const todayAttendance = await getTodayAttendance(user.id)

  // Get recent attendance history (last 30 days)
  const attendances = await getUserAttendances(user.id, 30)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Absensi</h1>
        <p className="text-gray-600 mt-2">
          Kelola absensi masuk dan keluar Anda
        </p>
      </div>

      {/* Attendance Card */}
      <AttendanceCard attendance={todayAttendance} />

      {/* Attendance History */}
      <AttendanceHistory attendances={attendances} />
    </div>
  )
}
