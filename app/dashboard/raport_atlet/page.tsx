import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  Activity,
  FileBarChart2,
  FileText,
  Gauge,
  HeartHandshake,
  Medal,
  type LucideIcon,
} from 'lucide-react'
import CrudManager from '@/components/crud/crud-manager'
import RaportView from '@/components/raport/raport-view'
import { canManage, getSessionProfile } from '@/lib/auth'
import { getRaportSaya } from '@/lib/data'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Raport Atlet | Tapak Suci',
  description:
    'Lihat raport sendiri dan kelola raport atlet: data raport, pengukuran fisik, performa, prestasi, dan kepribadian dalam satu halaman.',
}

interface RaportTab {
  key: string
  label: string
  configKey?: string
  icon: LucideIcon
  description: string
}

const TABS: RaportTab[] = [
  {
    key: 'saya',
    label: 'Raport Saya',
    configKey: undefined,
    icon: FileText,
    description: 'Lihat raport perkembangan Anda sendiri lengkap dengan grafik dan catatan pelatih.',
  },
  {
    key: 'utama',
    label: 'Data Raport',
    configKey: 'raport_atlet',
    icon: FileBarChart2,
    description: 'Buat periode raport, pilih atlet, dan tentukan status penerbitan.',
  },
  {
    key: 'pengukuran',
    label: 'Pengukuran Fisik',
    configKey: 'raport_pengukuran',
    icon: Activity,
    description: 'Catat tinggi, berat, lingkar tubuh, dan denyut nadi istirahat.',
  },
  {
    key: 'performa',
    label: 'Performa Atlet',
    configKey: 'raport_performa',
    icon: Gauge,
    description: 'Nilai power, kecepatan, VO2 max, teknik, strategi, dan mental.',
  },
  {
    key: 'prestasi',
    label: 'Prestasi Atlet',
    configKey: 'raport_prestasi',
    icon: Medal,
    description: 'Catat kejuaraan dan peringkat yang masuk ke dalam raport.',
  },
  {
    key: 'kepribadian',
    label: 'Kepribadian',
    configKey: 'raport_kepribadian',
    icon: HeartHandshake,
    description: 'Nilai disiplin, tanggung jawab, sportivitas, dan aspek karakter lainnya.',
  },
]

export default async function RaportAtletPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string | string[] | undefined }>
}) {
  const session = await getSessionProfile()
  if (!session) redirect('/login?next=%2Fdashboard%2Fraport_atlet')

  const bolehKelola = canManage(session.profile.role, 'pengurus')
  const params = await searchParams
  const rawTab = Array.isArray(params.tab) ? params.tab[0] : params.tab
  const tabs = TABS.filter((item) => item.key === 'saya' || bolehKelola)
  const fallback = bolehKelola ? 'utama' : 'saya'
  const activeKey = rawTab && tabs.some((item) => item.key === rawTab) ? rawTab : fallback
  const active = tabs.find((item) => item.key === activeKey) ?? tabs[0]

  if (!bolehKelola && active.key !== 'saya') {
    redirect('/dashboard/raport_atlet?tab=saya')
  }

  const raportSaya = active.key === 'saya' ? await getRaportSaya(session.profile.id) : []

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-brand-100 bg-gradient-to-r from-brand-900 via-brand-700 to-[#3b0f0a] px-6 py-7 text-white sm:px-8">
        <div className="nusantara-motif absolute inset-0 opacity-80" />
        <div className="pointer-events-none absolute -right-10 -top-20 h-56 w-56 rounded-full bg-amber-400/25 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl">
            <FileBarChart2 size={22} />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300">
              Pembinaan Atlet
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Raport Atlet
            </h1>
            <p className="mt-1 text-sm text-brand-100">
              Satu halaman untuk raport Anda dan pengelolaan raport atlet.
            </p>
          </div>
        </div>
      </div>

      <nav className="flex flex-wrap gap-2" aria-label="Bagian raport atlet">
        {tabs.map((item) => {
          const Icon = item.icon
          const isActive = item.key === active.key
          return (
            <Link
              key={item.key}
              href={`/dashboard/raport_atlet?tab=${item.key}`}
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
        {active.key === 'saya' ? (
          <RaportView raport={raportSaya} nama={session.profile.full_name} />
        ) : active.configKey ? (
          <CrudManager key={active.configKey} configKey={active.configKey} role={session.profile.role} />
        ) : null}
      </section>
    </div>
  )
}
