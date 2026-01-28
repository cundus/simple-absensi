import { createClient } from '@/lib/supabase/server'
import { updateUser } from '@/lib/database'
import { NextResponse } from 'next/server'

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, avatar_url } = body

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Nama tidak boleh kosong' },
        { status: 400 }
      )
    }

    const updateData: any = { name: name.trim() }
    if (avatar_url !== undefined) {
      updateData.avatar_url = avatar_url
    }

    const updatedUser = await updateUser(user.id, updateData)

    return NextResponse.json({ data: updatedUser })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal update profile' },
      { status: 400 }
    )
  }
}
