import Link from 'next/link'

const nav = [
  { href: '/', label: 'Beranda' },
  { href: '/berita', label: 'Berita' },
  { href: '/kegiatan', label: 'Kegiatan' },
  { href: '/program-latihan', label: 'Program Latihan' },
  { href: '/anggota', label: 'Anggota' },
  { href: '/galeri', label: 'Galeri' },
  { href: '/dokumen', label: 'Dokumen' },
]

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-brand-700">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-600 text-sm text-white">
            TS
          </span>
          <span className="hidden sm:inline">Tapak Suci</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-brand-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/login" className="btn-outline hidden sm:inline-flex">
            Masuk
          </Link>
          <details className="relative md:hidden">
            <summary className="btn-outline cursor-pointer list-none">Menu</summary>
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/login"
                className="mt-1 block rounded-lg bg-brand-600 px-3 py-2 text-center text-sm font-semibold text-white"
              >
                Masuk
              </Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  )
}
