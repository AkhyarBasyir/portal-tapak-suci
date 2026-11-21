import ProgramLatihanView from '@/components/program-latihan/program-view'
import { getSessionProfile } from '@/lib/auth'
import {
  getPenerimaSaya,
  getProgramKhusus,
  getProgramLatihanUmum,
} from '@/lib/data'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Program Latihan',
  description:
    'Jadwal, macam program, dan target latihan Tapak Suci serta program khusus untuk anggota.',
}

export default async function ProgramLatihanPage() {
  const [programUmum, programKhusus, session] = await Promise.all([
    getProgramLatihanUmum(true),
    getProgramKhusus(),
    getSessionProfile(),
  ])

  const penerima = session ? await getPenerimaSaya(session.profile.id) : []

  return (
    <ProgramLatihanView
      umum={programUmum}
      khusus={programKhusus}
      penerima={penerima}
      profile={
        session
          ? {
              id: session.profile.id,
              full_name: session.profile.full_name,
              role: session.profile.role,
            }
          : null
      }
    />
  )
}
