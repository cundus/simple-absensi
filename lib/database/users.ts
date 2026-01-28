import { createClient } from '@/lib/supabase/server'
import type { User, CreateUserInput, UpdateUserInput } from '@/lib/types/database'

/**
 * Get all users (Admin only)
 */
export async function getAllUsers() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as User[]
}

/**
 * Get user by ID
 */
export async function getUserById(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data as User
}

/**
 * Get current logged in user profile
 */
export async function getCurrentUser() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()
  
  if (error) throw error
  return data as User
}

/**
 * Update user profile
 */
export async function updateUser(id: string, input: UpdateUserInput) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('users')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data as User
}

/**
 * Update user role (Admin only)
 */
export async function updateUserRole(id: string, role: 'admin' | 'employee') {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('users')
    .update({ role })
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data as User
}

/**
 * Update user status (Admin only)
 */
export async function updateUserStatus(id: string, status: 'active' | 'inactive') {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('users')
    .update({ status })
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data as User
}

/**
 * Delete user (Admin only)
 */
export async function deleteUser(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id)
  
  if (error) throw error
  return true
}

/**
 * Get users by role
 */
export async function getUsersByRole(role: 'admin' | 'employee') {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('role', role)
    .order('name')
  
  if (error) throw error
  return data as User[]
}

/**
 * Get active users count
 */
export async function getActiveUsersCount() {
  const supabase = await createClient()
  
  const { count, error } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')
  
  if (error) throw error
  return count || 0
}

/**
 * Search users by name or email
 */
export async function searchUsers(query: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
    .order('name')
  
  if (error) throw error
  return data as User[]
}
