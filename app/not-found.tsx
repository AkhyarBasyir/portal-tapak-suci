import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 p-6 text-center">
      <div>
        <p className="text-6xl font-bold text-brand-600">404</p>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">Halaman tidak ditemukan</h1>
        <p className="mt-2 text-slate-600">Halaman yang Anda cari tidak tersedia.</p>
        <Link href="/" className="btn-primary mt-6">Kembali ke Beranda</Link>
      </div>
    </div>
  )
}
