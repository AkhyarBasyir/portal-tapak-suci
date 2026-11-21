import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Clock,
  Heart,
  Mail,
  MapPin,
  Medal,
  Phone,
  Quote,
  ShieldCheck,
  Sparkles,
  Swords,
  Trophy,
  User,
  UserCog,
  Users,
  type LucideIcon,
} from 'lucide-react'
import {
  getBerandaKonten,
  getDashboardStats,
  getPrestasi,
  getRecentBerita,
  getSanggarFokus,
  getSanggarPenampilan,
  getUpcomingKegiatan,
  getProgramLatihanUmum,
} from '@/lib/data'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Portal Informasi Tapak Suci',
  description:
    'Portal resmi Tapak Suci Putera Muhammadiyah dan Sanggar Surya Manggala Integra: prestasi di gelanggang, seni pertunjukan pentas, jadwal latihan, dan berita organisasi.',
}

type Baris = Record<string, any>

const kontenDefault: Record<string, string> = {
  hero_kicker: 'TAPAK SUCI × SURYA MANGGALA INTEGRA',
  hero_judul: 'Bela diri berprestasi. Seni yang berakhlak.',
  hero_deskripsi:
    'Dua semangat dalam satu wadah: prestasi di gelanggang dan keindahan pertunjukan pentas, berpijak pada Al-Qur\'an dan Sunnah.',
  bidang_judul: 'Dua Bidang, Satu Semangat',
  bidang_deskripsi:
    'Prestasi di gelanggang dan seni pertunjukan pentas saling menguatkan dalam pembinaan anggota Tapak Suci.',
  sanggar_judul: 'Surya Manggala Integra',
  sanggar_subtitle: 'Sanggar Seni Budaya Tapak Suci',
  sanggar_deskripsi:
    'Sanggar yang menghadirkan sendratari, penampilan, tradisi pencak silat, dan sosiodrama yang dibalut gerak Tapak Suci serta nilai Al-Qur\'an dan Sunnah.',
  motto: 'Dengan iman dan akhlak saya menjadi kuat, tanpa iman dan akhlak saya menjadi lemah.',
  cta_judul: 'Bergabung dan Berkarya Bersama Kami',
  cta_deskripsi:
    'Latihan, berprestasi, atau berpentas—semua punya ruang di Tapak Suci dan Surya Manggala Integra.',
}

const fokusDefault = [
  {
    judul: 'Sendratari',
    subtitle: 'Gerak yang bercerita',
    deskripsi: 'Dramatari yang memadukan teknik pencak silat Tapak Suci dengan narasi budaya.',
    ikon: 'Sparkles',
  },
  {
    judul: 'Penampilan',
    subtitle: 'Pentas yang berkelas',
    deskripsi: 'Penampilan di festival dan acara organisasi dengan standar artistik dan akhlak.',
    ikon: 'Trophy',
  },
  {
    judul: 'Tradisi Pencak Silat',
    subtitle: 'Budaya yang hidup',
    deskripsi: 'Pelestarian pola gerak, adat, dan filosofi pencak silat Tapak Suci.',
    ikon: 'Swords',
  },
  {
    judul: 'Sosiodrama',
    subtitle: 'Cerminan kehidupan',
    deskripsi: 'Pementasan bertema sosial tentang akhlak, kekeluargaan, dan kebijaksanaan.',
    ikon: 'Users',
  },
  {
    judul: 'Pembinaan Akhlak',
    subtitle: 'Berpijak pada wahyu',
    deskripsi: 'Setiap proses kreatif diwarnai nilai Al-Qur\'an dan Sunnah serta adab beladiri.',
    ikon: 'BookOpen',
  },
]

const prestasiDefault = [
  {
    id: 'contoh-1',
    judul: 'Juara Umum Kejuaraan Pencak Silat',
    kategori: 'Gelanggang',
    tingkat: 'Cabang',
    tanggal: '2026-10-12',
    nama_peserta: 'Tim Tapak Suci',
    gambar_url: '/prestasi-gelanggang.jpg',
  },
  {
    id: 'contoh-2',
    judul: 'Best Performance Festival Sendratari',
    kategori: 'Seni Pertunjukan',
    tingkat: 'Kabupaten',
    tanggal: '2026-09-15',
    nama_peserta: 'Surya Manggala Integra',
    gambar_url: '/sanggar-pentas.jpg',
  },
  {
    id: 'contoh-3',
    judul: 'Finalis Sosiodrama Tingkat Nasional',
    kategori: 'Seni Pertunjukan',
    tingkat: 'Nasional',
    tanggal: '2026-08-03',
    nama_peserta: 'Surya Manggala Integra',
    gambar_url: '/sanggar-tari.jpg',
  },
]

const loginRoles = [
  {
    role: 'admin',
    label: 'Admin',
    icon: ShieldCheck,
    description: 'Kelola seluruh data dan hak akses pengguna.',
  },
  {
    role: 'pengurus',
    label: 'Pengurus',
    icon: UserCog,
    description: 'Kelola konten, anggota, jadwal, dan prestasi.',
  },
  {
    role: 'anggota',
    label: 'Anggota',
    icon: User,
    description: 'Akses informasi organisasi dan program khusus.',
  },
]

const ikonFokus: Record<string, LucideIcon> = {
  Drama: Sparkles,
  Sparkles,
  Sparkle: Sparkles,
  Swords,
  Users,
  BookOpen,
  Trophy,
  Heart,
}

function nilai(
  baris: Baris[],
  kunci: string,
  field: 'judul' | 'subtitle' | 'deskripsi' | 'label_link' | 'link_url' | 'gambar_url' = 'judul',
  fallback = '',
): string {
  const item = baris.find((b) => b.kunci === kunci)
  const value = item?.[field]
  return value ? String(value) : fallback
}

function tanggalPendek(value: unknown) {
  const date = new Date(String(value ?? ''))
  if (Number.isNaN(date.getTime())) return { hari: '-', bulan: '-' }
  return {
    hari: String(date.getDate()).padStart(2, '0'),
    bulan: date.toLocaleDateString('id-ID', { month: 'short' }).replace('.', ''),
  }
}

function jamSingkat(value: unknown) {
  if (!value) return ''
  return String(value).slice(0, 5)
}

export default async function HomePage() {
  const [konten, berita, kegiatan, stats, program, fokusDb, penampilan, prestasiDb] =
    await Promise.all([
      getBerandaKonten(),
      getRecentBerita(3),
      getUpcomingKegiatan(3),
      getDashboardStats(),
      getProgramLatihanUmum(),
      getSanggarFokus(),
      getSanggarPenampilan(4),
      getPrestasi(6),
    ])

  const teks = (
    kunci: string,
    field: 'judul' | 'subtitle' | 'deskripsi' | 'label_link' | 'link_url' | 'gambar_url' = 'judul',
  ) => nilai(konten, kunci, field, kontenDefault[kunci] ?? '')

  const fokus = fokusDb.length ? fokusDb : fokusDefault
  const prestasi = prestasiDb.length ? prestasiDb : prestasiDefault
  const jadwal = program.slice(0, 4)

  return (
    <>
      {/* HERO CINEMATIC */}
      <section className="relative overflow-hidden bg-[#170909] text-white">
        <div className="absolute inset-0">
          <Image
            src="/login-silat.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-900/95 via-[#3d0b0b]/92 to-[#140808]/97" />
          <div className="stage-grid absolute inset-0 opacity-70" />
          <div className="noise-overlay" />
          <div className="absolute -left-32 top-10 h-96 w-96 animate-pulse-glow rounded-full bg-brand-500/25 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-96 w-96 animate-aura rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#140808] to-transparent" />
        </div>

        <div className="container-page relative grid gap-14 py-20 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-28">
          <div className="animate-fade-up">
            <span className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200">
              <Sparkles size={13} /> {teks('hero_kicker')}
            </span>

            <h1 className="mt-7 max-w-2xl text-[2.6rem] font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.9rem]">
              {teks('hero_judul').split('. ').map((bagian, index, semua) => (
                <span key={bagian} className="block">
                  {bagian}
                  {index < semua.length - 1 && <span className="text-amber-200">.</span>}
                </span>
              ))}
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              {nilai(konten, 'hero_deskripsi', 'deskripsi', kontenDefault.hero_deskripsi)}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="#jadwal"
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-brand-800 shadow-xl shadow-black/20 transition hover:-translate-y-1"
              >
                Lihat Jadwal Latihan
                <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </Link>
              <Link
                href="/sanggar"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:border-amber-300/60 hover:bg-white/10"
              >
                Kenali Sanggar <ArrowUpRight size={16} />
              </Link>
            </div>

            <div className="mt-12 grid max-w-lg grid-cols-3 gap-3">
              {[
                { icon: Users, value: stats.anggota ?? 0, label: 'Anggota' },
                { icon: Trophy, value: stats.prestasi ?? 0, label: 'Prestasi' },
                { icon: Medal, value: stats.sanggar_penampilan ?? 0, label: 'Penampilan' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="showcase-glass group rounded-2xl p-4 transition hover:-translate-y-1 hover:border-amber-300/40"
                >
                  <item.icon size={18} className="text-amber-200" />
                  <p className="mt-3 text-2xl font-extrabold leading-none">{item.value}</p>
                  <p className="mt-1.5 text-[11px] uppercase tracking-wide text-white/50">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg animate-stage-in lg:mx-0">
            <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-tr from-brand-500/20 via-transparent to-amber-400/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/20 shadow-2xl shadow-black/40">
              <Image
                src="/sanggar-tari.jpg"
                alt="Penampilan seni budaya Tapak Suci"
                width={900}
                height={1200}
                priority
                className="h-[420px] w-full object-cover object-center sm:h-[540px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#170909] via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200">
                  Sanggar Seni Budaya
                </p>
                <p className="mt-1 text-2xl font-bold">{teks('sanggar_judul')}</p>
                <p className="mt-1 text-xs text-white/60">{teks('sanggar_subtitle')}</p>
              </div>
            </div>

            <div className="absolute -left-6 top-10 hidden animate-float rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl sm:block">
              <Swords size={22} className="text-amber-200" />
              <p className="mt-2 text-xs font-bold">Pencak Silat Tapak Suci</p>
              <p className="text-[10px] text-white/55">Gerak yang berakhlak</p>
            </div>

            <div className="absolute -right-4 bottom-24 hidden animate-float rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl [animation-delay:1.5s] sm:block">
              <Quote size={18} className="text-amber-200" />
              <p className="mt-2 max-w-[170px] text-[11px] italic leading-relaxed text-white/75">
                Iman dan akhlak menjadi pondasi setiap gerak.
              </p>
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/10 py-4">
          <div className="marquee-mask overflow-hidden">
            <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.25em] text-white/45">
              {Array.from({ length: 2 }).map((_, loop) => (
                <span key={loop} className="flex items-center gap-8">
                  <span>Pencak Silat Tapak Suci</span>
                  <span className="text-amber-300/70">✦</span>
                  <span>Surya Manggala Integra</span>
                  <span className="text-amber-300/70">✦</span>
                  <span>Prestasi di Gelanggang</span>
                  <span className="text-amber-300/70">✦</span>
                  <span>Seni Pertunjukan Pentas</span>
                  <span className="text-amber-300/70">✦</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DUA BIDANG */}
      <section className="showcase-section" id="dua-bidang">
        <div className="mx-auto max-w-3xl text-center">
          <span className="showcase-eyebrow">Fokus Organisasi</span>
          <h2 className="showcase-title mt-5">{teks('bidang_judul')}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            {nilai(konten, 'bidang_deskripsi', 'deskripsi', kontenDefault.bidang_deskripsi)}
          </p>
          <div className="mx-auto mt-6 h-0.5 w-24 origin-center animate-draw-line rounded-full bg-gradient-to-r from-brand-600 to-amber-400" />
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Link
            href="/prestasi"
            className="card-tilt group relative min-h-[360px] overflow-hidden rounded-[2rem] border border-slate-200 shadow-xl transition duration-500"
          >
            <Image
              src="/prestasi-gelanggang.jpg"
              alt="Latihan dan pertandingan pencak silat"
              fill
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1b0808] via-[#1b0808]/55 to-transparent" />
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6">
              <span className="rounded-full border border-white/25 bg-black/25 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-200 backdrop-blur">
                Bidang 01
              </span>
              <Trophy size={24} className="text-white/80" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-7 text-white">
              <h3 className="text-3xl font-extrabold">Prestasi di Gelanggang</h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
                Pembinaan teknik, mental, dan sportivitas untuk mengharumkan nama Tapak Suci
                di setiap kejuaraan.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-amber-200">
                Lihat prestasi <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          <Link
            href="/sanggar"
            className="card-tilt group relative min-h-[360px] overflow-hidden rounded-[2rem] border border-slate-200 shadow-xl transition duration-500"
          >
            <Image
              src="/sanggar-pentas.jpg"
              alt="Penampilan seni dan budaya"
              fill
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2a0c0a] via-[#2a0c0a]/55 to-transparent" />
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6">
              <span className="rounded-full border border-white/25 bg-black/25 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-200 backdrop-blur">
                Bidang 02
              </span>
              <Sparkles size={24} className="text-white/80" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-7 text-white">
              <h3 className="text-3xl font-extrabold">Seni Pertunjukan Pentas</h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
                Sendratari, sosiodrama, dan tradisi pencak silat yang menyampaikan nilai
                organisasi melalui bahasa seni.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-amber-200">
                Jelajahi sanggar <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* SANGGAR */}
      <section className="relative overflow-hidden bg-[#f8f5f3] py-16 sm:py-24" id="sanggar">
        <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-brand-100/60 blur-3xl" />
        <div className="container-page relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative animate-fade-up">
            <div className="relative overflow-hidden rounded-[2rem] shadow-2xl">
              <Image
                src="/sanggar-pentas.jpg"
                alt="Sendratari Surya Manggala Integra"
                width={900}
                height={1100}
                className="h-[380px] w-full object-cover sm:h-[520px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2a0c0a]/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl">
                <p className="flex items-center gap-2 text-xs font-bold text-amber-200">
                  <BookOpen size={15} /> Berlandaskan Al-Qur&apos;an dan Sunnah
                </p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-white/70">
                  Setiap pertunjukan adalah dakwah nilai melalui gerak, cerita, dan adab.
                </p>
              </div>
            </div>
            <div className="absolute -bottom-5 -right-3 hidden rounded-2xl border border-brand-100 bg-white p-4 shadow-xl sm:block">
              <p className="text-3xl font-extrabold text-brand-700">5</p>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Fokus kreatif</p>
            </div>
          </div>

          <div className="animate-fade-up">
            <span className="showcase-eyebrow">{teks('sanggar_subtitle')}</span>
            <h2 className="showcase-title mt-5">{teks('sanggar_judul')}</h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
              {nilai(konten, 'sanggar_deskripsi', 'deskripsi', kontenDefault.sanggar_deskripsi)}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {fokus.slice(0, 6).map((item: Baris, index: number) => {
                const Icon = ikonFokus[String(item.ikon)] ?? Sparkles
                return (
                  <div
                    key={String(item.id ?? item.judul ?? index)}
                    className="showcase-card group flex gap-3 p-4"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-md shadow-brand-700/20 transition group-hover:rotate-6">
                      <Icon size={18} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900">{item.judul}</p>
                      <p className="text-[11px] font-semibold text-brand-700">{item.subtitle}</p>
                      <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-slate-500">
                        {item.deskripsi}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/sanggar" className="btn-primary inline-flex items-center gap-2">
                Lihat penampilan sanggar <ArrowRight size={16} />
              </Link>
              <Link href="#jadwal" className="btn-outline inline-flex items-center gap-2">
                Jadwal latihan <CalendarDays size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* JADWAL LATIHAN — dikelola admin */}
      <section className="showcase-section bg-white" id="jadwal">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="showcase-eyebrow">Dikelola Pengurus</span>
            <h2 className="showcase-title mt-5">Jadwal Latihan Terbaru</h2>
            <p className="mt-3 max-w-2xl text-sm text-slate-600">
              Jadwal ini diperbarui langsung oleh admin/pengurus. Pilih program untuk melihat
              detail target, instruktur, dan kuota.
            </p>
          </div>
          <Link
            href="/program-latihan"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-brand-700 hover:underline"
          >
            Semua program latihan <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {jadwal.length === 0 && (
              <div className="showcase-card col-span-full p-6 text-sm text-slate-500">
                Belum ada jadwal latihan aktif. Pengurus dapat menambahkannya di dashboard.
              </div>
            )}
            {jadwal.map((item: Baris) => {
              const tgl = tanggalPendek(item.tanggal_mulai)
              return (
                <Link
                  key={item.id}
                  href="/program-latihan"
                  className="showcase-card group flex gap-4 p-5"
                >
                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 text-center text-white shadow-lg">
                    <span>
                      <span className="block text-xl font-extrabold leading-none">{tgl.hari}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wide text-amber-200">
                        {tgl.bulan}
                      </span>
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="inline-flex rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-bold text-brand-700">
                      {item.jenis || 'Latihan'}
                    </span>
                    <h3 className="mt-2 line-clamp-2 font-bold leading-snug text-slate-900 group-hover:text-brand-700">
                      {item.judul}
                    </h3>
                    <div className="mt-3 space-y-1.5 text-[11px] text-slate-500">
                      {item.hari && (
                        <p className="flex items-center gap-1.5">
                          <CalendarDays size={13} className="text-brand-500" /> {item.hari}
                        </p>
                      )}
                      {(item.jam_mulai || item.jam_selesai) && (
                        <p className="flex items-center gap-1.5">
                          <Clock size={13} className="text-brand-500" />
                          {jamSingkat(item.jam_mulai)}–{jamSingkat(item.jam_selesai)} WIB
                        </p>
                      )}
                      {item.lokasi && (
                        <p className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-brand-500" /> {item.lokasi}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#2a0b0b] via-brand-900 to-[#160707] p-7 text-white">
            <div className="stage-grid absolute inset-0 opacity-60" />
            <div className="noise-overlay" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-200">
                <CalendarDays size={13} /> Agenda Mendatang
              </span>
              <div className="mt-6 space-y-3">
                {kegiatan.length === 0 && (
                  <p className="text-sm text-white/55">Belum ada agenda terjadwal.</p>
                )}
                {kegiatan.map((item: Baris) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 transition hover:border-amber-300/30 hover:bg-white/10"
                  >
                    <p className="text-[11px] font-semibold text-amber-200">
                      {formatDate(item.tanggal_mulai)} · {item.jenis}
                    </p>
                    <p className="mt-1.5 text-sm font-bold leading-snug">{item.judul}</p>
                    {item.lokasi && <p className="mt-1 text-[11px] text-white/50">{item.lokasi}</p>}
                  </div>
                ))}
              </div>
              <Link
                href="/kegiatan"
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-amber-200 hover:underline"
              >
                Semua kegiatan <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        {penampilan.length > 0 && (
          <div className="mt-10 rounded-[2rem] border border-brand-100 bg-brand-50/60 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-700">
                  Panggung Surya Manggala Integra
                </p>
                <h3 className="mt-1 text-xl font-bold text-slate-900">Penampilan Mendatang</h3>
              </div>
              <Link href="/sanggar" className="text-sm font-bold text-brand-700 hover:underline">
                Detail sanggar →
              </Link>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {penampilan.map((item: Baris) => (
                <div key={item.id} className="rounded-2xl border border-white bg-white p-4 shadow-sm">
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-800">
                    {item.jenis}
                  </span>
                  <p className="mt-2.5 line-clamp-2 text-sm font-bold leading-snug text-slate-900">
                    {item.judul}
                  </p>
                  <p className="mt-2 text-[11px] text-slate-500">
                    {formatDate(item.tanggal_mulai)} · {jamSingkat(item.jam_mulai)} WIB
                  </p>
                  <p className="mt-1 line-clamp-1 text-[11px] text-slate-500">{item.lokasi}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* PRESTASI */}
      <section className="showcase-section bg-slate-50" id="prestasi">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="showcase-eyebrow">Karya dan Penghargaan</span>
            <h2 className="showcase-title mt-5">Prestasi Kami</h2>
            <p className="mt-3 max-w-2xl text-sm text-slate-600">
              Catatan perjalanan anggota di gelanggang dan sanggar di panggung pertunjukan.
            </p>
          </div>
          <Link
            href="/prestasi"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-brand-700 hover:underline"
          >
            Semua prestasi <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {prestasi.map((item: Baris, index: number) => (
            <article
              key={item.id ?? index}
              className="showcase-card group flex flex-col overflow-hidden"
            >
              <div className="relative h-44 overflow-hidden">
                {item.gambar_url ? (
                  <img
                    src={item.gambar_url}
                    alt={item.judul}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-brand-700 via-brand-500 to-amber-500" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute left-4 top-4 flex gap-2">
                  <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-brand-700 backdrop-blur">
                    {item.kategori}
                  </span>
                  <span className="rounded-full bg-brand-700/90 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
                    {item.tingkat}
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-[11px] font-semibold text-slate-400">{formatDate(item.tanggal)}</p>
                <h3 className="mt-2 line-clamp-2 font-bold leading-snug text-slate-900">
                  {item.judul}
                </h3>
                {item.nama_peserta && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-brand-700">
                    <Users size={13} /> {item.nama_peserta}
                  </p>
                )}
                {item.deskripsi && (
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">
                    {item.deskripsi}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* BERITA */}
      <section className="showcase-section bg-white">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="showcase-eyebrow">Informasi Terbaru</span>
            <h2 className="showcase-title mt-5">Berita & Pengumuman</h2>
          </div>
          <Link href="/berita" className="inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:underline">
            Semua berita <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {berita.length === 0 && (
            <p className="text-sm text-slate-500">Belum ada berita yang diterbitkan.</p>
          )}
          {berita.map((item: Baris) => (
            <Link key={item.id} href={`/berita/${item.slug}`} className="showcase-card group flex flex-col overflow-hidden">
              <div className="relative h-40 overflow-hidden">
                {item.gambar_url ? (
                  <img
                    src={item.gambar_url}
                    alt={item.judul}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-brand-100 via-brand-400 to-brand-700" />
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-[11px] text-slate-400">
                  {formatDate(item.published_at)} · {item.penulis || 'Pengurus'}
                </p>
                <h3 className="mt-2 line-clamp-2 font-bold leading-snug text-slate-900 group-hover:text-brand-700">
                  {item.judul}
                </h3>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">{item.ringkasan}</p>
                <span className="mt-auto pt-4 text-xs font-bold text-brand-700">Baca selengkapnya →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* AKSES SISTEM */}
      <section className="relative overflow-hidden bg-[#1b0808] py-16 text-white sm:py-24" id="akses">
        <div className="stage-grid absolute inset-0 opacity-60" />
        <div className="noise-overlay" />
        <div className="absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="container-page relative">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200">
              <ShieldCheck size={13} /> Akses Sistem
            </span>
            <h2 className="mt-5 text-3xl font-extrabold sm:text-4xl">Masuk sesuai peran Anda</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              Hak akses ditetapkan oleh admin/pengurus melalui sistem, bukan hanya pilihan di
              halaman masuk.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
            {loginRoles.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.role}
                  href={`/login?role=${item.role}`}
                  className="showcase-glass group rounded-2xl p-6 text-center transition duration-300 hover:-translate-y-2 hover:border-amber-300/50 hover:bg-white/10"
                >
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-800 text-white shadow-lg transition group-hover:rotate-6">
                    <Icon size={23} />
                  </span>
                  <h3 className="mt-4 text-lg font-bold">Masuk sebagai {item.label}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-white/55">{item.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-amber-200">
                    Lanjut masuk <ArrowRight size={14} className="transition group-hover:translate-x-1" />
                  </span>
                </Link>
              )
            })}
          </div>

          <p className="mt-8 text-center text-sm text-white/55">
            Belum punya akun?{' '}
            <Link href="/register" className="font-bold text-amber-200 hover:underline">
              Daftar sebagai anggota
            </Link>
          </p>
        </div>
      </section>

      {/* CTA / KONTAK */}
      <section className="showcase-section bg-slate-50" id="kontak">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-800 via-brand-700 to-[#3b0f0a] p-8 text-white shadow-2xl sm:p-12">
          <div className="absolute inset-0">
            <Image
              src="/sanggar-pentas.jpg"
              alt=""
              fill
              className="object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-900/95 via-brand-800/80 to-transparent" />
          </div>
          <div className="relative grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            <div>
              <span className="showcase-eyebrow border-amber-300/40 bg-amber-300/10 text-amber-200">
                Mari Bersama
              </span>
              <h2 className="mt-5 max-w-2xl text-3xl font-extrabold leading-tight sm:text-4xl">
                {teks('cta_judul')}
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
                {nilai(konten, 'cta_deskripsi', 'deskripsi', kontenDefault.cta_deskripsi)}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-brand-800 transition hover:-translate-y-1"
                >
                  Daftar anggota <ArrowRight size={16} />
                </Link>
                <a
                  href="mailto:pimpinanpusattapaksuci@gmail.com"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-5 py-3 text-sm font-bold backdrop-blur transition hover:bg-white/10"
                >
                  <Mail size={16} /> Hubungi kami
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-200">Kontak Resmi</p>
              <div className="mt-4 space-y-3 text-sm text-white/75">
                <p className="flex items-start gap-2.5">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-amber-200" />
                  Jl. Menteri Supeno No. 52, Umbulharjo, Yogyakarta
                </p>
                <p className="flex items-start gap-2.5">
                  <Mail size={16} className="mt-0.5 shrink-0 text-amber-200" />
                  <a href="mailto:pimpinanpusattapaksuci@gmail.com" className="break-all hover:text-white">
                    pimpinanpusattapaksuci@gmail.com
                  </a>
                </p>
                <p className="flex items-center gap-2.5">
                  <Phone size={16} className="shrink-0 text-amber-200" />
                  <a href="tel:+6281529051101" className="hover:text-white">+62 815 2905 1101</a>
                </p>
              </div>
              <p className="mt-5 border-t border-white/10 pt-4 text-[11px] italic leading-relaxed text-amber-100/70">
                “{teks('motto')}”
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
