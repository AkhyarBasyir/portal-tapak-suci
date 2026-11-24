import { redirect } from 'next/navigation'
import { canManage, getSessionProfile } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function ProgramLatihanPage() {
  const session = await getSessionProfile()
  if (!session) redirect('/login?next=%2Fdashboard')

  const tujuan = canManage(session.profile.role, 'pengurus')
    ? '/dashboard/program-latihan'
    : '/dashboard/program-saya'

  redirect(tujuan)
}
