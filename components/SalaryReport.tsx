'use client'

import { useState } from 'react'
import type { SalaryWithUser } from '@/lib/types/database'
import { formatCurrency } from '@/lib/utils'
import { exportSalariesCSV } from '@/lib/utils'

interface SalaryReportProps {
  salaries: SalaryWithUser[]
}

export default function SalaryReport({ salaries }: SalaryReportProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('')

  // Get unique periods
  const periods = Array.from(new Set(salaries.map((s) => s.period))).sort(
    (a, b) => b.localeCompare(a)
  )

  // Filter salaries
  const filteredSalaries = salaries.filter((sal) => {
    const matchesSearch =
      sal.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sal.user.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesPeriod = !selectedPeriod || sal.period === selectedPeriod

    return matchesSearch && matchesPeriod
  })

  const handleExport = () => {
    const filename = `gaji-${selectedPeriod || 'all'}.csv`
    exportSalariesCSV(filteredSalaries, filename)
  }

  // Calculate totals
  const totalSalary = filteredSalaries.reduce(
    (sum, sal) => sum + sal.salary_amount,
    0
  )
  const totalDays = filteredSalaries.reduce(
    (sum, sal) => sum + sal.total_days,
    0
  )
  const totalHours = filteredSalaries.reduce(
    (sum, sal) => sum + sal.total_hours,
    0
  )

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header & Filters */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Laporan Gaji</h2>
            <p className="text-sm text-gray-600 mt-1">
              Total: {filteredSalaries.length} record
            </p>
          </div>
          <button
            onClick={handleExport}
            disabled={filteredSalaries.length === 0}
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
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Gaji</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(totalSalary)}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Hari Kerja</p>
            <p className="text-2xl font-bold text-blue-600">{totalDays}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Jam Kerja</p>
            <p className="text-2xl font-bold text-purple-600">
              {totalHours.toFixed(1)}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Period */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Periode
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            >
              <option value="">Semua Periode</option>
              {periods.map((period) => (
                <option key={period} value={period}>
                  {period}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Periode
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Karyawan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Hari
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Jam
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gaji/Hari
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gaji/Jam
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Gaji
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSalaries.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  Tidak ada data gaji
                </td>
              </tr>
            ) : (
              filteredSalaries.map((salary) => (
                <tr key={salary.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {salary.period}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                        {salary.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {salary.user.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {salary.user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {salary.total_days}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {salary.total_hours.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {salary.salary_per_day
                      ? formatCurrency(salary.salary_per_day)
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {salary.salary_per_hour
                      ? formatCurrency(salary.salary_per_hour)
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                    {formatCurrency(salary.salary_amount)}
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
