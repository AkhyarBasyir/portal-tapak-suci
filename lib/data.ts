import { createClient } from '@/lib/supabase/server'

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

export async function getDashboardStats() {
  const supabase = await getClient()
  if (!supabase) {
    return { anggota: 0, kegiatan: 0, berita: 0, media: 0, iuran: 0 }
  }

  const tables = ['anggota', 'kegiatan', 'berita', 'media', 'iuran']
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
