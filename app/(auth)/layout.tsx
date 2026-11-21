import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-gradient-to-br from-brand-700 to-brand-900 p-12 text-white lg:flex">
        <Link href="/" className="text-xl font-bold">Tapak Suci</Link>
        <div>
          <h2 className="text-4xl font-bold leading-tight">
            Kelola informasi organisasi dari mana saja.
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-white/80">
           Data tersimpan aman di cloud. Masuk untuk mengelola anggota, kegiatan,
           berita, dokumen, dan keuangan.
          </p>
        </div>
        <p className="text-sm text-white/60">© {new Date().getFullYear()} Tapak Suci</p>
      </div>
      <div className="flex items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}
