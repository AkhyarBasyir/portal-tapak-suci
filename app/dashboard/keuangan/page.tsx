import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Receipt, Wallet, type LucideIcon } from 'lucide-react'
import CrudManager from '@/components/crud/crud-manager'
import { canManage, getSessionProfile } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Keuangan | Tapak Suci',
  description: 'Kelola transaksi kas dan iuran anggota dalam satu halaman.',
}

interface KeuanganTab {
  key: string
  label: string
  configKey: string
  icon: LucideIcon
  description: string
}

const TABS: KeuanganTab[] = [
  {
    key: 'utama',
    label: 'Transaksi Kas',
    configKey: 'keuangan',
    icon: Wallet,
    description: 'Catat pemasukan dan pengeluaran organisasi beserta bukti transaksinya.',
  },
  {
    key: 'iuran',
    label: 'Iuran Anggota',
    configKey: 'iuran',
    icon: Receipt,
    description: 'Pantau pembayaran iuran anggota per periode.',
  },
]

export default async function KeuanganPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string | string[] | undefined }>
}) {
  const session = await getSessionProfile()
  if (!session) redirect('/login?next=%2Fdashboard%2Fkeuangan')
  if (!canManage(session.profile.role, 'pengurus')) redirect('/dashboard')

  const params = await searchParams
  const rawTab = Array.isArray(params.tab) ? params.tab[0] : params.tab
  const active = TABS.find((item) => item.key === rawTab) ?? TABS[0]

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-brand-100 bg-gradient-to-r from-brand-900 via-brand-700 to-[#3b0f0a] px-6 py-7 text-white sm:px-8">
        <div className="nusantara-motif absolute inset-0 opacity-80" />
        <div className="pointer-events-none absolute -right-10 -top-20 h-56 w-56 rounded-full bg-amber-400/25 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl">
            <Wallet size={22} />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300">
              Keuangan Organisasi
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Keuangan
            </h1>
            <p className="mt-1 text-sm text-brand-100">
              Satu halaman untuk transaksi kas dan iuran anggota.
            </p>
          </div>
        </div>
      </div>

      <nav className="flex flex-wrap gap-2" aria-label="Bagian keuangan">
        {TABS.map((item) => {
          const Icon = item.icon
          const isActive = item.key === active.key
          return (
            <Link
              key={item.key}
              href={`/dashboard/keuangan?tab=${item.key}`}
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
