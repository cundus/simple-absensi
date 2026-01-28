'use client'

import { useRouter } from 'next/navigation'
import type { User } from '@/lib/types/database'
import UserTable from '@/components/UserTable'

interface UsersPageClientProps {
  users: User[]
}

export default function UsersPageClient({ users }: UsersPageClientProps) {
  const router = useRouter()

  const handleUpdate = () => {
    router.refresh()
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Kelola Karyawan</h1>
        <p className="text-gray-600 mt-2">
          Kelola data karyawan, role, dan status
        </p>
      </div>

      <UserTable users={users} onUpdate={handleUpdate} />
    </div>
  )
}
