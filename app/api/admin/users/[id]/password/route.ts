import { safeError } from '@/lib/api-error'
import { getSessionProfile } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSessionProfile()
  if (!session) return Response.json({ error: 'Belum login.' }, { status: 401 })
  if (session.profile.role !== 'admin') {
    return Response.json({ error: 'Hanya admin yang bisa mengganti password pengguna.' }, { status: 403 })
  }

  const { id } = await params
  let body: Record<string, any>
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Data tidak valid.' }, { status: 400 })
  }

  const password = String(body.password ?? '')
  if (password.length < 6) {
    return Response.json({ error: 'Password minimal 6 karakter.' }, { status: 400 })
  }

  try {
    const admin = createAdminClient()

    const { data: target, error: cariError } = await admin.auth.admin.getUserById(id)
    if (cariError || !target.user) {
      return Response.json({ error: 'Pengguna tidak ditemukan.' }, { status: 404 })
    }

    const { error } = await admin.auth.admin.updateUserById(id, { password })
    if (error) {
      return Response.json({ error: safeError(error, 'Password gagal diperbarui.') }, { status: 400 })
    }
    return Response.json({ ok: true })
  } catch (error) {
    return Response.json(
      { error: safeError(error, 'Gagal mengganti password.') },
      { status: 500 },
    )
  }
}
