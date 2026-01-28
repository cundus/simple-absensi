import { createClient } from '@/lib/supabase/server'
import type { Attendance, AttendanceWithUser, CheckInInput, CheckOutInput } from '@/lib/types/database'

/**
 * Check in (create attendance record)
 */
export async function checkIn(userId: string) {
  const supabase = await createClient()
  
  const today = new Date().toISOString().split('T')[0]
  
  // Check if already checked in today
  const { data: existing } = await supabase
    .from('attendances')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single()
  
  if (existing) {
    throw new Error('Anda sudah absen masuk hari ini')
  }
  
  const { data, error } = await supabase
    .from('attendances')
    .insert({
      user_id: userId,
      date: today,
      check_in_time: new Date().toISOString(),
    })
    .select()
    .single()
  
  if (error) throw error
  return data as Attendance
}

/**
 * Check out (update attendance record)
 */
export async function checkOut(userId: string) {
  const supabase = await createClient()
  
  const today = new Date().toISOString().split('T')[0]
  
  // Get today's attendance
  const { data: attendance } = await supabase
    .from('attendances')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single()
  
  if (!attendance) {
    throw new Error('Anda belum absen masuk hari ini')
  }
  
  if (attendance.check_out_time) {
    throw new Error('Anda sudah absen keluar hari ini')
  }
  
  const { data, error } = await supabase
    .from('attendances')
    .update({
      check_out_time: new Date().toISOString(),
    })
    .eq('id', attendance.id)
    .select()
    .single()
  
  if (error) throw error
  return data as Attendance
}

/**
 * Get today's attendance for a user
 */
export async function getTodayAttendance(userId: string) {
  const supabase = await createClient()
  
  const today = new Date().toISOString().split('T')[0]
  
  const { data, error } = await supabase
    .from('attendances')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return data as Attendance | null
}

/**
 * Get user's attendance history
 */
export async function getUserAttendances(userId: string, limit = 30) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('attendances')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data as Attendance[]
}

/**
 * Get all attendances with user info (Admin only)
 */
export async function getAllAttendances(limit = 100) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('attendances')
    .select(`
      *,
      user:users(*)
    `)
    .order('date', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data as AttendanceWithUser[]
}

/**
 * Get attendances by date range
 */
export async function getAttendancesByDateRange(startDate: string, endDate: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('attendances')
    .select(`
      *,
      user:users(*)
    `)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false })
  
  if (error) throw error
  return data as AttendanceWithUser[]
}

/**
 * Get attendances by user and date range
 */
export async function getUserAttendancesByDateRange(
  userId: string,
  startDate: string,
  endDate: string
) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('attendances')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false })
  
  if (error) throw error
  return data as Attendance[]
}

/**
 * Get today's attendance count
 */
export async function getTodayAttendanceCount() {
  const supabase = await createClient()
  
  const today = new Date().toISOString().split('T')[0]
  
  const { count, error } = await supabase
    .from('attendances')
    .select('*', { count: 'exact', head: true })
    .eq('date', today)
  
  if (error) throw error
  return count || 0
}

/**
 * Get attendance statistics for a user
 */
export async function getUserAttendanceStats(userId: string, month: string) {
  const supabase = await createClient()
  
  // month format: YYYY-MM
  const startDate = `${month}-01`
  const endDate = `${month}-31`
  
  const { data, error } = await supabase
    .from('attendances')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
  
  if (error) throw error
  
  const attendances = data as Attendance[]
  
  const totalDays = attendances.length
  const totalHours = attendances.reduce((sum, att) => {
    return sum + (att.total_work_hours || 0)
  }, 0)
  
  return {
    totalDays,
    totalHours: Math.round(totalHours * 100) / 100,
    attendances,
  }
}

/**
 * Delete attendance (Admin only)
 */
export async function deleteAttendance(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('attendances')
    .delete()
    .eq('id', id)
  
  if (error) throw error
  return true
}
