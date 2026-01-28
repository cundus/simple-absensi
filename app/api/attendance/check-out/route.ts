import { createClient } from '@/lib/supabase/server'
import { checkOut } from '@/lib/database'
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

    const attendance = await checkOut(user.id)

    return NextResponse.json({ data: attendance })
  } catch (error) {
    console.error('Check out error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal absen keluar' },
      { status: 400 }
    )
  }
}
