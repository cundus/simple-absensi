import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from '@/components/ProfileForm'
import { getCurrentUser } from '@/lib/database'
import { formatDate } from '@/lib/utils'

export default async function ProfilePage() {
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

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Profil Saya</h1>
        <p className="text-gray-600 mt-2">
          Kelola informasi profil dan akun Anda
        </p>
      </div>

      {/* Profile Info Card */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg p-8 text-white">
        <div className="flex items-center gap-6">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-blue-600 shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-blue-100 mt-1">{user.email}</p>
            <p className="text-blue-100 text-sm mt-2">
              Bergabung sejak {formatDate(user.created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <ProfileForm user={user} />
    </div>
  )
}
