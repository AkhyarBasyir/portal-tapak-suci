import { randomUUID } from 'node:crypto'
import { safeError } from '@/lib/api-error'
import { getSessionProfile } from '@/lib/auth'
import { ROLES } from '@/lib/constants'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const session = await getSessionProfile()
  if (!session) return Response.json({ error: 'Belum login.' }, { status: 401 })
  if (session.profile.role !== 'admin') {
    return Response.json({ error: 'Hanya admin yang bisa menambah akun.' }, { status: 403 })
  }

  let body: Record<string, any>
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Data tidak valid.' }, { status: 400 })
  }

  const email = String(body.email ?? '').trim().toLowerCase()
  const password = String(body.password ?? '')
  const nama = String(body.nama ?? '').trim()
  const username = String(body.username ?? '').trim().toLowerCase()
  const role = String(body.role ?? 'anggota')
  const buatAnggota = body.buat_anggota !== false
  // Suffix UUID menghindari tabrakan NIP bila dua akun dibuat bersamaan.
  const nip = String(body.nip ?? '').trim()
    || `TS-${new Date().getFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`
  const jenjang = String(body.jenjang ?? '').trim()
  const jabatan = String(body.jabatan ?? '').trim()
  const cabang = String(body.cabang ?? '').trim()
  const telepon = String(body.telepon ?? '').trim()

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return Response.json({ error: 'Email wajib diisi dengan format yang benar.' }, { status: 400 })
  }
  if (password.length < 6) {
    return Response.json({ error: 'Password minimal 6 karakter.' }, { status: 400 })
  }
  if (!nama) {
    return Response.json({ error: 'Nama lengkap wajib diisi.' }, { status: 400 })
  }
  if (!(ROLES as readonly string[]).includes(role)) {
    return Response.json({ error: 'Peran tidak dikenal.' }, { status: 400 })
  }

  let userId: string | null = null

  try {
    const admin = createAdminClient()

    const { data: created, error: authError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: nama },
    })
    if (authError) {
      return Response.json({ error: safeError(authError, 'Email sudah terdaftar atau tidak valid.') }, { status: 400 })
    }
    userId = created.user?.id ?? null
    if (!userId) {
      return Response.json({ error: 'Akun berhasil dibuat tetapi ID tidak ditemukan.' }, { status: 500 })
    }

    const { error: profileError } = await admin.from('profiles').upsert({
      id: userId,
      email,
      full_name: nama,
      username: username || null,
      role,
      jabatan: jabatan || null,
      telepon: telepon || null,
    })
    if (profileError) {
      await admin.auth.admin.deleteUser(userId)
      return Response.json({ error: safeError(profileError, 'Profil gagal disimpan.') }, { status: 500 })
    }

    let anggotaNip: string | null = null
    if (buatAnggota) {
      const { error: anggotaError } = await admin.from('anggota').insert({
        nip,
        nama,
        jenjang: jenjang || 'Pengenal',
        jabatan: jabatan || 'Anggota',
        cabang: cabang || null,
        telepon: telepon || null,
        email,
        status: 'Aktif',
        tanggal_masuk: new Date().toISOString().slice(0, 10),
      })
      if (anggotaError) {
        await admin.auth.admin.deleteUser(userId)
        return Response.json({ error: safeError(anggotaError, 'Data anggota gagal disimpan.') }, { status: 500 })
      }
      anggotaNip = nip
    }

    return Response.json({ ok: true, id: userId, nip: anggotaNip }, { status: 201 })
  } catch (error) {
    if (userId) {
      try {
        await createAdminClient().auth.admin.deleteUser(userId)
      } catch {
        // Best-effort rollback; detail sudah dicatat di bawah.
      }
    }
    return Response.json(
      { error: safeError(error, 'Gagal menambah akun.') },
      { status: 500 },
    )
  }
}
