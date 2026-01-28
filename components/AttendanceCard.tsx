'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Attendance } from '@/lib/types/database'
import { formatTime, formatHours, getCurrentDate } from '@/lib/utils'
import LoadingSpinner from './LoadingSpinner'

interface AttendanceCardProps {
  attendance: Attendance | null
}

export default function AttendanceCard({ attendance }: AttendanceCardProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasCheckedIn = !!attendance?.check_in_time
  const hasCheckedOut = !!attendance?.check_out_time

  const handleCheckIn = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/attendance/check-in', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal absen masuk')
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckOut = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/attendance/check-out', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal absen keluar')
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Absensi Hari Ini
        </h2>
        <p className="text-gray-600">{getCurrentDate()}</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div className="flex-1">
            <p className="text-red-800 font-medium">Gagal Melakukan Absensi</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Check In Status */}
        <div className="p-6 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Masuk</h3>
            <span className="text-3xl">🕐</span>
          </div>
          {hasCheckedIn ? (
            <div>
              <p className="text-3xl font-bold text-blue-600">
                {formatTime(attendance.check_in_time!)}
              </p>
              <p className="text-sm text-gray-600 mt-2">Sudah absen masuk</p>
            </div>
          ) : (
            <div>
              <p className="text-2xl font-bold text-gray-400">--:--</p>
              <p className="text-sm text-gray-600 mt-2">Belum absen masuk</p>
            </div>
          )}
        </div>

        {/* Check Out Status */}
        <div className="p-6 bg-green-50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Keluar</h3>
            <span className="text-3xl">🕔</span>
          </div>
          {hasCheckedOut ? (
            <div>
              <p className="text-3xl font-bold text-green-600">
                {formatTime(attendance.check_out_time!)}
              </p>
              <p className="text-sm text-gray-600 mt-2">Sudah absen keluar</p>
            </div>
          ) : (
            <div>
              <p className="text-2xl font-bold text-gray-400">--:--</p>
              <p className="text-sm text-gray-600 mt-2">Belum absen keluar</p>
            </div>
          )}
        </div>
      </div>

      {/* Total Work Hours */}
      {attendance?.total_work_hours && (
        <div className="mb-8 p-6 bg-purple-50 rounded-lg text-center">
          <p className="text-sm text-gray-600 mb-2">Total Jam Kerja</p>
          <p className="text-4xl font-bold text-purple-600">
            {formatHours(attendance.total_work_hours)}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        {!hasCheckedIn && (
          <button
            onClick={handleCheckIn}
            disabled={loading}
            className="flex-1 bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Memproses...</span>
              </>
            ) : (
              <>🕐 Absen Masuk</>
            )}
          </button>
        )}

        {hasCheckedIn && !hasCheckedOut && (
          <button
            onClick={handleCheckOut}
            disabled={loading}
            className="flex-1 bg-green-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Memproses...</span>
              </>
            ) : (
              <>🕔 Absen Keluar</>
            )}
          </button>
        )}

        {hasCheckedIn && hasCheckedOut && (
          <div className="flex-1 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 text-green-700 px-6 py-4 rounded-lg font-semibold text-center">
            ✅ Absensi Hari Ini Selesai
          </div>
        )}
      </div>
    </div>
  )
}
