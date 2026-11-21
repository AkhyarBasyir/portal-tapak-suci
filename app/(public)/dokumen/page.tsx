import { Download, FileText } from 'lucide-react'
import { getMediaByType } from '@/lib/data'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Arsip Dokumen' }

export default async function DokumenPage() {
  const items = await getMediaByType('dokumen')

  return (
    <div className="container-page py-12">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Arsip</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">Dokumen</h1>
      <p className="mt-2 text-slate-600">AD/ART, pedoman, dan dokumen penting organisasi.</p>

      <div className="mt-8 space-y-3">
        {items.length === 0 && <p className="text-sm text-slate-500">Belum ada dokumen.</p>}
        {items.map((item) => (
          <div key={item.id} className="card flex items-center gap-4 p-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
              <FileText size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-900">{item.judul}</p>
              <p className="text-xs text-slate-500">
                {item.kategori || 'Umum'} · {formatDate(item.created_at)}
              </p>
              {item.keterangan && <p className="mt-1 text-sm text-slate-600">{item.keterangan}</p>}
            </div>
            <a
              href={item.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline shrink-0"
              download
            >
              <Download size={16} />
              Unduh
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
