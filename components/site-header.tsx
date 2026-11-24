'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react'

const nav = [
  { href: '/', label: 'Beranda' },
  { href: '/sanggar', label: 'Sanggar' },
  { href: '/prestasi', label: 'Prestasi' },
  { href: '/berita', label: 'Berita' },
]

const navLainnya = [
  { href: '/kegiatan', label: 'Kegiatan' },
  { href: '/anggota', label: 'Anggota' },
  { href: '/galeri', label: 'Galeri' },
  { href: '/dokumen', label: 'Dokumen' },
  { href: '/kredit-foto', label: 'Kredit Foto' },
]

const semua = [...nav, ...navLainnya]

function LinkK({
  href,
  label,
  aktif,
  onClick,
}: {
  href: string
  label: string
  aktif: boolean
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`relative rounded-lg px-3 py-2 text-sm font-semibold transition ${
        aktif
          ? 'bg-brand-50 text-brand-700'
          : 'text-slate-600 hover:bg-slate-100 hover:text-brand-700'
      }`}
    >
      {label}
      {aktif && (
        <span className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-brand-600" />
      )}
    </Link>
  )
}

export default function SiteHeader() {
  const pathname = usePathname()
  const [buka, setBuka] = useState(false)

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-gradient-to-r from-[#3b0a0a] via-brand-800 to-[#4a1408] text-white">
        <div className="container-page flex h-8 items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] sm:text-xs">
          <span className="truncate">Portal Resmi Tapak Suci Putera Muhammadiyah</span>
          <span className="hidden shrink-0 items-center gap-2 text-amber-200 sm:flex">
            <span className="h-1 w-1 rounded-full bg-amber-300" />
            Prestasi di Gelanggang · Seni Pertunjukan Pentas
          </span>
        </div>
      </div>

      <div className="border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="container-page flex h-[70px] items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-md ring-1 ring-brand-100 transition group-hover:-rotate-3 group-hover:shadow-lg">
              <Image
                src="/tapak-suci-logo.webp"
                alt="Lambang Tapak Suci"
                width={34}
                height={34}
                className="h-[34px] w-[34px] object-contain"
                priority
              />
            </span>
            <span className="leading-tight">
              <span className="block text-[15px] font-extrabold tracking-tight text-slate-900">
                Tapak Suci
              </span>
              <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">
                Surya Manggala Integra
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex">
            {nav.map((item) => (
              <LinkK
                key={item.href}
                href={item.href}
                label={item.label}
                aktif={pathname === item.href}
              />
            ))}
            <details className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-brand-700">
                Lainnya
                <ChevronDown size={14} className="transition group-open:rotate-180" />
              </summary>
              <div className="absolute right-0 top-full z-50 mt-3 w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/10">
                {navLainnya.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-brand-50 hover:text-brand-700 ${
                      pathname === item.href ? 'bg-brand-50 text-brand-700' : 'text-slate-600'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </details>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-brand-700 to-brand-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-700/20 transition hover:-translate-y-0.5 hover:shadow-xl sm:inline-flex"
            >
              Masuk <ArrowRight size={15} />
            </Link>
            <button
              type="button"
              onClick={() => setBuka((v) => !v)}
              aria-label={buka ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={buka}
              className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 lg:hidden"
            >
              {buka ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>

        {buka && (
          <nav className="border-t border-slate-100 bg-white px-4 py-3 lg:hidden">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {semua.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setBuka(false)}
                  className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                    pathname === item.href
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-50 text-slate-700 hover:bg-brand-50 hover:text-brand-700'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <Link
              href="/login"
              onClick={() => setBuka(false)}
              className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white sm:hidden"
            >
              Masuk ke portal <ArrowRight size={15} />
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
