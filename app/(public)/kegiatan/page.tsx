import { CalendarDays, MapPin } from 'lucide-react'
import { getAllKegiatan } from '@/lib/data'
import { badgeClass, formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Jadwal Kegiatan' }

export default async function KegiatanPage() {
  const kegiatan = await getAllKegiatan()

  return (
    <div className="container-page py-12">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Agenda</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">Jadwal Kegiatan</h1>
      <p className="mt-2 text-slate-600">Latihan, seminar, turnamen, dan agenda organisasi lainnya.</p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {kegiatan.length === 0 && <p className="text-sm text-slate-500">Belum ada kegiatan.</p>}
        {kegiatan.map((item) => (
          <div key={item.id} className="card p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{item.jenis}</p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">{item.judul}</h2>
              </div>
              <span className={`badge ${badgeClass(item.status)}`}>{item.status}</span>
            </div>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                <CalendarDays size={16} className="text-slate-500" />
                {formatDate(item.tanggal_mulai)}
                {item.tanggal_selesai && ` s.d. ${formatDate(item.tanggal_selesai)}`}
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={16} className="text-slate-500" />
                {item.lokasi || 'Lokasi belum ditentukan'}
              </p>
            </div>
            {item.deskripsi && <p className="mt-4 text-sm text-slate-600">{item.deskripsi}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
