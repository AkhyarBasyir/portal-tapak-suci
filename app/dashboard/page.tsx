import Link from 'next/link'
import { ArrowRight, CalendarDays, Dumbbell, FileText, Newspaper, ShieldCheck, Users, Wallet } from 'lucide-react'
import { getSessionProfile } from '@/lib/auth'
import { getDashboardStats, getProgramKhusus } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [session, stats] = await Promise.all([
    getSessionProfile(),
    getDashboardStats(),
  ])

  const role = session?.profile.role ?? 'anggota'
  const isManager = role === 'admin' || role === 'pengurus'
  const programKhusus = !isManager ? await getProgramKhusus() : []

  const cards = [
    { label: 'Anggota', value: stats.anggota ?? 0, icon: Users, href: '/dashboard/anggota' },
    { label: 'Kegiatan', value: stats.kegiatan ?? 0, icon: CalendarDays, href: '/dashboard/kegiatan' },
    {
      label: 'Program Latihan',
      value: stats.program_latihan ?? 0,
      icon: Dumbbell,
      href: '/dashboard/program-latihan',
    },
    { label: 'Berita', value: stats.berita ?? 0, icon: Newspaper, href: '/dashboard/berita' },
    { label: 'Dokumen & Galeri', value: stats.media ?? 0, icon: FileText, href: '/dashboard/media' },
    { label: 'Iuran', value: stats.iuran ?? 0, icon: Wallet, href: '/dashboard/iuran' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Halo, {session?.profile.full_name || 'Anggota'}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Ringkasan data portal informasi Tapak Suci.
        </p>
      </div>

      {isManager ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon
            return (
              <Link key={card.label} href={card.href} className="card p-5 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-600">{card.label}</p>
                  <Icon size={18} className="text-brand-600" />
                </div>
                <p className="mt-3 text-3xl font-bold text-slate-900">{card.value}</p>
                <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-700">
                  Kelola data <ArrowRight size={14} />
                </p>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="card p-6">
          <p className="font-semibold text-slate-900">Selamat datang sebagai Anggota</p>
          <p className="mt-2 text-sm text-slate-600">
            Akun Anda dapat melihat informasi organisasi. Hubungi pengurus jika ingin
            mendapatkan hak akses pengelolaan data.
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-900">
            <ShieldCheck size={18} className="shrink-0 text-brand-600" />
            <span>
              <strong>{programKhusus.length}</strong> program khusus tersedia untuk akun Anda.
            </span>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/program-latihan" className="btn-primary">
              <Dumbbell size={16} /> Lihat Program Latihan
            </Link>
            <Link href="/berita" className="btn-outline">Lihat Berita</Link>
            <Link href="/kegiatan" className="btn-outline">Lihat Kegiatan</Link>
            <Link href="/galeri" className="btn-outline">Lihat Galeri</Link>
          </div>
        </div>
      )}
    </div>
  )
}
