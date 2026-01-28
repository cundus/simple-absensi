import type { AttendanceWithUser, SalaryWithUser } from '@/lib/types/database'
import { formatDate, formatTime, formatHours } from './date'
import { formatCurrency } from './format'

/**
 * Convert attendances to CSV
 */
export function attendancesToCSV(attendances: AttendanceWithUser[]): string {
  const headers = ['Tanggal', 'Nama', 'Email', 'Masuk', 'Keluar', 'Total Jam']
  
  const rows = attendances.map((att) => [
    formatDate(att.date),
    att.user.name,
    att.user.email,
    att.check_in_time ? formatTime(att.check_in_time) : '-',
    att.check_out_time ? formatTime(att.check_out_time) : '-',
    att.total_work_hours ? formatHours(att.total_work_hours) : '-',
  ])
  
  const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
  return csv
}

/**
 * Convert salaries to CSV
 */
export function salariesToCSV(salaries: SalaryWithUser[]): string {
  const headers = [
    'Periode',
    'Nama',
    'Email',
    'Total Hari',
    'Total Jam',
    'Gaji/Hari',
    'Gaji/Jam',
    'Total Gaji',
  ]
  
  const rows = salaries.map((sal) => [
    sal.period,
    sal.user.name,
    sal.user.email,
    sal.total_days.toString(),
    sal.total_hours.toFixed(1),
    sal.salary_per_day ? formatCurrency(sal.salary_per_day) : '-',
    sal.salary_per_hour ? formatCurrency(sal.salary_per_hour) : '-',
    formatCurrency(sal.salary_amount),
  ])
  
  const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
  return csv
}

/**
 * Download CSV file
 */
export function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Export attendances to CSV and download
 */
export function exportAttendancesCSV(
  attendances: AttendanceWithUser[],
  filename = 'absensi.csv'
) {
  const csv = attendancesToCSV(attendances)
  downloadCSV(csv, filename)
}

/**
 * Export salaries to CSV and download
 */
export function exportSalariesCSV(salaries: SalaryWithUser[], filename = 'gaji.csv') {
  const csv = salariesToCSV(salaries)
  downloadCSV(csv, filename)
}
