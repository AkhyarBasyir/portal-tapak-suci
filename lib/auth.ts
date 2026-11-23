import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/lib/types'

export async function getSessionProfile(): Promise<{
  user: { id: string; email?: string | null }
  profile: Profile
} | null> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) {
      console.error('[auth] gagal membaca sesi:', authError.message)
      return null
    }
    if (!user) return null

    const { data, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    // Jangan pernah mengarang role "anggota" saat query gagal — bisa menurunkan admin.
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('[auth] gagal membaca profil:', profileError.message)
      return null
    }

    const profile: Profile = {
      id: user.id,
      email: user.email ?? null,
      full_name: data?.full_name || user.email?.split('@')[0] || 'Anggota',
      role: data?.role ?? 'anggota',
      jabatan: data?.jabatan ?? null,
      telepon: data?.telepon ?? null,
      avatar_url: data?.avatar_url ?? null,
      created_at: data?.created_at ?? new Date().toISOString(),
    }

    return { user, profile }
  } catch (error) {
    console.error('[auth] error tak terduga:', error)
    return null
  }
}

export function canManage(role: Profile['role'], minRole: 'admin' | 'pengurus') {
  if (minRole === 'admin') return role === 'admin'
  return role === 'admin' || role === 'pengurus'
}
