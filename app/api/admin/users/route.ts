import { getSessionProfile } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

const ROLES = ['admin', 'pengurus', 'anggota']

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
  const role = String(body.role ?? 'anggota')
  const nip = String(body.nip ?? '').trim() || `TS-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`
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
  if (!ROLES.includes(role)) {
    return Response.json({ error: 'Peran tidak dikenal.' }, { status: 400 })
  }

  try {
    const admin = createAdminClient()

    const { data: created, error: authError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: nama },
    })
    if (authError) {
      return Response.json({ error: authError.message }, { status: 400 })
    }
    const userId = created.user?.id
    if (!userId) {
      return Response.json({ error: 'Akun berhasil dibuat tetapi ID tidak ditemukan.' }, { status: 500 })
    }

    const { error: profileError } = await admin.from('profiles').upsert({
      id: userId,
      email,
      full_name: nama,
      role,
      jabatan: jabatan || null,
      telepon: telepon || null,
    })
    if (profileError) {
      return Response.json({ error: `Profil gagal disimpan: ${profileError.message}` }, { status: 500 })
    }

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
      return Response.json({ error: `Data anggota gagal disimpan: ${anggotaError.message}` }, { status: 500 })
    }

    return Response.json({ ok: true, id: userId, nip }, { status: 201 })
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Gagal menambah akun.' },
      { status: 500 },
    )
  }
}
