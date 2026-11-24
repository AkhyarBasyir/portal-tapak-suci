import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Mail, MapPin, Phone, Quote } from 'lucide-react'
import { CONTACT_EMAIL } from '@/lib/constants'

const tautan = [
  { href: '/prestasi', label: 'Prestasi' },
  { href: '/sanggar', label: 'Sanggar Seni Budaya' },
  { href: '/berita', label: 'Berita' },
]

const lainnya = [
  { href: '/kegiatan', label: 'Kegiatan' },
  { href: '/anggota', label: 'Anggota' },
  { href: '/galeri', label: 'Galeri' },
  { href: '/dokumen', label: 'Dokumen' },
  { href: '/kredit-foto', label: 'Kredit Foto' },
]

export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#170a0a] text-white">
      <div className="noise-overlay" />
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-brand-600/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="container-page relative grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white shadow-lg">
              <Image
                src="/tapak-suci-logo.webp"
                alt="Lambang Tapak Suci"
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
              />
            </span>
            <span>
              <span className="block font-bold leading-tight">Tapak Suci</span>
              <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-amber-200/80">
                Putera Muhammadiyah
              </span>
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            Sistem informasi organisasi yang mempertemukan dua semangat: prestasi di
            gelanggang dan seni pertunjukan pentas, berlandaskan Al-Qur&apos;an dan Sunnah.
          </p>
          <figure className="mt-5 border-l-2 border-amber-300/60 pl-4">
            <Quote size={14} className="text-amber-300/80" />
            <blockquote className="mt-1 text-xs italic leading-relaxed text-white/60">
              Dengan iman dan akhlak saya menjadi kuat, tanpa iman dan akhlak saya menjadi lemah.
            </blockquote>
          </figure>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-200">Dua Bidang</p>
          <div className="mt-4 space-y-2.5 text-sm text-white/65">
            {tautan.map((item) => (
              <Link key={item.href} href={item.href} className="group flex items-center gap-1.5 hover:text-white">
                {item.label}
                <ArrowUpRight size={13} className="opacity-0 transition group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-200">Jelajahi</p>
          <div className="mt-4 space-y-2.5 text-sm text-white/65">
            {lainnya.map((item) => (
              <Link key={item.href} href={item.href} className="group flex items-center gap-1.5 hover:text-white">
                {item.label}
                <ArrowUpRight size={13} className="opacity-0 transition group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-200">Kontak Resmi</p>
          <div className="mt-4 space-y-3 text-sm text-white/65">
            <p className="flex items-start gap-2.5">
              <MapPin size={16} className="mt-0.5 shrink-0 text-amber-200/80" />
              Jl. Menteri Supeno No. 52, Umbulharjo, Yogyakarta
            </p>
            <p className="flex items-start gap-2.5">
              <Mail size={16} className="mt-0.5 shrink-0 text-amber-200/80" />
              <a href={`mailto:${CONTACT_EMAIL}`} className="break-all hover:text-white">
                {CONTACT_EMAIL}
              </a>
            </p>
            <p className="flex items-center gap-2.5">
              <Phone size={16} className="shrink-0 text-amber-200/80" />
              <a href="tel:+6281529051101" className="hover:text-white">+62 815 2905 1101</a>
            </p>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Tapak Suci Putera Muhammadiyah. Seluruh hak dilindungi.</span>
          <span>Dibangun dengan nilai iman, akhlak, dan persaudaraan.</span>
        </div>
      </div>
    </footer>
  )
}
