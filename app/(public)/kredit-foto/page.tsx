import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'

const foto = [
  {
    nama: 'Pencak Silat Api',
    file: 'login-silat.jpg',
    penulis: 'Muchtamir',
    lisensi: 'CC BY-SA 4.0',
    sumber: 'https://commons.wikimedia.org/wiki/File:Pencak_silat_api.jpg',
  },
  {
    nama: 'Men Pencak Silat Match Malaysia vs Vietnam',
    file: 'prestasi-gelanggang.jpg',
    penulis: 'Gunawan Kartapranata',
    lisensi: 'CC BY-SA 3.0',
    sumber: 'https://commons.wikimedia.org/wiki/File:Men_Pencak_Silat_Match_Malaysia_vs_Vietnam.jpg',
  },
  {
    nama: 'Pencak Silat - Indonesian Martial Art Performance',
    file: 'sanggar-pentas.jpg',
    penulis: 'Kbidols - Haryadi Andradjati',
    lisensi: 'CC BY-SA 4.0',
    sumber: 'https://commons.wikimedia.org/wiki/File:PENCAK_SILAT_-_Indonesian_martial_art_performance.jpg',
  },
  {
    nama: 'PSHT - Tendangan Terbang',
    file: 'sanggar-tari.jpg',
    penulis: 'Agus Triyanto',
    lisensi: 'CC0',
    sumber: 'https://commons.wikimedia.org/wiki/File:Persaudaraan_Setia_Hati_Terate_-_Tendangan_terbang.jpg',
  },
  {
    nama: 'Tapak Suci Putra Muhammadiyah PPTQM 2021',
    file: 'raport-atlet.jpg',
    penulis: 'Karunia Tuhan',
    lisensi: 'CC BY-SA 4.0',
    sumber: 'https://commons.wikimedia.org/wiki/File:Tapak_Suci_Putra_Muhammadiyah_PPTQM_2021.jpg',
  },
]

export const metadata = {
  title: 'Kredit Foto | Tapak Suci',
  description: 'Atribusi foto pencak silat yang digunakan pada portal Tapak Suci.',
}

export default function KreditFotoPage() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white via-[#fffaf8] to-white py-16 sm:py-20">
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-brand-100/60 blur-3xl" />
      <div className="container-page relative">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:underline">
          <ArrowLeft size={16} /> Kembali ke beranda
        </Link>
        <p className="showcase-eyebrow mt-8">Atribusi</p>
        <h1 className="showcase-title mt-4">Kredit Foto Pencak Silat</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600">
          Seluruh ilustrasi foto pada portal ini berasal dari Wikimedia Commons dengan lisensi terbuka
          dan disimpan secara lokal. Terima kasih kepada para fotografer berikut atas karya mereka.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {foto.map((item) => (
            <div key={item.file} className="showcase-card p-5">
              <img
                src={`/${item.file}`}
                alt={item.nama}
                className="h-36 w-full rounded-xl object-cover"
              />
              <h2 className="mt-4 text-sm font-bold text-slate-900">{item.nama}</h2>
              <p className="mt-1 text-xs text-slate-600">Foto oleh {item.penulis}</p>
              <p className="mt-1 text-xs font-semibold text-brand-700">{item.lisensi}</p>
              <a
                href={item.sumber}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-brand-700"
              >
                Lihat sumber <ExternalLink size={12} />
              </a>
            </div>
          ))}
        </div>

        <p className="mt-10 rounded-2xl border border-brand-100 bg-brand-50/70 p-4 text-xs text-slate-700">
          Lambang Tapak Suci pada portal ini adalah identitas organisasi dan tidak termasuk dalam
          kredit foto di atas.
        </p>
      </div>
    </div>
  )
}
