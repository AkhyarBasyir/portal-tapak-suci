import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Palette, Ticket, type LucideIcon } from 'lucide-react'
import CrudManager from '@/components/crud/crud-manager'
import { canManage, getSessionProfile } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Halaman Sanggar | Tapak Suci',
  description: 'Kelola fokus dan penampilan Sanggar Surya Manggala Integra dalam satu halaman.',
}

interface SanggarTab {
  key: string
  label: string
  configKey: string
  icon: LucideIcon
  description: string
}

const TABS: SanggarTab[] = [
  {
    key: 'fokus',
    label: 'Fokus Sanggar',
    configKey: 'sanggar_fokus',
    icon: Palette,
    description: 'Kelola fokus dan program Sanggar Seni Budaya Surya Manggala Integra.',
  },
  {
    key: 'penampilan',
    label: 'Penampilan Sanggar',
    configKey: 'sanggar_penampilan',
    icon: Ticket,
    description: 'Atur jadwal sendratari, pentas, tradisi pencak silat, dan sosiodrama.',
  },
]

export default async function HalamanSanggarPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string | string[] | undefined }>
}) {
  const session = await getSessionProfile()
  if (!session) redirect('/login?next=%2Fdashboard%2Fhalaman_sanggar')
  if (!canManage(session.profile.role, 'pengurus')) redirect('/dashboard')

  const params = await searchParams
  const rawTab = Array.isArray(params.tab) ? params.tab[0] : params.tab
  const active = TABS.find((item) => item.key === rawTab) ?? TABS[0]

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-brand-100 bg-gradient-to-r from-brand-900 via-brand-700 to-[#3b0f0a] px-6 py-7 text-white sm:px-8">
        <div className="nusantara-motif absolute inset-0 opacity-80" />
        <div className="pointer-events-none absolute -right-10 -top-20 h-56 w-56 rounded-full bg-amber-400/25 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl">
              <Palette size={22} />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300">
                Sanggar Surya Manggala Integra
              </p>
              <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
                Halaman Sanggar
              </h1>
              <p className="mt-1 text-sm text-brand-100">
                Satu halaman untuk fokus dan penampilan sanggar.
              </p>
            </div>
          </div>
          <Link
            href="/sanggar"
            className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-xl hover:bg-white/20"
          >
            Lihat Halaman Sanggar
          </Link>
        </div>
      </div>

      <nav className="flex flex-wrap gap-2" aria-label="Bagian halaman sanggar">
        {TABS.map((item) => {
          const Icon = item.icon
          const isActive = item.key === active.key
          return (
            <Link
              key={item.key}
              href={`/dashboard/halaman_sanggar?tab=${item.key}`}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? 'border-brand-600 bg-brand-600 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700'
              }`}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{active.label}</h2>
          <p className="mt-1 text-sm text-slate-500">{active.description}</p>
        </div>
        <CrudManager key={active.configKey} configKey={active.configKey} role={session.profile.role} />
      </section>
    </div>
  )
}
