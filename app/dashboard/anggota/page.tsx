import { redirect } from 'next/navigation'
import CrudManager from '@/components/crud/crud-manager'
import { getSessionProfile } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Data Anggota | Tapak Suci',
}

export default async function AnggotaPage() {
  const session = await getSessionProfile()
  if (!session) redirect('/login?next=%2Fdashboard%2Fanggota')

  if (session.profile.role === 'admin') {
    redirect('/dashboard/pengguna?tab=anggota')
  }

  if (session.profile.role !== 'pengurus') {
    redirect('/dashboard')
  }

  return <CrudManager configKey="anggota" role={session.profile.role} />
}
