import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  Receipt,
  Wallet,
} from 'lucide-react'
import { getSessionProfile } from '@/lib/auth'
import { getAnggotaSaya, getIuranSaya } from '@/lib/data'
import { badgeClass, formatCurrency, formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Iuran Saya | Tapak Suci',
  description:
    'Lihat tagihan iuran dan tanggungan yang belum dibayarkan oleh anggota.',
}

const lunas = (status: unknown) => String(status ?? '').toLowerCase() === 'lunas'
const jumlah = (rows: any[]) =>
  rows.reduce((total, row) => total + Number(row.jumlah ?? 0), 0)

export default async function IuranSayaPage() {
  const session = await getSessionProfile()
  if (!session) redirect('/login?next=%2Fdashboard%2Fiuran-saya')
  if (session.profile.role !== 'anggota') redirect('/dashboard')

  const anggota = await getAnggotaSaya(session.user.email ?? session.profile.email)
  const iuran = anggota ? await getIuranSaya(anggota.id) : []
  const belum = iuran.filter((row) => !lunas(row.status))
  const sudah = iuran.filter((row) => lunas(row.status))
  const daftar = [...iuran].sort((a, b) => {
    if (lunas(a.status) !== lunas(b.status)) return lunas(a.status) ? 1 : -1
    return String(b.created_at ?? '').localeCompare(String(a.created_at ?? ''))
  })

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-brand-100 bg-gradient-to-r from-brand-900 via-brand-700 to-[#3b0f0a] px-6 py-7 text-white sm:px-8">
        <div className="nusantara-motif absolute inset-0 opacity-80" />
        <div className="pointer-events-none absolute -right-10 -top-20 h-56 w-56 rounded-full bg-amber-400/25 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl">
            <Wallet size={22} />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300">
              Keuangan Anggota
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Iuran Saya
            </h1>
            <p className="mt-1 text-sm text-brand-100">
              Tagihan dan tanggungan iuran yang belum dibayarkan.
            </p>
          </div>
        </div>
      </div>

      {!anggota ? (
        <div className="card p-10 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-50 text-amber-600">
            <AlertCircle size={26} />
          </div>
          <h2 className="mt-4 text-lg font-bold text-slate-900">
            Data anggota belum tertaut
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600">
            Email akun Anda belum cocok dengan data anggota di portal. Silakan hubungi admin
            agar data anggota dan akun Anda disatukan, lalu tagihan iuran akan tampil di sini.
          </p>
          <Link href="/dashboard" className="btn-outline mt-5 inline-flex text-sm">
            Kembali ke Ringkasan <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="card p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-600">Belum dibayar</p>
                <Receipt size={18} className="text-amber-600" />
              </div>
              <p className="mt-3 text-3xl font-bold text-slate-900">{belum.length}</p>
              <p className="mt-1 text-xs text-slate-500">tagihan masih terbuka</p>
            </div>
            <div className="card p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-600">Total tagihan</p>
                <CircleDollarSign size={18} className="text-brand-600" />
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-900">
                {formatCurrency(jumlah(belum))}
              </p>
              <p className="mt-1 text-xs text-slate-500">yang belum dibayarkan</p>
            </div>
            <div className="card p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-600">Sudah lunas</p>
                <CheckCircle2 size={18} className="text-emerald-600" />
              </div>
              <p className="mt-3 text-3xl font-bold text-slate-900">{sudah.length}</p>
              <p className="mt-1 text-xs text-slate-500">
                {formatCurrency(jumlah(sudah))} telah dibayar
              </p>
            </div>
          </div>

          {belum.length > 0 && (
            <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="mt-0.5 shrink-0 text-amber-600" />
                <div>
                  <p className="text-sm font-bold text-amber-900">
                    Anda memiliki {belum.length} tagihan belum dibayar
                  </p>
                  <p className="mt-0.5 text-sm text-amber-800">
                    Total {formatCurrency(jumlah(belum))}. Hubungi pengurus untuk informasi
                    pembayaran.
                  </p>
                </div>
              </div>
            </div>
          )}

          <section className="card overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
              <h2 className="text-lg font-bold text-slate-900">Riwayat Iuran</h2>
              <p className="mt-1 text-sm text-slate-500">
                Daftar tagihan iuran untuk {anggota.nama} ({anggota.nip}).
              </p>
            </div>

            {daftar.length === 0 ? (
              <div className="p-10 text-center text-sm text-slate-500">
                Belum ada data iuran untuk akun ini.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {daftar.map((row) => (
                  <div
                    key={row.id}
                    className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-slate-900">{row.periode}</p>
                        <span className={`badge ${badgeClass(row.status)}`}>
                          {lunas(row.status) ? 'Lunas' : 'Belum Bayar'}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {row.tanggal_bayar
                          ? `Dibayar ${formatDate(row.tanggal_bayar)}`
                          : 'Belum ada tanggal pembayaran'}
                        {row.keterangan ? ` • ${row.keterangan}` : ''}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-slate-900">
                      {formatCurrency(row.jumlah)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}
