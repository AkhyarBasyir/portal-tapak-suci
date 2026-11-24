import { randomUUID } from 'node:crypto'
import { safeError } from '@/lib/api-error'
import { canManageAccount, getSessionProfile } from '@/lib/auth'
import { ROLES } from '@/lib/constants'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Role } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSessionProfile()
  if (!session) return Response.json({ error: 'Belum login.' }, { status: 401 })
  if (session.profile.role !== 'admin' && session.profile.role !== 'pengurus') {
    return Response.json({ error: 'Hanya admin dan pengurus yang bisa mengubah pengguna.' }, { status: 403 })
  }

  const { id } = await params
  let body: Record<string, any>
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Data tidak valid.' }, { status: 400 })
  }

  const nama = String(body.full_name ?? '').trim()
  const username = body.username === undefined ? undefined : String(body.username).trim().toLowerCase()
  const email = String(body.email ?? '').trim().toLowerCase()
  const roleDiminta = body.role === undefined ? undefined : String(body.role)
  const jabatan = body.jabatan === undefined ? undefined : String(body.jabatan).trim()
  const telepon = body.telepon === undefined ? undefined : String(body.telepon).trim()
  const password = String(body.password ?? '')

  if (!nama) {
    return Response.json({ error: 'Nama lengkap wajib diisi.' }, { status: 400 })
  }
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return Response.json({ error: 'Email wajib diisi dengan format yang benar.' }, { status: 400 })
  }
  if (roleDiminta !== undefined && !(ROLES as readonly string[]).includes(roleDiminta)) {
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
      .select('role, username, jabatan, telepon')
      .eq('id', id)
      .maybeSingle()

    if (!targetProfile?.role) {
      return Response.json({ error: 'Profil pengguna tidak ditemukan.' }, { status: 404 })
    }
    const targetRole = targetProfile.role as Role
    // Field yang tidak dikirim tidak boleh menimpa data lama.
    let role = roleDiminta ?? targetRole

    // Pengurus hanya boleh menyentuh akun anggota, tidak boleh admin/pengurus.
    if (!canManageAccount(session.profile.role, targetRole)) {
      return Response.json({ error: 'Pengurus hanya bisa mengubah akun anggota.' }, { status: 403 })
    }
    if (session.profile.role === 'pengurus' && role !== 'anggota') {
      return Response.json({ error: 'Pengurus tidak bisa mengubah peran akun.' }, { status: 403 })
    }
    if (session.profile.role === 'pengurus') role = 'anggota'

    // Jangan biarkan admin terakhir menurunkan dirinya sendiri.
    if (targetRole === 'admin' && role !== 'admin' && id === session.user.id) {
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
        username: username === undefined ? targetProfile.username ?? null : username || null,
        email,
        role,
        jabatan: jabatan === undefined ? targetProfile.jabatan ?? null : jabatan || null,
        telepon: telepon === undefined ? targetProfile.telepon ?? null : telepon || null,
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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSessionProfile()
  if (!session) return Response.json({ error: 'Belum login.' }, { status: 401 })
  if (session.profile.role !== 'admin' && session.profile.role !== 'pengurus') {
    return Response.json({ error: 'Hanya admin dan pengurus yang bisa menghapus akun.' }, { status: 403 })
  }

  const { id } = await params

  try {
    const admin = createAdminClient()

    const { data: targetProfile } = await admin
      .from('profiles')
      .select('role, email')
      .eq('id', id)
      .maybeSingle()

    if (!targetProfile?.role) {
      return Response.json({ error: 'Pengguna tidak ditemukan.' }, { status: 404 })
    }

    const targetRole = targetProfile.role as Role
    if (!canManageAccount(session.profile.role, targetRole)) {
      return Response.json({ error: 'Pengurus hanya bisa menghapus akun anggota.' }, { status: 403 })
    }

    if (targetRole === 'admin') {
      const { count } = await admin
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'admin')
      if ((count ?? 0) <= 1) {
        return Response.json(
          { error: 'Tidak bisa menghapus satu-satunya admin aktif.' },
          { status: 400 },
        )
      }
    }

    const { error } = await admin.auth.admin.deleteUser(id)
    if (error) {
      return Response.json({ error: safeError(error, 'Akun gagal dihapus.') }, { status: 400 })
    }

    // Hapus data anggota yang tertaut agar tidak menjadi data yatim.
    if (targetRole === 'anggota' && targetProfile.email) {
      await admin.from('anggota').delete().eq('email', String(targetProfile.email).toLowerCase())
    }

    return Response.json({ ok: true })
  } catch (error) {
    return Response.json(
      { error: safeError(error, 'Gagal menghapus akun.') },
      { status: 500 },
    )
  }
}
