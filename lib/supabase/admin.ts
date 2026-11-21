import { createClient } from '@supabase/supabase-js'

/**
 * Klien Supabase dengan hak admin. Hanya dipakai di Route Handler/server,
 * NEVER dikirim ke browser. Membutuhkan SUPABASE_SERVICE_ROLE_KEY.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY belum diisi. Tambahkan ke .env.local dan Vercel Environment Variables.',
    )
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
