import { redirect } from 'next/navigation'
import ProgramAdmin from '@/components/program-latihan/program-admin'
import { canManage, getSessionProfile } from '@/lib/auth'
import {
  getCalonPenerima,
  getProgramKhusus,
  getProgramLatihanUmum,
} from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function KelolaProgramLatihanPage() {
  const session = await getSessionProfile()
  if (!session) redirect('/login?next=/dashboard/program-latihan')
  if (!canManage(session.profile.role, 'pengurus')) redirect('/dashboard')

  const [umum, khusus, calonPenerima] = await Promise.all([
    getProgramLatihanUmum(),
    getProgramKhusus(),
    getCalonPenerima(),
  ])

  return (
    <ProgramAdmin
      umum={umum}
      khusus={khusus}
      calonPenerima={calonPenerima}
      role={session.profile.role}
      currentUserId={session.profile.id}
    />
  )
}
