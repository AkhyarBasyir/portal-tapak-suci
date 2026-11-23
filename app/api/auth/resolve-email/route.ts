import { safeError } from '@/lib/api-error'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

/** Rate limit sederhana (best-effort) agar RPC tidak bisa dipakai brute-force. */
const percobaan = new Map<string, { jumlah: number; reset: number }>()
const BATAS = 10
const JENDELA_MS = 60_000

function izinkan(ip: string): boolean {
  const sekarang = Date.now()
  const entri = percobaan.get(ip)
  if (!entri || sekarang > entri.reset) {
    percobaan.set(ip, { jumlah: 1, reset: sekarang + JENDELA_MS })
    return true
  }
  if (entri.jumlah >= BATAS) return false
  entri.jumlah += 1
  return true
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!izinkan(ip)) {
    return Response.json({ error: 'Terlalu banyak percobaan. Coba lagi sebentar.' }, { status: 429 })
  }

  let body: Record<string, any>
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Data tidak valid.' }, { status: 400 })
  }

  const identifier = String(body.identifier ?? '').trim().slice(0, 200)
  if (!identifier) {
    return Response.json({ error: 'Identifier wajib diisi.' }, { status: 400 })
  }

  try {
    const admin = createAdminClient()
    const { data, error } = await admin.rpc('email_for_login', { identifier })

    if (error) {
      safeError(error, 'Resolver gagal.')
      return Response.json({ error: 'Akun tidak ditemukan.' }, { status: 404 })
    }
    if (!data || typeof data !== 'string') {
      return Response.json({ error: 'Akun tidak ditemukan.' }, { status: 404 })
    }
    return Response.json({ email: data })
  } catch (error) {
    safeError(error, 'Resolver gagal.')
    return Response.json({ error: 'Akun tidak ditemukan.' }, { status: 404 })
  }
}
