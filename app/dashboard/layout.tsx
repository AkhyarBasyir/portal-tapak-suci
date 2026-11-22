import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  Activity,
  CalendarDays,
  Dumbbell,
  FileBarChart2,
  FileText,
  Gauge,
  HeartHandshake,
  Images,
  KeyRound,
  LayoutDashboard,
  LayoutTemplate,
  Medal,
  Newspaper,
  Palette,
  Receipt,
  Shield,
  Ticket,
  Trophy,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import { getSessionProfile } from '@/lib/auth'
import LogoutButton from '@/components/logout-button'
import type { Role } from '@/lib/types'

export const dynamic = 'force-dynamic'

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
  minRole?: 'admin' | 'pengurus'
  roles?: Role[]
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Ringkasan', icon: LayoutDashboard },
  { href: '/dashboard/ganti-password', label: 'Ganti Password', icon: KeyRound, roles: ['anggota', 'pengurus'] },
  { href: '/dashboard/raport-saya', label: 'Raport Saya', icon: FileText },
  { href: '/dashboard/raport_atlet', label: 'Raport Atlet', icon: FileBarChart2, minRole: 'pengurus' },
  { href: '/dashboard/raport_pengukuran', label: 'Pengukuran Fisik', icon: Activity, minRole: 'pengurus' },
  { href: '/dashboard/raport_performa', label: 'Performa Atlet', icon: Gauge, minRole: 'pengurus' },
  { href: '/dashboard/raport_prestasi', label: 'Prestasi Atlet', icon: Medal, minRole: 'pengurus' },
  { href: '/dashboard/raport_kepribadian', label: 'Kepribadian', icon: HeartHandshake, minRole: 'pengurus' },
  { href: '/dashboard/anggota', label: 'Anggota', icon: Users, minRole: 'pengurus' },
  { href: '/dashboard/kegiatan', label: 'Kegiatan', icon: CalendarDays, minRole: 'pengurus' },
  { href: '/dashboard/program-latihan', label: 'Program Latihan', icon: Dumbbell, minRole: 'pengurus' },
  { href: '/dashboard/berita', label: 'Berita', icon: Newspaper, minRole: 'pengurus' },
  { href: '/dashboard/beranda_konten', label: 'Konten Beranda', icon: LayoutTemplate, minRole: 'pengurus' },
  { href: '/dashboard/prestasi', label: 'Prestasi', icon: Trophy, minRole: 'pengurus' },
  { href: '/dashboard/sanggar_fokus', label: 'Fokus Sanggar', icon: Palette, minRole: 'pengurus' },
  { href: '/dashboard/sanggar_penampilan', label: 'Penampilan Sanggar', icon: Ticket, minRole: 'pengurus' },
  { href: '/dashboard/media', label: 'Dokumen & Galeri', icon: Images, minRole: 'pengurus' },
  { href: '/dashboard/keuangan', label: 'Keuangan', icon: Wallet, minRole: 'pengurus' },
  { href: '/dashboard/iuran', label: 'Iuran', icon: Receipt, minRole: 'pengurus' },
  { href: '/dashboard/pengguna', label: 'Pengguna', icon: Shield, minRole: 'admin' },
]

function visibleItems(role: Role) {
  return navItems.filter((item) => {
    if (item.roles && !item.roles.includes(role)) return false
    if (!item.minRole) return true
    if (item.minRole === 'admin') return role === 'admin'
    return role === 'admin' || role === 'pengurus'
  })
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSessionProfile()
  if (!session) redirect('/login')

  const items = visibleItems(session.profile.role)

  return (
    <div className="min-h-screen lg:flex">
      <aside className="w-full shrink-0 border-b border-slate-200 bg-white p-4 lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
        <Link href="/" className="flex items-center gap-2 font-bold text-brand-700">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-600 text-sm text-white">TS</span>
          Portal Tapak Suci
        </Link>

        <nav className="mt-6 grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-brand-50 hover:text-brand-700"
              >
                <Icon size={17} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-8 hidden border-t border-slate-100 pt-4 lg:block">
          <p className="truncate text-sm font-semibold text-slate-800">{session.profile.full_name}</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-brand-600">{session.profile.role}</p>
          <div className="mt-3">
            <LogoutButton />
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">Dashboard</p>
            <p className="text-xs text-slate-500">Masuk sebagai {session.profile.role}</p>
          </div>
          <div className="lg:hidden">
            <LogoutButton />
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
