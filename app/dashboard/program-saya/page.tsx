import { redirect } from 'next/navigation'
import { Dumbbell } from 'lucide-react'
import ProgramLatihanView from '@/components/program-latihan/program-view'
import { getSessionProfile } from '@/lib/auth'
import {
  getPenerimaSaya,
  getProgramKhusus,
  getProgramLatihanUmum,
} from '@/lib/data'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Program Latihan Saya | Tapak Suci',
  description:
    'Lihat program latihan yang dibagikan admin dan program khusus yang ditujukan kepada akun Anda.',
}

export default async function ProgramSayaPage() {
  const session = await getSessionProfile()
  if (!session) redirect('/login?next=%2Fdashboard%2Fprogram-saya')
  if (session.profile.role !== 'anggota') redirect('/dashboard')

  const [umum, khusus, penerima] = await Promise.all([
    getProgramLatihanUmum(true),
    getProgramKhusus(),
    getPenerimaSaya(session.profile.id),
  ])

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-brand-100 bg-gradient-to-r from-brand-900 via-brand-700 to-[#3b0f0a] px-6 py-7 text-white sm:px-8">
        <div className="nusantara-motif absolute inset-0 opacity-80" />
        <div className="pointer-events-none absolute -right-10 -top-20 h-56 w-56 rounded-full bg-amber-400/25 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl">
            <Dumbbell size={22} />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300">
              Pembinaan Anggota
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Program Latihan Saya
            </h1>
            <p className="mt-1 text-sm text-brand-100">
              Jadwal latihan umum dan program khusus yang dibagikan admin untuk akun Anda.
            </p>
          </div>
        </div>
      </div>

      <ProgramLatihanView
        umum={umum}
        khusus={khusus}
        penerima={penerima}
        profile={{
          id: session.profile.id,
          full_name: session.profile.full_name,
          role: session.profile.role,
        }}
        mode="dashboard"
      />
    </div>
  )
}
