/**
 * Format date to Indonesian locale
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Format time to HH:MM
 */
export function formatTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Format datetime to Indonesian locale
 */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Get current date in YYYY-MM-DD format
 */
export function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0]
}

/**
 * Get current month in YYYY-MM format
 */
export function getCurrentMonth(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

/**
 * Get month name from YYYY-MM format
 */
export function getMonthName(period: string): string {
  const [year, month] = period.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1, 1)
  return date.toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Get date range for a month
 */
export function getMonthDateRange(period: string): { startDate: string; endDate: string } {
  const [year, month] = period.split('-')
  const startDate = `${year}-${month}-01`
  const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate()
  const endDate = `${year}-${month}-${String(lastDay).padStart(2, '0')}`
  return { startDate, endDate }
}

/**
 * Calculate work hours between two timestamps
 */
export function calculateWorkHours(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn).getTime()
  const end = new Date(checkOut).getTime()
  const hours = (end - start) / (1000 * 60 * 60)
  return Math.round(hours * 100) / 100
}

/**
 * Format hours to readable string (e.g., "8.5 jam")
 */
export function formatHours(hours: number): string {
  return `${hours.toFixed(1)} jam`
}

/**
 * Check if date is today
 */
export function isToday(date: string): boolean {
  const today = getCurrentDate()
  return date === today
}

/**
 * Get day name from date
 */
export function getDayName(date: string): string {
  const d = new Date(date)
  return d.toLocaleDateString('id-ID', { weekday: 'long' })
}
