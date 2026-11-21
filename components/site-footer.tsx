import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="container-page grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-bold text-brand-700">Tapak Suci</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Portal informasi organisasi pencak silat Tapak Suci. Data tersimpan di cloud
            dan dapat diakses kapan saja, di mana saja.
          </p>
        </div>
        <div>
          <p className="font-semibold text-slate-800">Tautan</p>
          <div className="mt-2 space-y-1 text-sm text-slate-600">
            <Link href="/berita" className="block hover:text-brand-700">Berita</Link>
            <Link href="/kegiatan" className="block hover:text-brand-700">Kegiatan</Link>
            <Link href="/program-latihan" className="block hover:text-brand-700">Program Latihan</Link>
            <Link href="/anggota" className="block hover:text-brand-700">Anggota</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold text-slate-800">Media</p>
          <div className="mt-2 space-y-1 text-sm text-slate-600">
            <Link href="/galeri" className="block hover:text-brand-700">Galeri</Link>
            <Link href="/dokumen" className="block hover:text-brand-700">Dokumen</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold text-slate-800">Kontak</p>
          <p className="mt-2 text-sm text-slate-600">
            Email: pimpinanpusattapaksuci@gmail.com
            <br />
            Telepon: +62 815 2905 1101
            <br />
            Yogyakarta, Indonesia
          </p>
        </div>
      </div>
      <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Tapak Suci. Seluruh hak dilindungi.
      </div>
    </footer>
  )
}
