import { redirect } from 'next/navigation'
import { FileText, Sparkles } from 'lucide-react'
import RaportView from '@/components/raport/raport-view'
import { getSessionProfile } from '@/lib/auth'
import { getRaportSaya } from '@/lib/data'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Raport Saya | Tapak Suci',
  description: 'Raport perkembangan atlet: pengukuran fisik, performa, prestasi, dan kepribadian.',
}

export default async function RaportSayaPage() {
  const session = await getSessionProfile()
  if (!session) redirect('/login?next=/dashboard/raport-saya')

  const raport = await getRaportSaya(session.profile.id)

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-brand-100 bg-gradient-to-r from-brand-900 via-brand-700 to-[#3b0f0a] px-6 py-7 text-white sm:px-8">
        <div className="nusantara-motif absolute inset-0 opacity-80" />
        <div className="pointer-events-none absolute -right-10 -top-20 h-56 w-56 rounded-full bg-amber-400/25 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl">
              <FileText size={22} />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300">
                Portal Atlet
              </p>
              <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
                Raport Perkembangan Saya
              </h1>
              <p className="mt-1 text-sm text-brand-100">
                Evaluasi menyeluruh hasil pembinaan dan prestasi latihan.
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold backdrop-blur-xl sm:flex">
            <Sparkles size={14} className="text-amber-300" />
            {session.profile.full_name}
          </div>
        </div>
      </div>

      <RaportView raport={raport} nama={session.profile.full_name} />
    </div>
  )
}
