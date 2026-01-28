import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getCurrentUser, getAllUsers, getAllSalaries } from '@/lib/database'
import SalaryCalculator from '@/components/SalaryCalculator'
import SalaryReport from '@/components/SalaryReport'

export default async function AdminSalaryPage() {
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

  // Get all users and salaries
  const users = await getAllUsers()
  const salaries = await getAllSalaries()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Kelola Gaji</h1>
        <p className="text-gray-600 mt-2">
          Hitung dan kelola gaji karyawan berdasarkan absensi
        </p>
      </div>

      {/* Salary Calculator */}
      <SalaryCalculator users={users} />

      {/* Salary Report */}
      <SalaryReport salaries={salaries} />
    </div>
  )
}
