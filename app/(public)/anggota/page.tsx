import { getAnggotaPublic } from '@/lib/data'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Data Anggota' }

export default async function AnggotaPage() {
  const anggota = await getAnggotaPublic()

  return (
    <div className="container-page py-12">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Organisasi</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">Data Anggota</h1>
      <p className="mt-2 text-slate-600">Anggota aktif dan struktur pengurus organisasi.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {anggota.length === 0 && <p className="text-sm text-slate-500">Belum ada data anggota.</p>}
        {anggota.map((item) => {
          const initials = String(item.nama ?? '')
            .split(' ')
            .slice(0, 2)
            .map((part) => part[0])
            .join('')
            .toUpperCase()
          return (
            <div key={item.id} className="card overflow-hidden text-center">
              <div className="h-36 w-full bg-gradient-to-br from-brand-100 to-brand-500">
                {item.foto_url ? (
                  <img src={item.foto_url} alt={item.nama} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center text-3xl font-bold text-white">
                    {initials}
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="font-bold text-slate-900">{item.nama}</p>
                <p className="mt-1 text-sm text-brand-700">{item.jabatan || 'Anggota'}</p>
                <p className="mt-1 text-xs text-slate-500">{item.jenjang || '-'} · {item.cabang || '-'}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
