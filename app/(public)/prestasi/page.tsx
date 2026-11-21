import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Award, Medal, Sparkles, Trophy } from 'lucide-react'
import { getPrestasi } from '@/lib/data'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Prestasi',
  description:
    'Prestasi Tapak Suci di gelanggang dan Surya Manggala Integra di seni pertunjukan pentas.',
}

type Baris = Record<string, any>

export default async function PrestasiPage() {
  const data = await getPrestasi(30)
  const gelanggang = data.filter((p: Baris) => String(p.kategori).toLowerCase().includes('gelanggang'))
  const pentas = data.filter(
    (p: Baris) =>
      String(p.kategori).toLowerCase().includes('seni') ||
      String(p.kategori).toLowerCase().includes('pertunjukan'),
  )
  const lainnya = data.filter(
    (p: Baris) => !gelanggang.includes(p) && !pentas.includes(p),
  )

  function Kartu({ item }: { item: Baris }) {
    return (
      <article className="showcase-card group overflow-hidden">
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-brand-700 to-brand-900">
          {item.gambar_url ? (
            <img
              src={item.gambar_url}
              alt={item.judul}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-white/70">
              <Award size={46} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute left-4 top-4 flex gap-2">
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-brand-700">
              {item.kategori}
            </span>
            <span className="rounded-full bg-brand-700/90 px-2.5 py-1 text-[10px] font-bold text-white">
              {item.tingkat}
            </span>
          </div>
          <span className="absolute bottom-4 right-4 text-[11px] font-semibold text-white/80">
            {formatDate(item.tanggal)}
          </span>
        </div>
        <div className="p-6">
          <h3 className="font-bold leading-snug text-slate-900">{item.judul}</h3>
          {(item.nama_peserta || item.nama_sanggar) && (
            <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-brand-700">
              <Medal size={14} /> {item.nama_sanggar || item.nama_peserta}
            </p>
          )}
          {item.penyelenggara && (
            <p className="mt-1 text-xs text-slate-500">{item.penyelenggara}</p>
          )}
          {item.deskripsi && (
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">{item.deskripsi}</p>
          )}
        </div>
      </article>
    )
  }

  function Grup({
    icon: Icon,
    eyebrow,
    judul,
    deskripsi,
    items,
  }: {
    icon: typeof Trophy
    eyebrow: string
    judul: string
    deskripsi: string
    items: Baris[]
  }) {
    if (!items.length) return null
    return (
      <section className="showcase-section !py-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="showcase-eyebrow">
              <Icon size={13} /> {eyebrow}
            </span>
            <h2 className="mt-4 text-2xl font-extrabold text-slate-900 sm:text-3xl">{judul}</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">{deskripsi}</p>
          </div>
          <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600">
            {items.length} prestasi
          </span>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item: Baris) => (
            <Kartu key={item.id} item={item} />
          ))}
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="relative overflow-hidden bg-[#190909] py-20 text-white sm:py-28">
        <div className="absolute inset-0">
          <Image src="/prestasi-gelanggang.jpg" alt="" fill priority className="object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-900/95 via-[#3d0b0b]/92 to-[#140808]/97" />
          <div className="stage-grid absolute inset-0 opacity-70" />
          <div className="noise-overlay" />
        </div>
        <div className="container-page relative max-w-3xl animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200">
            <Trophy size={13} /> Karya dan Penghargaan
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-6xl">
            Prestasi Tapak Suci
            <span className="mt-2 block bg-gradient-to-r from-amber-200 via-white to-brand-200 bg-clip-text text-transparent">
              Di dua bidang.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70">
            Setiap pencapaian adalah bukti pembinaan yang konsisten—di gelanggang pertandingan
            maupun di panggung seni pertunjukan pentas.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/program-latihan" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-brand-800 transition hover:-translate-y-1">
              Program latihan <ArrowRight size={16} />
            </Link>
            <Link href="/sanggar" className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-5 py-3 text-sm font-bold backdrop-blur transition hover:bg-white/10">
              <Sparkles size={16} /> Sanggar seni
            </Link>
          </div>
        </div>
      </section>

      <div className="bg-white">
        <Grup
          icon={Trophy}
          eyebrow="Gelanggang"
          judul="Prestasi di Gelanggang"
          deskripsi="Hasil terbaik anggota pada kejuaraan pencak silat, mulai dari tingkat cabang hingga nasional."
          items={gelanggang}
        />
        <div className="border-t border-slate-100" />
        <Grup
          icon={Sparkles}
          eyebrow="Seni Pertunjukan Pentas"
          judul="Prestasi Seni Pertunjukan"
          deskripsi="Penghargaan Surya Manggala Integra untuk sendratari, sosiodrama, dan tradisi pencak silat."
          items={pentas}
        />
        {lainnya.length > 0 && (
          <>
            <div className="border-t border-slate-100" />
            <Grup
              icon={Award}
              eyebrow="Lainnya"
              judul="Penghargaan Lain"
              deskripsi="Kontribusi dan apresiasi lainnya bagi organisasi dan anggota."
              items={lainnya}
            />
          </>
        )}
        {data.length === 0 && (
          <div className="showcase-section text-center text-sm text-slate-500">
            Belum ada prestasi yang dicatat. Pengurus dapat menambahkannya melalui dashboard.
          </div>
        )}
      </div>
    </>
  )
}
