'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  CalendarDays,
  CalendarRange,
  Check,
  CheckCircle2,
  Clock3,
  Dumbbell,
  Lock,
  MapPin,
  Search,
  ShieldCheck,
  Target,
  UserRound,
  Users,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { badgeClass, formatDate } from '@/lib/utils'
import {
  jamSingkat,
  rentangTanggal,
  type PenerimaProgram,
  type ProgramKhusus,
  type ProgramUmum,
} from '@/lib/program-latihan'
import type { Role } from '@/lib/types'

interface Props {
  umum: ProgramUmum[]
  khusus: ProgramKhusus[]
  penerima: PenerimaProgram[]
  profile: { id: string; full_name: string; role: Role } | null
  mode?: 'dashboard'
}

type Tab = 'umum' | 'khusus'

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays
  label: string
  value: string | null
}) {
  if (!value || value === '-') return null
  return (
    <div className="flex items-start gap-2 text-sm text-slate-600">
      <Icon size={16} className="mt-0.5 shrink-0 text-brand-500" />
      <span>
        <span className="text-slate-600">{label}: </span>
        <span className="font-medium text-slate-700">{value}</span>
      </span>
    </div>
  )
}

export default function ProgramLatihanView({ umum, khusus, penerima, profile, mode }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('umum')
  const [jenis, setJenis] = useState('Semua')
  const [query, setQuery] = useState('')
  const [dibaca, setDibaca] = useState<Record<string, string | null>>(
    Object.fromEntries(penerima.map((item) => [item.program_id, item.dibaca_at])),
  )
  const [menyimpan, setMenyimpan] = useState<string | null>(null)

  const daftarJenis = useMemo(
    () => ['Semua', ...Array.from(new Set(umum.map((item) => item.jenis).filter(Boolean)))],
    [umum],
  )

  const umumTerfilter = useMemo(() => {
    const q = query.trim().toLowerCase()
    return umum.filter((item) => {
      const cocokJenis = jenis === 'Semua' || item.jenis === jenis
      const cocokTeks =
        !q ||
        [item.judul, item.jenis, item.target, item.deskripsi, item.lokasi, item.instruktur]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(q)
      return cocokJenis && cocokTeks
    })
  }, [umum, jenis, query])

  const totalKuota = umum.reduce((total, item) => total + (item.kuota ?? 0), 0)
  const belumDibaca = khusus.filter((item) => {
    const id = profile?.id
    return id && penerima.some((p) => p.program_id === item.id && p.profil_id === id && !p.dibaca_at)
  }).length

  async function tandaiDibaca(programId: string) {
    if (!profile) return
    setMenyimpan(programId)
    const supabase = createClient()
    const { error } = await supabase
      .from('program_khusus_penerima')
      .update({ dibaca_at: new Date().toISOString() })
      .eq('program_id', programId)
      .eq('profil_id', profile.id)
    if (!error) {
      setDibaca((prev) => ({ ...prev, [programId]: new Date().toISOString() }))
      router.refresh()
    }
    setMenyimpan(null)
  }

  return (
    <div className={mode === 'dashboard' ? '' : 'bg-slate-50'}>
      {/* Hero */}
      {mode !== 'dashboard' && (
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 text-white">
        <div className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full border-[40px] border-white/5" />
        <div className="pointer-events-none absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-white/5" />
        <div className="container-page relative py-14 sm:py-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                Pembinaan Anggota
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Program Latihan Tapak Suci
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-white/80 sm:text-base">
                Lihat jadwal latihan, keberagaman program, dan target yang ingin dicapai.
                Program khusus ditampilkan hanya untuk anggota yang ditunjuk oleh admin.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:gap-5">
              {[
                { label: 'Program umum', value: umum.length, icon: Dumbbell },
                { label: 'Jenis latihan', value: daftarJenis.length - 1, icon: CalendarRange },
                { label: 'Total kuota', value: totalKuota, icon: Users },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm"
                >
                  <stat.icon size={18} className="text-white/70" />
                  <p className="mt-2 text-2xl font-bold leading-none">{stat.value}</p>
                  <p className="mt-1 text-xs text-white/70">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      )}

      <div className={mode === 'dashboard' ? '' : 'container-page py-10'}>
        {/* Tab */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setTab('umum')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                tab === 'umum' ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Dumbbell size={16} /> Program Umum
            </button>
            {profile && (
              <button
                type="button"
                onClick={() => setTab('khusus')}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  tab === 'khusus' ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ShieldCheck size={16} /> Program Khusus
                {belumDibaca > 0 && (
                  <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-bold text-brand-700">
                    {belumDibaca}
                  </span>
                )}
              </button>
            )}
          </div>
          {(profile?.role === 'admin' || profile?.role === 'pengurus') && (
            <Link href="/dashboard/program-latihan" className="btn-outline text-sm">
              Kelola program <ArrowRight size={15} />
            </Link>
          )}
        </div>

        {tab === 'umum' ? (
          <section className="mt-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Macam-macam Program Latihan</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Pilih jenis program untuk melihat jadwal dan targetnya.
                </p>
              </div>
              <div className="relative w-full lg:max-w-xs">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                />
                <input
                  type="search"
                  className="input pl-9"
                  placeholder="Cari program..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {daftarJenis.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setJenis(item)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    jenis === item
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {umumTerfilter.length === 0 ? (
              <div className="card mt-6 p-10 text-center text-sm text-slate-500">
                Belum ada program yang cocok.
              </div>
            ) : (
              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                {umumTerfilter.map((item) => (
                  <article
                    key={item.id}
                    className="card group overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    {item.gambar_url && (
                      <img
                        src={item.gambar_url}
                        alt={item.judul}
                        className="h-40 w-full object-cover"
                      />
                    )}
                    <div className="p-6">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="badge bg-brand-50 text-brand-700">{item.jenis}</span>
                        <span className={`badge ${badgeClass(item.status)}`}>{item.status}</span>
                      </div>
                      <h3 className="mt-3 text-lg font-bold text-slate-900">{item.judul}</h3>

                      <div className="mt-4 grid gap-2 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
                        <Detail
                          icon={CalendarDays}
                          label="Rentang"
                          value={rentangTanggal(item.tanggal_mulai, item.tanggal_selesai)}
                        />
                        <Detail icon={CalendarRange} label="Hari" value={item.hari} />
                        <Detail
                          icon={Clock3}
                          label="Jam"
                          value={`${jamSingkat(item.jam_mulai)} – ${jamSingkat(item.jam_selesai)}`}
                        />
                        <Detail icon={MapPin} label="Lokasi" value={item.lokasi} />
                        <Detail icon={UserRound} label="Instruktur" value={item.instruktur} />
                        <Detail
                          icon={Users}
                          label="Kuota"
                          value={item.kuota != null ? `${item.kuota} peserta` : null}
                        />
                      </div>

                      {item.target && (
                        <div className="mt-4 flex gap-2 rounded-xl border border-brand-100 bg-brand-50/60 p-3">
                          <Target size={17} className="mt-0.5 shrink-0 text-brand-600" />
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wide text-brand-700">
                              Target program
                            </p>
                            <p className="mt-0.5 text-sm text-slate-700">{item.target}</p>
                          </div>
                        </div>
                      )}

                      {item.deskripsi && (
                        <p className="mt-4 text-sm leading-relaxed text-slate-600">{item.deskripsi}</p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : (
          <section className="mt-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Program Khusus Anda</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Program yang ditujukan khusus kepada Anda oleh admin.
                </p>
              </div>
              {profile && profile.role !== 'anggota' && (
                <span className="badge bg-amber-100 text-amber-700">
                  Melihat sebagai {profile.role}
                </span>
              )}
            </div>

            {!profile ? (
              <div className="card mt-6 flex flex-col items-center gap-4 p-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                  <Lock size={26} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Perlu masuk ke akun Anda</h3>
                  <p className="mx-auto mt-1 max-w-md text-sm text-slate-600">
                    Program khusus hanya dapat dilihat oleh anggota yang telah ditunjuk.
                    Masuk dengan akun Anda untuk melihatnya.
                  </p>
                </div>
                <Link
                  href="/login?next=%2Fdashboard%2Fprogram-saya"
                  className="btn-primary"
                >
                  Masuk ke akun Anda <ArrowRight size={16} />
                </Link>
              </div>
            ) : khusus.length === 0 ? (
              <div className="card mt-6 p-10 text-center text-sm text-slate-500">
                Belum ada program khusus untuk akun Anda saat ini.
              </div>
            ) : (
              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                {khusus.map((item) => {
                  const penerimaSaya = penerima.find((p) => p.program_id === item.id)
                  const sudahDibaca = Boolean(penerimaSaya && dibaca[item.id])
                  return (
                    <article
                      key={item.id}
                      className="card overflow-hidden border-brand-200 ring-1 ring-brand-100"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 bg-gradient-to-r from-brand-50 to-white px-6 py-3">
                        <span className="badge bg-brand-600 text-white">{item.jenis}</span>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="badge bg-sky-100 text-sky-700">
                            {item.kirim_ke_semua ? 'Semua anggota' : 'Khusus ditunjuk'}
                          </span>
                          <span className={`badge ${badgeClass(item.status)}`}>{item.status}</span>
                        </div>
                      </div>
                      {item.gambar_url && (
                        <img
                          src={item.gambar_url}
                          alt={item.judul}
                          className="h-36 w-full object-cover"
                        />
                      )}
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-slate-900">{item.judul}</h3>
                        <div className="mt-4 grid gap-2 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
                          <Detail
                            icon={CalendarDays}
                            label="Rentang tanggal"
                            value={rentangTanggal(item.tanggal_mulai, item.tanggal_selesai)}
                          />
                          <Detail icon={CalendarRange} label="Hari" value={item.hari} />
                          <Detail icon={CalendarDays} label="Bulan" value={item.bulan} />
                          <Detail
                            icon={Clock3}
                            label="Jam"
                            value={`${jamSingkat(item.jam_mulai)} – ${jamSingkat(item.jam_selesai)}`}
                          />
                          <Detail icon={MapPin} label="Lokasi" value={item.lokasi} />
                          <Detail icon={UserRound} label="Instruktur" value={item.instruktur} />
                        </div>
                        {item.target && (
                          <div className="mt-4 flex gap-2 rounded-xl border border-brand-100 bg-brand-50/60 p-3">
                            <Target size={17} className="mt-0.5 shrink-0 text-brand-600" />
                            <p className="text-sm text-slate-700">
                              <span className="font-bold text-brand-700">Target: </span>
                              {item.target}
                            </p>
                          </div>
                        )}
                        {item.deskripsi && (
                          <p className="mt-4 text-sm leading-relaxed text-slate-600">
                            {item.deskripsi}
                          </p>
                        )}
                        <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                          <span className="text-xs text-slate-600">
                            {formatDate(item.created_at)}
                          </span>
                          {penerimaSaya && (
                            <button
                              type="button"
                              disabled={sudahDibaca || menyimpan === item.id}
                              onClick={() => tandaiDibaca(item.id)}
                              className={`btn text-xs ${
                                sudahDibaca
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-brand-600 text-white hover:bg-brand-700'
                              }`}
                            >
                              {sudahDibaca ? (
                                <>
                                  <CheckCircle2 size={14} /> Sudah dibaca
                                </>
                              ) : (
                                <>
                                  <Check size={14} /> Tandai sudah dibaca
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}
