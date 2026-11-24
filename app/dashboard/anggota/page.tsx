import { redirect } from 'next/navigation'
import { getSessionProfile } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Data Anggota | Tapak Suci',
}

export default async function AnggotaPage() {
  const session = await getSessionProfile()
  if (!session) redirect('/login?next=%2Fdashboard%2Fanggota')

  if (session.profile.role === 'admin' || session.profile.role === 'pengurus') {
    redirect('/dashboard/pengguna?tab=anggota')
  }

  redirect('/dashboard')
}
