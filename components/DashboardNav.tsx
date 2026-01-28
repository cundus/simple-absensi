'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import Image from 'next/image'

interface DashboardNavProps {
  user: User
  userRole?: string
}

export default function DashboardNav({ user, userRole }: DashboardNavProps) {
  const router = useRouter()
  const supabase = createClient()
  const isAdmin = userRole === 'admin'

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <a href="/dashboard" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="text-xl font-bold text-indigo-600">
                Absensi App
              </span>
            </a>
            <div className="hidden md:flex gap-4">
              <a
                href="/dashboard"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </a>
              {isAdmin && (
                <>
                  <a
                    href="/dashboard/users"
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Karyawan
                  </a>
                  <a
                    href="/dashboard/admin/attendance"
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Kelola Absensi
                  </a>
                  <a
                    href="/dashboard/admin/salary"
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Kelola Gaji
                  </a>
                </>
              )}
              {!isAdmin && (
                <a
                  href="/dashboard/attendance"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Absensi
                </a>
              )}
              <a
                href="/dashboard/profile"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Profil
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* User Avatar & Email */}
            <div className="flex items-center gap-3">
              {userRole && (
                <>
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover border-2 border-blue-200"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold border-2 border-blue-200">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </>
              )}
              <span className="text-sm text-gray-600 hidden md:block">{user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
