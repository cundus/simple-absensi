import { createClient } from '@/lib/supabase/server'
import { checkIn } from '@/lib/database'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const attendance = await checkIn(user.id)

    return NextResponse.json({ data: attendance })
  } catch (error) {
    console.error('Check in error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal absen masuk' },
      { status: 400 }
    )
  }
}
