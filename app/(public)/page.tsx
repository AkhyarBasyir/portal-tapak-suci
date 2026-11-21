import Link from 'next/link'
import {
  ArrowRight,
  CalendarDays,
  Mail,
  MapPin,
  Newspaper,
  Phone,
  ShieldCheck,
  User,
  UserCog,
  Users,
} from 'lucide-react'
import { getRecentBerita, getUpcomingKegiatan, getDashboardStats } from '@/lib/data'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const loginRoles = [
  {
    role: 'admin',
    label: 'Admin',
    icon: ShieldCheck,
    description: 'Kelola seluruh data organisasi dan hak akses pengguna.',
  },
  {
    role: 'pengurus',
    label: 'Pengurus',
    icon: UserCog,
    description: 'Kelola anggota, kegiatan, berita, dokumen, dan keuangan.',
  },
  {
    role: 'anggota',
    label: 'Anggota',
    icon: User,
    description: 'Lihat informasi organisasi dan profil keanggotaan.',
  },
]

export default async function HomePage() {
  const [berita, kegiatan, stats] = await Promise.all([
    getRecentBerita(3),
    getUpcomingKegiatan(3),
    getDashboardStats(),
  ])

  return (
    <>
      <section className="bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 text-white">
        <div className="container-page grid gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              Portal Informasi Awal · Tapak Suci
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">
              Sistem Informasi Pencak Silat Tapak Suci
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85">
              Portal resmi untuk berita, jadwal latihan, profil anggota, galeri, dan
              dokumen organisasi. Data tersimpan di cloud dan dapat diakses dari mana
              saja, kapan saja.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#login" className="btn bg-white text-brand-700 hover:bg-slate-100">
                Pilihan Login
                <ArrowRight size={16} />
              </a>
              <Link href="/berita" className="btn border border-white/40 text-white hover:bg-white/10">
                Lihat Berita
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 self-center">
            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
              <Users className="text-white/70" />
              <p className="mt-4 text-3xl font-bold">{stats.anggota ?? 0}</p>
              <p className="text-xs text-white/70">Anggota</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
              <CalendarDays className="text-white/70" />
              <p className="mt-4 text-3xl font-bold">{stats.kegiatan ?? 0}</p>
              <p className="text-xs text-white/70">Kegiatan</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
              <Newspaper className="text-white/70" />
              <p className="mt-4 text-3xl font-bold">{stats.berita ?? 0}</p>
              <p className="text-xs text-white/70">Berita</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-14" id="tentang">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
              Tentang Tapak Suci
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">Tapak Suci Putera Muhammadiyah</h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              Tapak Suci adalah aliran, perguruan, dan organisasi pencak silat yang merupakan
              anggota Ikatan Pencak Silat Indonesia (IPSI) serta termasuk salah satu perguruan
              historis yang ikut menopang tumbuhnya IPSI. Tapak Suci berasas Islam, bersumber
              pada Al-Qur&apos;an dan As-Sunnah, berjiwa persaudaraan, dan berada di bawah naungan
              Persyarikatan Muhammadiyah sebagai organisasi otonom ke-11.
            </p>
            <blockquote className="mt-6 rounded-xl border-l-4 border-brand-500 bg-brand-50 p-4 text-sm italic text-brand-900">
              “Dengan Iman dan Akhlak saya menjadi kuat, tanpa Iman dan akhlak saya menjadi lemah.”
            </blockquote>
          </div>
          <div className="card p-6">
            <p className="font-semibold text-slate-900">Informasi Kontak Resmi</p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-brand-600" />
                Jl. Menteri Supeno No. 52, Umbulharjo, Yogyakarta
              </p>
              <p className="flex items-center gap-3">
                <Mail size={18} className="shrink-0 text-brand-600" />
                <a href="mailto:pimpinanpusattapaksuci@gmail.com" className="hover:text-brand-700 hover:underline">
                  pimpinanpusattapaksuci@gmail.com
                </a>
              </p>
              <p className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-brand-600" />
                <a href="tel:+6281529051101" className="hover:text-brand-700 hover:underline">
                  +62 815 2905 1101
                </a>
              </p>
            </div>
            <p className="mt-5 text-xs text-slate-500">
              Sumber: situs resmi Tapak Suci. Hubungi cabang terdekat untuk pendaftaran anggota.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-14" id="login">
        <div className="container-page">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Akses Sistem</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">Pilihan Login</h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">
              Pilih peran sesuai akun Anda untuk masuk ke sistem. Peran akun ditetapkan oleh
              admin/pengurus, bukan oleh pilihan pada halaman ini.
            </p>
          </div>

          <div className="mx-auto mt-8 grid max-w-5xl gap-4 md:grid-cols-3">
            {loginRoles.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.role}
                  href={`/login?role=${item.role}`}
                  className="card group p-6 text-center transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-md"
                >
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-700 group-hover:bg-brand-600 group-hover:text-white">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-900">Masuk sebagai {item.label}</h3>
                  <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                  <p className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
                    Lanjut login <ArrowRight size={15} />
                  </p>
                </Link>
              )
            })}
          </div>

          <p className="mt-6 text-center text-sm text-slate-600">
            Belum punya akun?{' '}
            <Link href="/register" className="font-semibold text-brand-700 hover:underline">
              Daftar sebagai anggota
            </Link>
          </p>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
              Informasi Terbaru
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">Berita & Pengumuman</h2>
          </div>
          <Link href="/berita" className="text-sm font-semibold text-brand-700 hover:underline">
            Semua berita →
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {berita.length === 0 && (
            <p className="text-sm text-slate-500">Belum ada berita diterbitkan.</p>
          )}
          {berita.map((item) => (
            <Link key={item.id} href={`/berita/${item.slug}`} className="card overflow-hidden hover:shadow-md">
              {item.gambar_url ? (
                <img src={item.gambar_url} alt={item.judul} className="h-40 w-full object-cover" />
              ) : (
                <div className="h-40 w-full bg-gradient-to-br from-brand-100 to-brand-500" />
              )}
              <div className="p-5">
                <p className="text-xs text-slate-500">{formatDate(item.published_at)} · {item.penulis || 'Pengurus'}</p>
                <h3 className="mt-2 line-clamp-2 font-bold text-slate-900">{item.judul}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">{item.ringkasan}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-14">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Agenda</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">Kegiatan Mendatang</h2>
            <div className="mt-6 space-y-3">
              {kegiatan.length === 0 && (
                <p className="text-sm text-slate-500">Belum ada jadwal kegiatan.</p>
              )}
              {kegiatan.map((item) => (
                <div key={item.id} className="card flex items-center gap-4 p-4">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-brand-50 text-center text-brand-700">
                    <span className="text-xs font-semibold">{formatDate(item.tanggal_mulai)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{item.judul}</p>
                    <p className="text-sm text-slate-500">{item.lokasi || '-'} · {item.jenis}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/kegiatan" className="mt-5 inline-block text-sm font-semibold text-brand-700 hover:underline">
              Lihat semua kegiatan →
            </Link>
          </div>
          <div className="rounded-3xl bg-slate-900 p-8 text-white">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-400">Nilai Organisasi</p>
            <h2 className="mt-1 text-2xl font-bold">Iman, Akhlak, dan Persaudaraan</h2>
            <p className="mt-4 leading-relaxed text-slate-300">
              Pembinaan anggota dilakukan melalui latihan pencak silat yang menanamkan
              kedisiplinan, keberanian, serta akhlak mulia sesuai dengan nilai-nilai yang
              dijunjung tinggi organisasi.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-white/5 p-4">
                <p className="font-semibold">Visi</p>
                <p className="mt-1 text-sm text-slate-300">
                  Menjadi perguruan pencak silat yang unggul, berakhlak, dan bermanfaat bagi masyarakat.
                </p>
              </div>
              <div className="rounded-xl bg-white/5 p-4">
                <p className="font-semibold">Misi</p>
                <p className="mt-1 text-sm text-slate-300">
                  Membina anggota, melestarikan budaya pencak silat, dan menyebarkan manfaat.
                </p>
              </div>
            </div>
            <Link
              href="/program-latihan"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Lihat Program Latihan →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
