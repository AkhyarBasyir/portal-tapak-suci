import { randomUUID } from 'node:crypto'
import { safeError } from '@/lib/api-error'
import { getSessionProfile } from '@/lib/auth'
import { ROLES } from '@/lib/constants'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

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
  if (!(ROLES as readonly string[]).includes(role)) {
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

    const emailLama = (current.user.email ?? '').toLowerCase()

    const { data: targetProfile } = await admin
      .from('profiles')
      .select('role')
      .eq('id', id)
      .maybeSingle()

    // Jangan biarkan admin terakhir menurunkan dirinya sendiri.
    if (targetProfile?.role === 'admin' && role !== 'admin' && id === session.user.id) {
      const { count } = await admin
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'admin')
      if ((count ?? 0) <= 1) {
        return Response.json(
          { error: 'Tidak bisa menurunkan peran: masih ada satu admin aktif.' },
          { status: 400 },
        )
      }
    }

    const authUpdate: { email?: string; password?: string } = {}
    if (email !== emailLama) authUpdate.email = email
    if (password) authUpdate.password = password
    if (Object.keys(authUpdate).length) {
      const { error: authError } = await admin.auth.admin.updateUserById(id, authUpdate)
      if (authError) {
        return Response.json({ error: safeError(authError, 'Akun gagal diperbarui.') }, { status: 400 })
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
      return Response.json({ error: safeError(profileError, 'Profil gagal diperbarui.') }, { status: 500 })
    }

    // Sinkronkan data anggota agar daftar anggota tidak menampilkan data lama.
    const { data: anggotaLama } = await admin
      .from('anggota')
      .select('id')
      .eq('email', emailLama)
      .limit(1)

    const dataAnggota = {
      nama,
      jabatan: jabatan || 'Anggota',
      telepon: telepon || null,
      email,
      updated_at: new Date().toISOString(),
    }

    if (anggotaLama?.length) {
      const { error: anggotaError } = await admin
        .from('anggota')
        .update(dataAnggota)
        .eq('id', anggotaLama[0].id)
      if (anggotaError) {
        return Response.json({ error: safeError(anggotaError, 'Data anggota gagal diperbarui.') }, { status: 500 })
      }
    } else {
      const { error: anggotaError } = await admin.from('anggota').insert({
        nip: `TS-${new Date().getFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`,
        ...dataAnggota,
        jenjang: 'Pengenal',
        status: 'Aktif',
        tanggal_masuk: new Date().toISOString().slice(0, 10),
      })
      if (anggotaError) {
        return Response.json({ error: safeError(anggotaError, 'Data anggota gagal disimpan.') }, { status: 500 })
      }
    }

    return Response.json({ ok: true })
  } catch (error) {
    return Response.json(
      { error: safeError(error, 'Gagal mengubah pengguna.') },
      { status: 500 },
    )
  }
}
