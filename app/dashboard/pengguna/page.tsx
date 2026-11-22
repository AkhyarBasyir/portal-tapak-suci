import { redirect } from 'next/navigation'
import { getSessionProfile } from '@/lib/auth'
import UserManager from '@/components/admin/user-manager'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Pengguna | Tapak Suci',
}

export default async function PenggunaPage() {
  const session = await getSessionProfile()
  if (!session) redirect('/login')
  if (session.profile.role !== 'admin') redirect('/dashboard')

  return <UserManager />
}
