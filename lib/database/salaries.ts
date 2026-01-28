import { createClient } from '@/lib/supabase/server'
import type { Salary, SalaryWithUser, CalculateSalaryInput } from '@/lib/types/database'
import { getUserAttendanceStats } from './attendances'

/**
 * Calculate salary for a user in a specific period
 */
export async function calculateSalary(input: CalculateSalaryInput) {
  const { user_id, period, salary_per_day, salary_per_hour } = input
  
  // Get attendance stats for the period
  const stats = await getUserAttendanceStats(user_id, period)
  
  let salaryAmount = 0
  
  if (salary_per_day) {
    salaryAmount = stats.totalDays * salary_per_day
  } else if (salary_per_hour) {
    salaryAmount = stats.totalHours * salary_per_hour
  } else {
    throw new Error('Salary per day or per hour is required')
  }
  
  return {
    user_id,
    period,
    total_days: stats.totalDays,
    total_hours: stats.totalHours,
    salary_per_day: salary_per_day || null,
    salary_per_hour: salary_per_hour || null,
    salary_amount: Math.round(salaryAmount * 100) / 100,
  }
}

/**
 * Save salary record
 */
export async function saveSalary(input: CalculateSalaryInput) {
  const supabase = await createClient()
  
  const salaryData = await calculateSalary(input)
  
  // Check if salary already exists for this period
  const { data: existing } = await supabase
    .from('salaries')
    .select('*')
    .eq('user_id', input.user_id)
    .eq('period', input.period)
    .single()
  
  if (existing) {
    // Update existing
    const { data, error } = await supabase
      .from('salaries')
      .update(salaryData)
      .eq('id', existing.id)
      .select()
      .single()
    
    if (error) throw error
    return data as Salary
  } else {
    // Insert new
    const { data, error } = await supabase
      .from('salaries')
      .insert(salaryData)
      .select()
      .single()
    
    if (error) throw error
    return data as Salary
  }
}

/**
 * Get salary by user and period
 */
export async function getSalaryByUserAndPeriod(userId: string, period: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('salaries')
    .select('*')
    .eq('user_id', userId)
    .eq('period', period)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return data as Salary | null
}

/**
 * Get user's salary history
 */
export async function getUserSalaries(userId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('salaries')
    .select('*')
    .eq('user_id', userId)
    .order('period', { ascending: false })
  
  if (error) throw error
  return data as Salary[]
}

/**
 * Get all salaries with user info (Admin only)
 */
export async function getAllSalaries() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('salaries')
    .select(`
      *,
      user:users(*)
    `)
    .order('period', { ascending: false })
  
  if (error) throw error
  return data as SalaryWithUser[]
}

/**
 * Get salaries by period
 */
export async function getSalariesByPeriod(period: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('salaries')
    .select(`
      *,
      user:users(*)
    `)
    .eq('period', period)
    .order('salary_amount', { ascending: false })
  
  if (error) throw error
  return data as SalaryWithUser[]
}

/**
 * Delete salary record (Admin only)
 */
export async function deleteSalary(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('salaries')
    .delete()
    .eq('id', id)
  
  if (error) throw error
  return true
}

/**
 * Get total salary for a period
 */
export async function getTotalSalaryByPeriod(period: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('salaries')
    .select('salary_amount')
    .eq('period', period)
  
  if (error) throw error
  
  const total = data.reduce((sum, salary) => sum + salary.salary_amount, 0)
  return Math.round(total * 100) / 100
}
