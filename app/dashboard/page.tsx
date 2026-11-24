import Link from 'next/link'
import {
  ArrowRight,
  CalendarDays,
  Dumbbell,
  FileText,
  Newspaper,
  Ticket,
  Trophy,
  Users,
  Wallet,
} from 'lucide-react'
import { getSessionProfile } from '@/lib/auth'
import {
  getAnggotaSaya,
  getDashboardStats,
  getIuranSaya,
  getPenerimaSaya,
  getProgramKhusus,
  getProgramLatihanUmum,
} from '@/lib/data'
import { formatCurrency } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [session, stats] = await Promise.all([
    getSessionProfile(),
    getDashboardStats(),
  ])

  const role = session?.profile.role ?? 'anggota'
  const isManager = role === 'admin' || role === 'pengurus'

  let programCount = 0
  let programBaru = 0
  let iuranBelumCount = 0
  let iuranBelumTotal = 0

  if (!isManager && session) {
    const [umum, khusus, penerima, anggota] = await Promise.all([
      getProgramLatihanUmum(true),
      getProgramKhusus(),
      getPenerimaSaya(session.profile.id),
      getAnggotaSaya(session.user.email ?? session.profile.email),
    ])
    programCount = umum.length + khusus.length
    programBaru = khusus.filter((item) =>
      penerima.some(
        (p: any) =>
          p.program_id === item.id && p.profil_id === session.profile.id && !p.dibaca_at,
      ),
    ).length

    if (anggota) {
      const iuran = await getIuranSaya(anggota.id)
      const belum = iuran.filter(
        (row) => String(row.status ?? '').toLowerCase() !== 'lunas',
      )
      iuranBelumCount = belum.length
      iuranBelumTotal = belum.reduce(
        (total, row) => total + Number(row.jumlah ?? 0),
        0,
      )
    }
  }

  const cards = [
    {
      label: 'Anggota',
      value: stats.anggota ?? 0,
      icon: Users,
      href: '/dashboard/pengguna?tab=anggota',
    },
    { label: 'Kegiatan', value: stats.kegiatan ?? 0, icon: CalendarDays, href: '/dashboard/beranda_konten?tab=kegiatan' },
    {
      label: 'Program Latihan',
      value: stats.program_latihan ?? 0,
      icon: Dumbbell,
      href: '/dashboard/program-latihan',
    },
    { label: 'Berita', value: stats.berita ?? 0, icon: Newspaper, href: '/dashboard/beranda_konten?tab=berita' },
    { label: 'Dokumen & Galeri', value: stats.media ?? 0, icon: FileText, href: '/dashboard/beranda_konten?tab=media' },
    { label: 'Iuran', value: stats.iuran ?? 0, icon: Wallet, href: '/dashboard/keuangan?tab=iuran' },
    { label: 'Prestasi', value: stats.prestasi ?? 0, icon: Trophy, href: '/dashboard/beranda_konten?tab=prestasi' },
    {
      label: 'Penampilan Sanggar',
      value: stats.sanggar_penampilan ?? 0,
      icon: Ticket,
      href: '/dashboard/halaman_sanggar?tab=penampilan',
    },
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
            Di sini Anda bisa melihat program latihan yang dibagikan admin dan tagihan iuran
            Anda sendiri tanpa keluar dari dashboard.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Link
              href="/dashboard/program-saya"
              className="card p-5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-600">Program Latihan Saya</p>
                <Dumbbell size={18} className="text-brand-600" />
              </div>
              <p className="mt-3 text-3xl font-bold text-slate-900">{programCount}</p>
              <p className="mt-2 text-xs font-semibold text-brand-700">
                {programBaru > 0
                  ? `${programBaru} program khusus baru untuk Anda`
                  : 'Lihat jadwal dan program khusus Anda'}{' '}
                <ArrowRight size={14} className="inline" />
              </p>
            </Link>

            <Link
              href="/dashboard/iuran-saya"
              className="card p-5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-600">Iuran Saya</p>
                <Wallet size={18} className="text-amber-600" />
              </div>
              <p className="mt-3 text-3xl font-bold text-slate-900">{iuranBelumCount}</p>
              <p className="mt-1 text-xs text-slate-500">
                {iuranBelumCount > 0
                  ? `Total tagihan ${formatCurrency(iuranBelumTotal)}`
                  : 'Tidak ada tagihan terbuka'}
              </p>
              <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-700">
                Lihat rincian iuran <ArrowRight size={14} />
              </p>
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
            <Link href="/berita" className="btn-outline">Lihat Berita</Link>
            <Link href="/kegiatan" className="btn-outline">Lihat Kegiatan</Link>
            <Link href="/galeri" className="btn-outline">Lihat Galeri</Link>
          </div>
        </div>
      )}
    </div>
  )
}
