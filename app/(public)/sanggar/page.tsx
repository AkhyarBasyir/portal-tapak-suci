import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock,
  Heart,
  MapPin,
  Quote,
  Sparkles,
  Swords,
  Trophy,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { getBerandaKonten, getSanggarFokus, getSanggarPenampilan } from '@/lib/data'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Sanggar Surya Manggala Integra',
  description:
    'Sanggar seni budaya Tapak Suci: sendratari, penampilan, tradisi pencak silat, dan sosiodrama berlandaskan Al-Qur\'an dan Sunnah.',
}

type Baris = Record<string, any>

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

const fokusDefault = [
  {
    judul: 'Sendratari',
    subtitle: 'Gerak yang bercerita',
    deskripsi: 'Pewarisan nilai melalui dramatari yang memadukan teknik pencak silat Tapak Suci dengan narasi budaya.',
    ikon: 'Sparkles',
  },
  {
    judul: 'Penampilan',
    subtitle: 'Pentas yang berkelas',
    deskripsi: 'Penampilan di festival, acara organisasi, dan pertunjukan publik dengan standar artistik dan akhlak.',
    ikon: 'Trophy',
  },
  {
    judul: 'Tradisi Pencak Silat',
    subtitle: 'Budaya yang hidup',
    deskripsi: 'Pelestarian pola gerak, adat, dan filosofi pencak silat Tapak Suci sebagai warisan bangsa.',
    ikon: 'Swords',
  },
  {
    judul: 'Sosiodrama',
    subtitle: 'Cerminan kehidupan',
    deskripsi: 'Pementasan bertema sosial yang mengangkat akhlak, kekeluargaan, dan penyelesaian masalah secara bijak.',
    ikon: 'Users',
  },
  {
    judul: 'Pembinaan Akhlak',
    subtitle: 'Berpijak pada wahyu',
    deskripsi: 'Setiap proses kreatif diwarnai nilai Al-Qur\'an dan Sunnah serta adab beladiri yang bertanggung jawab.',
    ikon: 'BookOpen',
  },
]

function jamSingkat(value: unknown) {
  return value ? String(value).slice(0, 5) : ''
}

export default async function SanggarPage() {
  const [konten, fokusDb, penampilan] = await Promise.all([
    getBerandaKonten(),
    getSanggarFokus(),
    getSanggarPenampilan(12),
  ])

  const ambil = (kunci: string, fallback: string) => {
    const row = konten.find((k: Baris) => k.kunci === kunci)
    return String(row?.judul || fallback)
  }
  const deskripsi = (kunci: string, fallback: string) => {
    const row = konten.find((k: Baris) => k.kunci === kunci)
    return String(row?.deskripsi || fallback)
  }

  const judul = ambil('sanggar_judul', 'Surya Manggala Integra')
  const subtitle = ambil('sanggar_subtitle', 'Sanggar Seni Budaya Tapak Suci')
  const sinopsis = deskripsi(
    'sanggar_deskripsi',
    'Sanggar yang menghadirkan sendratari, penampilan, tradisi pencak silat, dan sosiodrama yang dibalut gerak Tapak Suci serta nilai Al-Qur\'an dan Sunnah.',
  )
  const fokus = fokusDb.length ? fokusDb : fokusDefault

  return (
    <>
      <section className="relative overflow-hidden bg-[#190909] py-20 text-white sm:py-28">
        <div className="absolute inset-0">
          <Image src="/sanggar-tari.jpg" alt="" fill priority className="object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-900/95 via-[#3d0b0b]/92 to-[#140808]/97" />
          <div className="stage-grid absolute inset-0 opacity-70" />
          <div className="noise-overlay" />
          <div className="absolute -right-32 top-0 h-96 w-96 animate-pulse-glow rounded-full bg-amber-500/15 blur-3xl" />
        </div>
        <div className="container-page relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200">
              <Sparkles size={13} /> {subtitle}
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-6xl">
              {judul}
              <span className="mt-2 block bg-gradient-to-r from-amber-200 via-white to-brand-200 bg-clip-text text-transparent">
                Seni yang berakhlak.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70">{sinopsis}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#fokus" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-brand-800 transition hover:-translate-y-1">
                Lihat fokus sanggar <ArrowRight size={16} />
              </a>
              <a href="#penampilan" className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-5 py-3 text-sm font-bold backdrop-blur transition hover:bg-white/10">
                Jadwal penampilan <CalendarDays size={16} />
              </a>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md animate-stage-in">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/20 shadow-2xl">
              <Image
                src="/sanggar-pentas.jpg"
                alt="Penampilan sendratari"
                width={800}
                height={1000}
                className="h-[400px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#190909] via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-200">
                  Al-Qur&apos;an · Sunnah · Persaudaraan
                </p>
                <p className="mt-2 text-lg font-bold">Setiap gerak membawa makna.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="showcase-section bg-white" id="fokus">
        <div className="mx-auto max-w-3xl text-center">
          <span className="showcase-eyebrow">Fokus & Peran</span>
          <h2 className="showcase-title mt-5">Lima Pilar Surya Manggala Integra</h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            Semua fokus dijalankan dengan gerak pencak silat Tapak Suci sebagai bahasa ekspresi,
            dan nilai Al-Qur&apos;an serta Sunnah sebagai landasan.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fokus.slice(0, 6).map((item: Baris, index: number) => {
            const Icon = ikonFokus[String(item.ikon)] ?? Sparkles
            return (
              <article
                key={String(item.id ?? item.judul ?? index)}
                className="showcase-card group relative p-6"
              >
                <span className="absolute right-5 top-4 text-4xl font-black text-slate-100 transition group-hover:text-brand-50">
                  0{index + 1}
                </span>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-900 text-white shadow-lg transition group-hover:rotate-6">
                  <Icon size={21} />
                </span>
                <h3 className="mt-5 text-lg font-bold text-slate-900">{item.judul}</h3>
                <p className="text-xs font-semibold text-brand-700">{item.subtitle}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.deskripsi}</p>
              </article>
            )
          })}
        </div>
        <figure className="mx-auto mt-12 max-w-3xl rounded-[2rem] border-l-4 border-amber-400 bg-slate-50 p-7">
          <Quote size={20} className="text-amber-500" />
          <blockquote className="mt-3 text-lg font-semibold italic leading-relaxed text-slate-800">
            “{konten.find((k: Baris) => k.kunci === 'motto')?.judul ||
              'Dengan iman dan akhlak saya menjadi kuat, tanpa iman dan akhlak saya menjadi lemah.'}”
          </blockquote>
          <figcaption className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-700">
            Motto Tapak Suci
          </figcaption>
        </figure>
      </section>

      <section className="showcase-section bg-slate-50" id="penampilan">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="showcase-eyebrow">Pentas & Pertunjukan</span>
            <h2 className="showcase-title mt-5">Penampilan Sanggar</h2>
            <p className="mt-3 max-w-2xl text-sm text-slate-600">
              Jadwal penampilan dikelola oleh pengurus dan dapat berubah sewaktu-waktu.
            </p>
          </div>
          <Link href="/program-latihan" className="inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:underline">
            Lihat program latihan <ArrowRight size={16} />
          </Link>
        </div>

        {penampilan.length === 0 && (
          <div className="showcase-card p-8 text-center text-sm text-slate-500">
            Belum ada penampilan terjadwal. Nantikan informasi berikutnya.
          </div>
        )}

        <div className="space-y-4">
          {penampilan.map((item: Baris, index: number) => (
            <article
              key={item.id}
              className="showcase-card grid gap-0 overflow-hidden md:grid-cols-[190px_1fr]"
            >
              <div className="relative min-h-[150px] overflow-hidden bg-gradient-to-br from-brand-700 to-brand-900">
                {item.gambar_url ? (
                  <img src={item.gambar_url} alt={item.judul} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <div className="absolute inset-0 grid place-items-center text-white/80">
                    <Sparkles size={36} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold text-brand-700">
                  {item.jenis}
                </span>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-brand-700">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={14} /> {formatDate(item.tanggal_mulai)}
                    {item.tanggal_selesai ? ` – ${formatDate(item.tanggal_selesai)}` : ''}
                  </span>
                  {(item.jam_mulai || item.jam_selesai) && (
                    <span className="inline-flex items-center gap-1.5 text-slate-500">
                      <Clock size={14} /> {jamSingkat(item.jam_mulai)}–{jamSingkat(item.jam_selesai)} WIB
                    </span>
                  )}
                </div>
                <h3 className="mt-3 text-xl font-bold text-slate-900">{item.judul}</h3>
                {item.deskripsi && (
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.deskripsi}</p>
                )}
                <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
                  {item.lokasi && (
                    <span className="inline-flex items-center gap-1.5"><MapPin size={14} /> {item.lokasi}</span>
                  )}
                  {item.target && (
                    <span className="inline-flex items-center gap-1.5"><Users size={14} /> {item.target}</span>
                  )}
                </div>
                <span className="mt-3 block text-[10px] font-bold uppercase tracking-widest text-slate-300">
                  #{String(index + 1).padStart(2, '0')}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
