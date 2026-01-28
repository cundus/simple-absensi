'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@/lib/types/database'
import { formatCurrency } from '@/lib/utils'

interface SalaryCalculatorProps {
  users: User[]
}

export default function SalaryCalculator({ users }: SalaryCalculatorProps) {
  const router = useRouter()
  const [selectedUserId, setSelectedUserId] = useState('')
  const [period, setPeriod] = useState('')
  const [salaryType, setSalaryType] = useState<'day' | 'hour'>('day')
  const [salaryPerDay, setSalaryPerDay] = useState('')
  const [salaryPerHour, setSalaryPerHour] = useState('')
  const [isCalculating, setIsCalculating] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleCalculate = async () => {
    setError('')
    setResult(null)

    if (!selectedUserId || !period) {
      setError('Pilih karyawan dan periode')
      return
    }

    if (salaryType === 'day' && !salaryPerDay) {
      setError('Masukkan gaji per hari')
      return
    }

    if (salaryType === 'hour' && !salaryPerHour) {
      setError('Masukkan gaji per jam')
      return
    }

    setIsCalculating(true)

    try {
      const response = await fetch('/api/admin/salary/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: selectedUserId,
          period,
          salary_per_day: salaryType === 'day' ? parseFloat(salaryPerDay) : null,
          salary_per_hour: salaryType === 'hour' ? parseFloat(salaryPerHour) : null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal menghitung gaji')
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsCalculating(false)
    }
  }

  const handleSave = async () => {
    if (!result) return

    setIsCalculating(true)
    setError('')

    try {
      const response = await fetch('/api/admin/salary/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: selectedUserId,
          period,
          salary_per_day: salaryType === 'day' ? parseFloat(salaryPerDay) : null,
          salary_per_hour: salaryType === 'hour' ? parseFloat(salaryPerHour) : null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal menyimpan gaji')
      }

      alert('Gaji berhasil disimpan!')
      router.refresh()
      
      // Reset form
      setResult(null)
      setSelectedUserId('')
      setPeriod('')
      setSalaryPerDay('')
      setSalaryPerHour('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsCalculating(false)
    }
  }

  const selectedUser = users.find((u) => u.id === selectedUserId)

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        Hitung Gaji Karyawan
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Input */}
        <div className="space-y-4">
          {/* Select User */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Karyawan
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            >
              <option value="">-- Pilih Karyawan --</option>
              {users
                .filter((u) => u.status === 'active')
                .map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
            </select>
          </div>

          {/* Period */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Periode (YYYY-MM)
            </label>
            <input
              type="month"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            />
          </div>

          {/* Salary Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipe Gaji
            </label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="day"
                  checked={salaryType === 'day'}
                  onChange={(e) => setSalaryType(e.target.value as 'day')}
                  className="mr-2 w-4 h-4 text-blue-600"
                />
                <span className="text-gray-900 font-medium">Per Hari</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="hour"
                  checked={salaryType === 'hour'}
                  onChange={(e) => setSalaryType(e.target.value as 'hour')}
                  className="mr-2 w-4 h-4 text-blue-600"
                />
                <span className="text-gray-900 font-medium">Per Jam</span>
              </label>
            </div>
          </div>

          {/* Salary Amount */}
          {salaryType === 'day' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gaji Per Hari (Rp)
              </label>
              <input
                type="number"
                value={salaryPerDay}
                onChange={(e) => setSalaryPerDay(e.target.value)}
                placeholder="100000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gaji Per Jam (Rp)
              </label>
              <input
                type="number"
                value={salaryPerHour}
                onChange={(e) => setSalaryPerHour(e.target.value)}
                placeholder="15000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Calculate Button */}
          <button
            onClick={handleCalculate}
            disabled={isCalculating}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isCalculating ? 'Menghitung...' : 'Hitung Gaji'}
          </button>
        </div>

        {/* Right Column - Result */}
        <div>
          {result ? (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Hasil Perhitungan
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Karyawan:</span>
                  <span className="font-medium text-gray-900">
                    {selectedUser?.name}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Periode:</span>
                  <span className="font-medium text-gray-900">{period}</span>
                </div>

                <div className="border-t border-blue-200 my-3"></div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Hari Kerja:</span>
                  <span className="font-medium text-gray-900">
                    {result.total_days} hari
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Jam Kerja:</span>
                  <span className="font-medium text-gray-900">
                    {result.total_hours.toFixed(1)} jam
                  </span>
                </div>

                <div className="border-t border-blue-200 my-3"></div>

                {result.salary_per_day && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Gaji Per Hari:</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(result.salary_per_day)}
                    </span>
                  </div>
                )}

                {result.salary_per_hour && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Gaji Per Jam:</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(result.salary_per_hour)}
                    </span>
                  </div>
                )}

                <div className="border-t border-blue-200 my-3"></div>

                <div className="flex justify-between items-center bg-blue-100 p-3 rounded-lg">
                  <span className="text-gray-800 font-semibold">
                    Total Gaji:
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatCurrency(result.salary_amount)}
                  </span>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={isCalculating}
                className="w-full mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isCalculating ? 'Menyimpan...' : 'Simpan Gaji'}
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <p>Hasil perhitungan akan muncul di sini</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
