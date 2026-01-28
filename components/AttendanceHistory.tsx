'use client'

import type { Attendance } from '@/lib/types/database'
import { formatDate, formatTime, formatHours, getDayName } from '@/lib/utils'

interface AttendanceHistoryProps {
  attendances: Attendance[]
}

export default function AttendanceHistory({ attendances }: AttendanceHistoryProps) {
  if (attendances.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">Belum ada riwayat absensi</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-800">Riwayat Absensi</h2>
        <p className="text-sm text-gray-600 mt-1">30 hari terakhir</p>
      </div>

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
            {attendances.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12">
                  <div className="text-center">
                    <div className="text-5xl mb-4">📭</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Belum Ada Riwayat Absensi
                    </h3>
                    <p className="text-gray-600">
                      Mulai absen masuk untuk melihat riwayat absensi Anda
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              attendances.map((attendance) => (
              <tr key={attendance.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(attendance.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {getDayName(attendance.date)}
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
