import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/database'
import { calculateSalary } from '@/lib/database/salaries'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { user_id, period, salary_per_day, salary_per_hour } = body

    // Validation
    if (!user_id || !period) {
      return NextResponse.json(
        { error: 'User ID dan periode wajib diisi' },
        { status: 400 }
      )
    }

    if (!salary_per_day && !salary_per_hour) {
      return NextResponse.json(
        { error: 'Gaji per hari atau per jam wajib diisi' },
        { status: 400 }
      )
    }

    // Calculate salary
    const result = await calculateSalary({
      user_id,
      period,
      salary_per_day: salary_per_day || null,
      salary_per_hour: salary_per_hour || null,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Calculate salary error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
