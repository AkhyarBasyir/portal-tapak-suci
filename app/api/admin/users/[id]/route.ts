import { getSessionProfile } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

const ROLES = ['admin', 'pengurus', 'anggota']

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSessionProfile()
  if (!session) return Response.json({ error: 'Belum login.' }, { status: 401 })
  if (session.profile.role !== 'admin') {
    return Response.json({ error: 'Hanya admin yang bisa mengubah pengguna.' }, { status: 403 })
  }

  const { id } = await params
  let body: Record<string, any>
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Data tidak valid.' }, { status: 400 })
  }

  const nama = String(body.full_name ?? '').trim()
  const username = String(body.username ?? '').trim().toLowerCase()
  const email = String(body.email ?? '').trim().toLowerCase()
  const role = String(body.role ?? 'anggota')
  const jabatan = String(body.jabatan ?? '').trim()
  const telepon = String(body.telepon ?? '').trim()
  const password = String(body.password ?? '')

  if (!nama) {
    return Response.json({ error: 'Nama lengkap wajib diisi.' }, { status: 400 })
  }
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return Response.json({ error: 'Email wajib diisi dengan format yang benar.' }, { status: 400 })
  }
  if (!ROLES.includes(role)) {
    return Response.json({ error: 'Peran tidak dikenal.' }, { status: 400 })
  }
  if (password && password.length < 6) {
    return Response.json({ error: 'Password minimal 6 karakter.' }, { status: 400 })
  }

  try {
    const admin = createAdminClient()

    const { data: current, error: currentError } = await admin.auth.admin.getUserById(id)
    if (currentError || !current.user) {
      return Response.json({ error: 'Akun tidak ditemukan.' }, { status: 404 })
    }

    if (email !== current.user.email) {
      const { error: emailError } = await admin.auth.admin.updateUserById(id, { email })
      if (emailError) {
        return Response.json({ error: `Email gagal diperbarui: ${emailError.message}` }, { status: 400 })
      }
    }
    if (password) {
      const { error: passwordError } = await admin.auth.admin.updateUserById(id, { password })
      if (passwordError) {
        return Response.json({ error: `Password gagal diperbarui: ${passwordError.message}` }, { status: 400 })
      }
    }

    const { error: profileError } = await admin
      .from('profiles')
      .update({
        full_name: nama,
        username: username || null,
        email,
        role,
        jabatan: jabatan || null,
        telepon: telepon || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
    if (profileError) {
      return Response.json({ error: `Profil gagal diperbarui: ${profileError.message}` }, { status: 500 })
    }

    return Response.json({ ok: true })
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Gagal mengubah pengguna.' },
      { status: 500 },
    )
  }
}
