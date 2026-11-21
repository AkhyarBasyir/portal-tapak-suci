import { createClient } from '@/lib/supabase/server'
import { JENIS_UMUM_PUBLIK } from '@/lib/program-latihan'
import type { RaportLengkap } from '@/lib/raport'

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>

async function getClient(): Promise<SupabaseServerClient | null> {
  try {
    return await createClient()
  } catch {
    // Portal awal tetap bisa ditampilkan walau environment belum diisi.
    return null
  }
}

async function safeFetch<T>(
  query: PromiseLike<{ data: T[] | null; error: unknown }>,
): Promise<T[]> {
  try {
    const { data } = await query
    return data ?? []
  } catch {
    return []
  }
}

export async function getRecentBerita(limit = 3) {
  const supabase = await getClient()
  if (!supabase) return []
  return safeFetch<any>(
    supabase
      .from('berita')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit) as any,
  )
}

export async function getUpcomingKegiatan(limit = 3) {
  const supabase = await getClient()
  if (!supabase) return []
  return safeFetch<any>(
    supabase
      .from('kegiatan')
      .select('*')
      .in('status', ['Akan Datang', 'Berlangsung'])
      .order('tanggal_mulai', { ascending: true })
      .limit(limit) as any,
  )
}

export async function getAllKegiatan() {
  const supabase = await getClient()
  if (!supabase) return []
  return safeFetch<any>(
    supabase
      .from('kegiatan')
      .select('*')
      .order('tanggal_mulai', { ascending: false }) as any,
  )
}

export async function getPublishedBerita() {
  const supabase = await getClient()
  if (!supabase) return []
  return safeFetch<any>(
    supabase
      .from('berita')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false }) as any,
  )
}

export async function getBeritaBySlug(slug: string) {
  try {
    const supabase = await getClient()
    if (!supabase) return null
    const { data } = await supabase
      .from('berita')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
    return data ?? null
  } catch {
    return null
  }
}

export async function getAnggotaPublic() {
  const supabase = await getClient()
  if (!supabase) return []
  return safeFetch<any>(
    supabase
      .from('anggota')
      .select('*')
      .eq('status', 'Aktif')
      .order('nama', { ascending: true }) as any,
  )
}

export async function getMediaByType(tipe: 'galeri' | 'dokumen') {
  const supabase = await getClient()
  if (!supabase) return []
  return safeFetch<any>(
    supabase
      .from('media')
      .select('*')
      .eq('tipe', tipe)
      .order('created_at', { ascending: false }) as any,
  )
}

/**
 * @param hanyaUmum bila true, hanya jenis latihan umum yang ditampilkan.
 * Dipakai halaman publik/beranda agar program khusus tidak pernah tampil.
 */
export async function getProgramLatihanUmum(hanyaUmum = false) {
  const supabase = await getClient()
  if (!supabase) return []
  let query = supabase
    .from('program_latihan')
    .select('*')
    .eq('status', 'Aktif')
    .order('tanggal_mulai', { ascending: true }) as any
  if (hanyaUmum) query = query.in('jenis', JENIS_UMUM_PUBLIK)
  return safeFetch<any>(query)
}

// RLS pada program_khusus otomatis membatasi hasil: admin/pengurus melihat semua,
// anggota hanya program yang ditujukan kepadanya (atau kirim_ke_semua).
export async function getProgramKhusus() {
  const supabase = await getClient()
  if (!supabase) return []
  return safeFetch<any>(
    supabase
      .from('program_khusus')
      .select('*')
      .order('tanggal_mulai', { ascending: true }) as any,
  )
}

export async function getPenerimaSaya(profilId: string) {
  const supabase = await getClient()
  if (!supabase) return []
  return safeFetch<any>(
    supabase
      .from('program_khusus_penerima')
      .select('id, program_id, profil_id, dibaca_at, created_at')
      .eq('profil_id', profilId) as any,
  )
}

export async function getCalonPenerima() {
  const supabase = await getClient()
  if (!supabase) return []
  return safeFetch<any>(
    supabase
      .from('profiles')
      .select('id, full_name, email, role, jabatan')
      .order('full_name', { ascending: true }) as any,
  )
}

export async function getBerandaKonten() {
  const supabase = await getClient()
  if (!supabase) return []
  return safeFetch<any>(
    supabase
      .from('beranda_konten')
      .select('*')
      .eq('status', 'Aktif')
      .order('urutan', { ascending: true }) as any,
  )
}

export async function getSanggarFokus() {
  const supabase = await getClient()
  if (!supabase) return []
  return safeFetch<any>(
    supabase
      .from('sanggar_fokus')
      .select('*')
      .eq('status', 'Aktif')
      .order('urutan', { ascending: true }) as any,
  )
}

export async function getSanggarPenampilan(limit = 6) {
  const supabase = await getClient()
  if (!supabase) return []
  return safeFetch<any>(
    supabase
      .from('sanggar_penampilan')
      .select('*')
      .eq('status', 'Aktif')
      .order('tanggal_mulai', { ascending: true })
      .limit(limit) as any,
  )
}

export async function getPrestasi(limit = 12) {
  const supabase = await getClient()
  if (!supabase) return []
  return safeFetch<any>(
    supabase
      .from('prestasi')
      .select('*')
      .eq('status', 'Aktif')
      .order('urutan', { ascending: true })
      .order('tanggal', { ascending: false })
      .limit(limit) as any,
  )
}

async function raportLengkap(
  supabase: SupabaseServerClient,
  headers: any[],
): Promise<RaportLengkap[]> {
  if (!headers.length) return []
  const ids = headers.map((item) => item.id)
  const [pengukuran, performa, prestasi, kepribadian] = await Promise.all([
    safeFetch<any>(supabase.from('raport_pengukuran').select('*').in('raport_id', ids) as any),
    safeFetch<any>(supabase.from('raport_performa').select('*').in('raport_id', ids) as any),
    safeFetch<any>(supabase.from('raport_prestasi').select('*').in('raport_id', ids) as any),
    safeFetch<any>(supabase.from('raport_kepribadian').select('*').in('raport_id', ids) as any),
  ])

  return headers.map((header) => ({
    ...header,
    pengukuran: pengukuran.filter((item) => item.raport_id === header.id),
    performa: performa
      .filter((item) => item.raport_id === header.id)
      .sort((a, b) => Number(a.urutan ?? 0) - Number(b.urutan ?? 0)),
    prestasi: prestasi
      .filter((item) => item.raport_id === header.id)
      .sort((a, b) => Number(a.urutan ?? 0) - Number(b.urutan ?? 0)),
    kepribadian: kepribadian
      .filter((item) => item.raport_id === header.id)
      .sort((a, b) => Number(a.urutan ?? 0) - Number(b.urutan ?? 0)),
  })) as RaportLengkap[]
}

// RLS membatasi hasil: anggota hanya melihat raportnya sendiri yang Terbit/Arsip.
export async function getRaportSaya(profilId: string): Promise<RaportLengkap[]> {
  const supabase = await getClient()
  if (!supabase) return []
  const headers = await safeFetch<any>(
    supabase
      .from('raport_atlet')
      .select('*')
      .eq('profil_id', profilId)
      .neq('status', 'Draft')
      .order('tanggal', { ascending: false }) as any,
  )
  return raportLengkap(supabase, headers)
}

export async function getRaportDetail(id: string): Promise<RaportLengkap | null> {
  const supabase = await getClient()
  if (!supabase) return null
  try {
    const { data } = await supabase
      .from('raport_atlet')
      .select('*')
      .eq('id', id)
      .single()
    if (!data) return null
    const [detail] = await raportLengkap(supabase, [data])
    return detail ?? null
  } catch {
    return null
  }
}

export async function getDashboardStats() {
  const supabase = await getClient()
  if (!supabase) {
    return {
      anggota: 0,
      kegiatan: 0,
      berita: 0,
      media: 0,
      iuran: 0,
      program_latihan: 0,
      program_khusus: 0,
      prestasi: 0,
      sanggar_fokus: 0,
      sanggar_penampilan: 0,
      raport_atlet: 0,
    }
  }

  const tables = [
    'anggota',
    'kegiatan',
    'berita',
    'media',
    'iuran',
    'program_latihan',
    'program_khusus',
    'prestasi',
    'sanggar_fokus',
    'sanggar_penampilan',
    'raport_atlet',
  ]
  const counts = await Promise.all(
    tables.map((table) =>
      supabase.from(table).select('*', { count: 'exact', head: true }),
    ),
  )
  const result: Record<string, number> = {}
  tables.forEach((table, index) => {
    result[table] = counts[index].count ?? 0
  })
  return result
}
