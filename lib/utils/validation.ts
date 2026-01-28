/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate period format (YYYY-MM)
 */
export function isValidPeriod(period: string): boolean {
  const periodRegex = /^\d{4}-(0[1-9]|1[0-2])$/
  return periodRegex.test(period)
}

/**
 * Validate date format (YYYY-MM-DD)
 */
export function isValidDate(date: string): boolean {
  const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
  if (!dateRegex.test(date)) return false
  
  const d = new Date(date)
  return d instanceof Date && !isNaN(d.getTime())
}

/**
 * Validate salary amount
 */
export function isValidSalary(amount: number): boolean {
  return amount > 0 && amount < 1000000000 // Max 1 billion
}

/**
 * Validate work hours
 */
export function isValidWorkHours(hours: number): boolean {
  return hours >= 0 && hours <= 24
}

/**
 * Check if user can check in (not too early)
 */
export function canCheckIn(): boolean {
  const now = new Date()
  const hour = now.getHours()
  // Allow check in from 5 AM to 11 PM
  return hour >= 5 && hour <= 23
}

/**
 * Check if user can check out (must check in first)
 */
export function canCheckOut(checkInTime: string | null): boolean {
  if (!checkInTime) return false
  
  const checkIn = new Date(checkInTime)
  const now = new Date()
  
  // Must be at least 1 hour after check in
  const hoursDiff = (now.getTime() - checkIn.getTime()) / (1000 * 60 * 60)
  return hoursDiff >= 1
}
