import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import {
  getCurrentUser,
  getTodayAttendance,
  getUserAttendanceStats,
  getActiveUsersCount,
  getTodayAttendanceCount,
} from '@/lib/database'
import { getCurrentMonth, formatTime, formatHours } from '@/lib/utils'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    redirect('/login')
  }

  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  const isAdmin = user.role === 'admin'

  // Get data based on role
  let todayAttendance = null
  let monthStats = null
  let totalUsers = 0
  let todayAttendanceCount = 0

  if (isAdmin) {
    // Admin stats
    totalUsers = await getActiveUsersCount()
    todayAttendanceCount = await getTodayAttendanceCount()
  } else {
    // Employee stats
    todayAttendance = await getTodayAttendance(authUser.id)
    const currentMonth = getCurrentMonth()
    monthStats = await getUserAttendanceStats(authUser.id, currentMonth)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Selamat datang, {user.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isAdmin ? (
          <>
            <DashboardCard
              title="Total Karyawan"
              value={totalUsers.toString()}
              icon="👥"
              href="/dashboard/users"
              color="blue"
            />
            <DashboardCard
              title="Absensi Hari Ini"
              value={todayAttendanceCount.toString()}
              icon="📋"
              href="/dashboard/admin/attendance"
              color="green"
            />
            <DashboardCard
              title="Laporan Gaji"
              value="Lihat"
              icon="💰"
              href="/dashboard/admin/salary"
              color="purple"
            />
          </>
        ) : (
          <>
            <DashboardCard
              title="Absen Masuk"
              value={
                todayAttendance?.check_in_time
                  ? formatTime(todayAttendance.check_in_time)
                  : 'Belum Absen'
              }
              icon="🕐"
              href="/dashboard/attendance"
              color="blue"
            />
            <DashboardCard
              title="Absen Keluar"
              value={
                todayAttendance?.check_out_time
                  ? formatTime(todayAttendance.check_out_time)
                  : 'Belum Absen'
              }
              icon="🕔"
              href="/dashboard/attendance"
              color="green"
            />
            <DashboardCard
              title="Total Jam Bulan Ini"
              value={
                monthStats ? formatHours(monthStats.totalHours) : '0 jam'
              }
              icon="⏱️"
              href="/dashboard/attendance"
              color="purple"
            />
          </>
        )}
      </div>

      {/* Quick Actions */}
      {!isAdmin && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Aksi Cepat
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/dashboard/attendance"
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow border-2 border-blue-100 hover:border-blue-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                  📋
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Kelola Absensi
                  </h3>
                  <p className="text-sm text-gray-600">
                    Absen masuk/keluar dan lihat riwayat
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/dashboard/profile"
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow border-2 border-purple-100 hover:border-purple-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
                  👤
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Edit Profil</h3>
                  <p className="text-sm text-gray-600">
                    Update informasi profil Anda
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

function DashboardCard({
  title,
  value,
  icon,
  href,
  color,
}: {
  title: string
  value: string
  icon: string
  href: string
  color: 'blue' | 'green' | 'purple'
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
  }

  return (
    <Link
      href={href}
      className={`bg-gradient-to-br ${colorClasses[color]} p-6 rounded-lg shadow-lg hover:shadow-xl transition-all text-white`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-3xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </Link>
  )
}
