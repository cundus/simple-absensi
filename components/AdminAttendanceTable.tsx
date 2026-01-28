'use client'

import { useState } from 'react'
import type { AttendanceWithUser } from '@/lib/types/database'
import { formatDate, formatTime, formatHours, getDayName } from '@/lib/utils'
import { exportAttendancesCSV } from '@/lib/utils'

interface AdminAttendanceTableProps {
  attendances: AttendanceWithUser[]
}

export default function AdminAttendanceTable({
  attendances,
}: AdminAttendanceTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Filter attendances
  const filteredAttendances = attendances.filter((att) => {
    const matchesSearch =
      att.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      att.user.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStartDate = !startDate || att.date >= startDate
    const matchesEndDate = !endDate || att.date <= endDate

    return matchesSearch && matchesStartDate && matchesEndDate
  })

  const handleExport = () => {
    const filename = `absensi-${startDate || 'all'}-${endDate || 'all'}.csv`
    exportAttendancesCSV(filteredAttendances, filename)
  }

  // Calculate statistics
  const totalAttendances = filteredAttendances.length
  const totalHours = filteredAttendances.reduce(
    (sum, att) => sum + (att.total_work_hours || 0),
    0
  )
  const avgHours = totalAttendances > 0 ? totalHours / totalAttendances : 0

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header & Filters */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Kelola Absensi Karyawan
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Total: {filteredAttendances.length} absensi
            </p>
          </div>
          <button
            onClick={handleExport}
            disabled={filteredAttendances.length === 0}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export CSV
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Absensi</p>
            <p className="text-2xl font-bold text-blue-600">
              {totalAttendances}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Jam Kerja</p>
            <p className="text-2xl font-bold text-purple-600">
              {formatHours(totalHours)}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Rata-rata Jam/Hari</p>
            <p className="text-2xl font-bold text-green-600">
              {formatHours(avgHours)}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cari Karyawan
            </label>
            <input
              type="text"
              placeholder="Nama atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dari Tanggal
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sampai Tanggal
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hari
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Karyawan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Masuk
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Keluar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Jam
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAttendances.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Tidak ada data absensi
                </td>
              </tr>
            ) : (
              filteredAttendances.map((attendance) => (
                <tr key={attendance.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(attendance.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {getDayName(attendance.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                        {attendance.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {attendance.user.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {attendance.user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {attendance.check_in_time ? (
                      <span className="text-blue-600 font-medium">
                        {formatTime(attendance.check_in_time)}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {attendance.check_out_time ? (
                      <span className="text-green-600 font-medium">
                        {formatTime(attendance.check_out_time)}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {attendance.total_work_hours ? (
                      <span className="text-purple-600 font-medium">
                        {formatHours(attendance.total_work_hours)}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
