import Link from 'next/link'
import { getPublishedBerita } from '@/lib/data'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Berita & Pengumuman' }

export default async function BeritaPage() {
  const berita = await getPublishedBerita()

  return (
    <div className="container-page py-12">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Informasi</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">Berita & Pengumuman</h1>
      <p className="mt-2 text-slate-600">Berita resmi dan pengumuman terbaru dari organisasi.</p>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {berita.length === 0 && <p className="text-sm text-slate-500">Belum ada berita.</p>}
        {berita.map((item) => (
          <Link key={item.id} href={`/berita/${item.slug}`} className="card overflow-hidden hover:shadow-md">
            {item.gambar_url ? (
              <img src={item.gambar_url} alt={item.judul} className="h-44 w-full object-cover" />
            ) : (
              <div className="h-44 w-full bg-gradient-to-br from-brand-100 to-brand-500" />
            )}
            <div className="p-5">
              <p className="text-xs text-slate-500">{formatDate(item.published_at)} · {item.penulis || 'Pengurus'}</p>
              <h2 className="mt-2 line-clamp-2 text-lg font-bold text-slate-900">{item.judul}</h2>
              <p className="mt-2 line-clamp-3 text-sm text-slate-600">{item.ringkasan}</p>
              <p className="mt-4 text-sm font-semibold text-brand-700">Baca selengkapnya →</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
