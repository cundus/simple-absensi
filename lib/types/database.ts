// Database Types
// Generated from Supabase schema

export type UserRole = 'admin' | 'employee'
export type UserStatus = 'active' | 'inactive'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  avatar_url?: string | null
  created_at: string
  updated_at: string
}

export interface Attendance {
  id: string
  user_id: string
  date: string
  check_in_time: string | null
  check_out_time: string | null
  total_work_hours: number | null
  created_at: string
  updated_at: string
}

export interface Salary {
  id: string
  user_id: string
  period: string // Format: YYYY-MM
  total_days: number
  total_hours: number
  salary_per_day: number | null
  salary_per_hour: number | null
  salary_amount: number
  created_at: string
  updated_at: string
}

// Extended types with relations
export interface AttendanceWithUser extends Attendance {
  user: User
}

export interface SalaryWithUser extends Salary {
  user: User
}

// Form types
export interface CreateUserInput {
  name: string
  email: string
  role: UserRole
  status: UserStatus
}

export interface UpdateUserInput {
  name?: string
  role?: UserRole
  status?: UserStatus
  avatar_url?: string | null
}

export interface CheckInInput {
  user_id: string
  date: string
  check_in_time: string
}

export interface CheckOutInput {
  id: string
  check_out_time: string
}

export interface CalculateSalaryInput {
  user_id: string
  period: string
  salary_per_day?: number
  salary_per_hour?: number
}

// API Response types
export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}
