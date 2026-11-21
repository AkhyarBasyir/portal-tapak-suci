import { redirect } from 'next/navigation'
import { getSessionProfile } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import GantiPasswordForm, { type PilihanPengguna } from '@/components/admin/ganti-password-form'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Ganti Password | Tapak Suci',
}

export default async function GantiPasswordPage() {
  const session = await getSessionProfile()
  if (!session) redirect('/login')

  const isAdmin = session.profile.role === 'admin'
  let users: PilihanPengguna[] = []

  if (isAdmin) {
    const supabase = await createClient()
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, email, role')
      .order('full_name')
    users = (data ?? []).map((item: any) => ({
      id: String(item.id),
      label: `${item.full_name ?? 'Tanpa nama'} (${item.role ?? 'anggota'})`,
      email: String(item.email ?? ''),
    }))
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Keamanan Akun</h1>
      <p className="mt-1 text-sm text-slate-500">
        Kelola password akun Anda dan, untuk admin, password akun lainnya.
      </p>
      <div className="mt-6">
        <GantiPasswordForm
          isAdmin={isAdmin}
          email={session.user.email ?? ''}
          users={users}
        />
      </div>
    </div>
  )
}
