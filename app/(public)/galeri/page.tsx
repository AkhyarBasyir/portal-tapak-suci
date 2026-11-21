import { getMediaByType } from '@/lib/data'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Galeri Kegiatan' }

export default async function GaleriPage() {
  const items = await getMediaByType('galeri')

  return (
    <div className="container-page py-12">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Dokumentasi</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">Galeri Kegiatan</h1>
      <p className="mt-2 text-slate-600">Dokumentasi latihan, seminar, dan kegiatan organisasi.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 && <p className="text-sm text-slate-500">Belum ada foto di galeri.</p>}
        {items.map((item) => (
          <div key={item.id} className="card overflow-hidden">
            <div className="h-52 w-full overflow-hidden bg-slate-100">
              <img src={item.file_url} alt={item.judul} className="h-full w-full object-cover" />
            </div>
            <div className="p-4">
              <p className="font-semibold text-slate-900">{item.judul}</p>
              <p className="mt-1 text-xs text-slate-500">
                {item.kategori || 'Umum'} · {formatDate(item.created_at)}
              </p>
              {item.keterangan && <p className="mt-2 text-sm text-slate-600">{item.keterangan}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
