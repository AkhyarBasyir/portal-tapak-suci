/**
 * Catat detail error di server, kirim pesan aman ke klien.
 * Mencegah constraint/table Supabase bocor ke browser.
 */
export function safeError(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    console.error('[api]', error.message)
  } else {
    console.error('[api]', error)
  }
  return fallback
}
