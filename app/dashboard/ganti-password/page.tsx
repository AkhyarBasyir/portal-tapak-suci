import { redirect } from 'next/navigation'
import { getSessionProfile } from '@/lib/auth'
import GantiPasswordForm from '@/components/admin/ganti-password-form'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Ganti Password | Tapak Suci',
}

export default async function GantiPasswordPage() {
  const session = await getSessionProfile()
  if (!session) redirect('/login')

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Keamanan Akun</h1>
      <p className="mt-1 text-sm text-slate-500">
        Kelola password akun Anda sendiri.
      </p>
      <div className="mt-6">
        <GantiPasswordForm email={session.user.email ?? ''} />
      </div>
    </div>
  )
}
