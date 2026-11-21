'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
  ImagePlus,
  Loader2,
  Pencil,
  Plus,
  Search,
  Send,
  ShieldAlert,
  Target,
  Trash2,
  Users,
  X,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { badgeClass, formatDate } from '@/lib/utils'
import {
  BULAN_OPTIONS,
  HARI_OPTIONS,
  JENIS_KHUSUS_OPTIONS,
  JENIS_UMUM_OPTIONS,
  STATUS_OPTIONS,
  jamSingkat,
  pilihKe,
  rentangTanggal,
  type CalonPenerima,
  type ProgramKhusus,
  type ProgramUmum,
} from '@/lib/program-latihan'
import type { Role } from '@/lib/types'

interface Props {
  umum: ProgramUmum[]
  khusus: ProgramKhusus[]
  calonPenerima: CalonPenerima[]
  role: Role
  currentUserId: string
}

interface FormState {
  judul: string
  jenis: string
  target: string
  tanggal_mulai: string
  tanggal_selesai: string
  hari: string[]
  bulan: string[]
  jam_mulai: string
  jam_selesai: string
  lokasi: string
  instruktur: string
  kuota: string
  status: string
  deskripsi: string
  gambar_url: string
  kirim_ke_semua: boolean
  penerima: string[]
}

type Tab = 'umum' | 'khusus'
type Notice = { type: 'sukses' | 'gagal'; text: string }

function formKosong(mode: Tab): FormState {
  return {
    judul: '',
    jenis: mode === 'umum' ? JENIS_UMUM_OPTIONS[0] : JENIS_KHUSUS_OPTIONS[0],
    target: '',
    tanggal_mulai: new Date().toISOString().slice(0, 10),
    tanggal_selesai: '',
    hari: [],
    bulan: [],
    jam_mulai: '',
    jam_selesai: '',
    lokasi: '',
    instruktur: '',
    kuota: '',
    status: 'Aktif',
    deskripsi: '',
    gambar_url: '',
    kirim_ke_semua: false,
    penerima: [],
  }
}

function formDariUmum(row: ProgramUmum): FormState {
  return {
    ...formKosong('umum'),
    judul: row.judul,
    jenis: row.jenis,
    target: row.target ?? '',
    tanggal_mulai: String(row.tanggal_mulai).slice(0, 10),
    tanggal_selesai: row.tanggal_selesai ? String(row.tanggal_selesai).slice(0, 10) : '',
    hari: pilihKe(HARI_OPTIONS, row.hari),
    bulan: [],
    jam_mulai: jamSingkat(row.jam_mulai) === '-' ? '' : jamSingkat(row.jam_mulai),
    jam_selesai: jamSingkat(row.jam_selesai) === '-' ? '' : jamSingkat(row.jam_selesai),
    lokasi: row.lokasi ?? '',
    instruktur: row.instruktur ?? '',
    kuota: row.kuota != null ? String(row.kuota) : '',
    status: row.status,
    deskripsi: row.deskripsi ?? '',
    gambar_url: row.gambar_url ?? '',
  }
}

function formDariKhusus(row: ProgramKhusus, penerima: string[]): FormState {
  return {
    ...formKosong('khusus'),
    judul: row.judul,
    jenis: row.jenis,
    target: row.target ?? '',
    tanggal_mulai: String(row.tanggal_mulai).slice(0, 10),
    tanggal_selesai: row.tanggal_selesai ? String(row.tanggal_selesai).slice(0, 10) : '',
    hari: pilihKe(HARI_OPTIONS, row.hari),
    bulan: pilihKe(BULAN_OPTIONS, row.bulan),
    jam_mulai: jamSingkat(row.jam_mulai) === '-' ? '' : jamSingkat(row.jam_mulai),
    jam_selesai: jamSingkat(row.jam_selesai) === '-' ? '' : jamSingkat(row.jam_selesai),
    lokasi: row.lokasi ?? '',
    instruktur: row.instruktur ?? '',
    status: row.status,
    deskripsi: row.deskripsi ?? '',
    gambar_url: row.gambar_url ?? '',
    kirim_ke_semua: row.kirim_ke_semua,
    penerima,
  }
}

function ChipPicker({
  options,
  value,
  onChange,
}: {
  options: string[]
  value: string[]
  onChange: (next: string[]) => void
}) {
  function toggle(option: string) {
    onChange(value.includes(option) ? value.filter((v) => v !== option) : [...value, option])
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const aktif = value.includes(option)
        return (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
              aktif
                ? 'border-brand-600 bg-brand-600 text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300'
            }`}
          >
            {aktif && <Check size={11} className="mr-1 inline" />}
            {option}
          </button>
        )
      })}
    </div>
  )
}

function Field({
  label,
  children,
  help,
  full,
}: {
  label: string
  children: React.ReactNode
  help?: string
  full?: boolean
}) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="label">{label}</label>
      {children}
      {help && <p className="mt-1 text-xs text-slate-500">{help}</p>}
    </div>
  )
}

export default function ProgramAdmin({
  umum,
  khusus,
  calonPenerima,
  role,
  currentUserId,
}: Props) {
  const [tab, setTab] = useState<Tab>('umum')
  const [rowsUmum, setRowsUmum] = useState(umum)
  const [rowsKhusus, setRowsKhusus] = useState(khusus)
  const [penerimaMap, setPenerimaMap] = useState<Record<string, string[]>>({})
  const [modal, setModal] = useState<{ mode: Tab; id: string | null } | null>(null)
  const [form, setForm] = useState<FormState>(formKosong('umum'))
  const [notice, setNotice] = useState<Notice | null>(null)
  const [menyimpan, setMenyimpan] = useState(false)
  const [mengunggah, setMengunggah] = useState(false)
  const [cariPenerima, setCariPenerima] = useState('')
  const router = useRouter()

  const bisaKhusus = role === 'admin'
  const totalPenerima = Object.values(penerimaMap).reduce((n, ids) => n + ids.length, 0)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('program_khusus_penerima')
      .select('program_id, profil_id')
      .then(({ data, error }) => {
        if (error || !data) return
        const map: Record<string, string[]> = {}
        data.forEach((row) => {
          map[row.program_id] = [...(map[row.program_id] ?? []), row.profil_id]
        })
        setPenerimaMap(map)
      })
  }, [])

  const calonTerfilter = useMemo(() => {
    const q = cariPenerima.trim().toLowerCase()
    if (!q) return calonPenerima
    return calonPenerima.filter((p) =>
      [p.full_name, p.email, p.jabatan].filter(Boolean).join(' ').toLowerCase().includes(q),
    )
  }, [calonPenerima, cariPenerima])

  function atur(field: keyof FormState, value: string | string[] | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function bukaForm(mode: Tab, row?: ProgramUmum | ProgramKhusus | null) {
    setNotice(null)
    setCariPenerima('')
    if (mode === 'umum') {
      setForm(row ? formDariUmum(row as ProgramUmum) : formKosong('umum'))
    } else {
      setForm(
        row
          ? formDariKhusus(row as ProgramKhusus, penerimaMap[row.id] ?? [])
          : formKosong('khusus'),
      )
    }
    setModal({ mode, id: row?.id ?? null })
  }

  async function unggahGambar(file: File) {
    setMengunggah(true)
    const supabase = createClient()
    const ext = file.name.split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'bin'
    const path = `program-latihan/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error } = await supabase.storage
      .from('media')
      .upload(path, file, { upsert: true, contentType: file.type })
    if (error) {
      setNotice({ type: 'gagal', text: `Gagal mengunggah gambar: ${error.message}` })
    } else {
      atur('gambar_url', supabase.storage.from('media').getPublicUrl(path).data.publicUrl)
    }
    setMengunggah(false)
  }

  async function simpan() {
    if (!modal) return
    if (!form.judul.trim() || !form.tanggal_mulai) {
      setNotice({ type: 'gagal', text: 'Judul dan tanggal mulai wajib diisi.' })
      return
    }
    setMenyimpan(true)
    setNotice(null)
    const supabase = createClient()
    const mode = modal.mode

    const data: Record<string, unknown> = {
      judul: form.judul.trim(),
      jenis: form.jenis,
      target: form.target.trim() || null,
      tanggal_mulai: form.tanggal_mulai,
      tanggal_selesai: form.tanggal_selesai || null,
      hari: form.hari.length ? form.hari.join(', ') : null,
      jam_mulai: form.jam_mulai || null,
      jam_selesai: form.jam_selesai || null,
      lokasi: form.lokasi.trim() || null,
      instruktur: form.instruktur.trim() || null,
      status: form.status,
      deskripsi: form.deskripsi.trim() || null,
      gambar_url: form.gambar_url || null,
    }
    if (mode === 'umum') {
      data.kuota = form.kuota ? Number(form.kuota) : null
    } else {
      data.bulan = form.bulan.length ? form.bulan.join(', ') : null
      data.kirim_ke_semua = form.kirim_ke_semua
    }

    let programId = modal.id
    let error: { message: string } | null = null

    if (programId) {
      const result = await supabase.from(mode === 'umum' ? 'program_latihan' : 'program_khusus')
        .update(data).eq('id', programId)
      error = result.error
    } else {
      const result = await supabase.from(mode === 'umum' ? 'program_latihan' : 'program_khusus')
        .insert({ ...data, created_by: currentUserId }).select('id').single()
      error = result.error
      programId = result.data?.id ?? null
    }

    if (error || !programId) {
      setNotice({ type: 'gagal', text: error?.message ?? 'Gagal menyimpan program.' })
      setMenyimpan(false)
      return
    }

    if (mode === 'khusus') {
      const lama = penerimaMap[programId] ?? []
      const hapus = lama.filter((id) => !form.penerima.includes(id))
      const tambah = form.penerima.filter((id) => !lama.includes(id))
      if (hapus.length) {
        await supabase.from('program_khusus_penerima').delete()
          .eq('program_id', programId).in('profil_id', hapus)
      }
      if (tambah.length) {
        await supabase.from('program_khusus_penerima').insert(
          tambah.map((profil_id) => ({ program_id: programId, profil_id })),
        )
      }
      setPenerimaMap((prev) => ({ ...prev, [programId!]: form.penerima }))
      setRowsKhusus((prev) => {
        const ada = prev.some((p) => p.id === programId)
        const ringkas = {
          ...formKosong('khusus'),
          id: programId!,
          judul: form.judul.trim(),
          jenis: form.jenis,
          target: form.target || null,
          tanggal_mulai: form.tanggal_mulai,
          tanggal_selesai: form.tanggal_selesai || null,
          hari: form.hari.join(', ') || null,
          bulan: form.bulan.join(', ') || null,
          jam_mulai: form.jam_mulai || null,
          jam_selesai: form.jam_selesai || null,
          lokasi: form.lokasi || null,
          instruktur: form.instruktur || null,
          kirim_ke_semua: form.kirim_ke_semua,
          status: form.status,
          deskripsi: form.deskripsi || null,
          gambar_url: form.gambar_url || null,
          created_by: currentUserId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as ProgramKhusus
        return ada
          ? prev.map((p) => (p.id === programId ? { ...p, ...ringkas } : p))
          : [ringkas, ...prev]
      })
    } else {
      const ringkas = {
        ...formKosong('umum'),
        id: programId,
        judul: form.judul.trim(),
        jenis: form.jenis,
        target: form.target || null,
        tanggal_mulai: form.tanggal_mulai,
        tanggal_selesai: form.tanggal_selesai || null,
        hari: form.hari.join(', ') || null,
        jam_mulai: form.jam_mulai || null,
        jam_selesai: form.jam_selesai || null,
        lokasi: form.lokasi || null,
        instruktur: form.instruktur || null,
        kuota: form.kuota ? Number(form.kuota) : null,
        status: form.status,
        deskripsi: form.deskripsi || null,
        gambar_url: form.gambar_url || null,
        created_by: currentUserId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as ProgramUmum
      setRowsUmum((prev) =>
        (prev.some((p) => p.id === programId)
          ? prev.map((p) => (p.id === programId ? { ...p, ...ringkas } : p))
          : [ringkas, ...prev]
        ).sort((a, b) => a.tanggal_mulai.localeCompare(b.tanggal_mulai)),
      )
    }

    setNotice({
      type: 'sukses',
      text: modal.id ? 'Perubahan program berhasil disimpan.' : 'Program baru berhasil dibuat.',
    })
    setMenyimpan(false)
    setModal(null)
    router.refresh()
  }

  async function hapus(mode: Tab, id: string, judul: string) {
    if (!window.confirm(`Hapus program "${judul}"?`)) return
    const supabase = createClient()
    const { error } = await supabase
      .from(mode === 'umum' ? 'program_latihan' : 'program_khusus')
      .delete().eq('id', id)
    if (error) {
      setNotice({ type: 'gagal', text: error.message })
      return
    }
    if (mode === 'umum') setRowsUmum((prev) => prev.filter((p) => p.id !== id))
    else setRowsKhusus((prev) => prev.filter((p) => p.id !== id))
    setNotice({ type: 'sukses', text: 'Program dihapus.' })
  }

  return (
    <div>
      <Link href="/dashboard" className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-700">
        <ArrowLeft size={16} /> Kembali ke ringkasan
      </Link>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
            Pembinaan Anggota
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Kelola Program Latihan</h1>
          <p className="mt-1 text-sm text-slate-600">
            Susun jadwal dan target latihan umum, serta kirim program khusus ke anggota tertentu.
          </p>
        </div>
        <Link href="/program-latihan" className="btn-outline text-sm" target="_blank">
          Lihat tampilan anggota <ArrowLeft size={15} className="rotate-180" />
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Program umum', value: rowsUmum.length, icon: CalendarDays, warna: 'text-brand-600' },
          { label: 'Program khusus', value: rowsKhusus.length, icon: Send, warna: 'text-amber-600' },
          { label: 'Penerima ditunjuk', value: totalPenerima, icon: Users, warna: 'text-sky-600' },
        ].map((stat) => (
          <div key={stat.label} className="card flex items-center gap-4 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50">
              <stat.icon size={20} className={stat.warna} />
            </div>
            <div>
              <p className="text-2xl font-bold leading-none text-slate-900">{stat.value}</p>
              <p className="mt-1 text-xs text-slate-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {notice && (
        <div
          className={`mt-5 flex items-start justify-between gap-3 rounded-xl px-4 py-3 text-sm ${
            notice.type === 'sukses'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          <span>{notice.text}</span>
          <button type="button" onClick={() => setNotice(null)} aria-label="Tutup notifikasi">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setTab('umum')}
          className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
            tab === 'umum'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Program Latihan Umum
        </button>
        <button
          type="button"
          onClick={() => setTab('khusus')}
          className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
            tab === 'khusus'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Program Latihan Khusus
        </button>
      </div>

      {tab === 'umum' ? (
        <section className="mt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-600">
              Dapat dilihat semua pengunjung. Dikelola oleh pengurus dan admin.
            </p>
            <button type="button" className="btn-primary text-sm" onClick={() => bukaForm('umum')}>
              <Plus size={16} /> Tambah program umum
            </button>
          </div>

          <div className="card table-wrap mt-4">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Program</th>
                  <th className="px-5 py-3 font-semibold">Jadwal</th>
                  <th className="px-5 py-3 font-semibold">Target</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rowsUmum.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                      Belum ada program umum.
                    </td>
                  </tr>
                )}
                {rowsUmum.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">{row.judul}</p>
                      <span className="badge mt-1 bg-brand-50 text-brand-700">{row.jenis}</span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      <p>{rentangTanggal(row.tanggal_mulai, row.tanggal_selesai)}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {row.hari || '-'} • {jamSingkat(row.jam_mulai)}–{jamSingkat(row.jam_selesai)}
                      </p>
                    </td>
                    <td className="max-w-[260px] px-5 py-4 text-slate-600">
                      {row.target || '-'}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`badge ${badgeClass(row.status)}`}>{row.status}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => bukaForm('umum', row)}
                        className="btn-outline px-2.5 py-1.5 text-xs"
                      >
                        <Pencil size={13} /> Ubah
                      </button>
                      <button
                        type="button"
                        onClick={() => hapus('umum', row.id, row.judul)}
                        className="btn-danger ml-2 px-2.5 py-1.5 text-xs"
                      >
                        <Trash2 size={13} /> Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <section className="mt-5">
          {!bisaKhusus ? (
            <div className="card flex items-start gap-3 bg-amber-50 p-5 text-sm text-amber-800">
              <ShieldAlert size={20} className="mt-0.5 shrink-0" />
              <p>
                Hanya <strong>admin</strong> yang dapat membuat, mengubah, dan menghapus program
                khusus. Pengurus dapat melihat daftar dan jumlah penerimanya.
              </p>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-600">
              Tentukan penerima: semua anggota atau beberapa akun tertentu. Hanya penerima yang
              melihat program ini.
            </p>
            <button
              type="button"
              className="btn-primary text-sm"
              disabled={!bisaKhusus}
              onClick={() => bukaForm('khusus')}
            >
              <Plus size={16} /> Tambah program khusus
            </button>
          </div>

          <div className="card table-wrap mt-4">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Program</th>
                  <th className="px-5 py-3 font-semibold">Rentang &amp; hari</th>
                  <th className="px-5 py-3 font-semibold">Penerima</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rowsKhusus.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                      Belum ada program khusus.
                    </td>
                  </tr>
                )}
                {rowsKhusus.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">{row.judul}</p>
                      <span className="badge mt-1 bg-amber-50 text-amber-700">{row.jenis}</span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      <p>{rentangTanggal(row.tanggal_mulai, row.tanggal_selesai)}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {row.hari || 'Semua hari'} • {row.bulan || 'Sepanjang tahun'}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      {row.kirim_ke_semua ? (
                        <span className="badge bg-sky-100 text-sky-700">Semua anggota</span>
                      ) : (
                        <span className="badge bg-slate-100 text-slate-600">
                          {(penerimaMap[row.id] ?? []).length} akun ditunjuk
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`badge ${badgeClass(row.status)}`}>{row.status}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        disabled={!bisaKhusus}
                        onClick={() => bukaForm('khusus', row)}
                        className="btn-outline px-2.5 py-1.5 text-xs disabled:opacity-40"
                      >
                        <Pencil size={13} /> Ubah
                      </button>
                      <button
                        type="button"
                        disabled={!bisaKhusus}
                        onClick={() => hapus('khusus', row.id, row.judul)}
                        className="btn-danger ml-2 px-2.5 py-1.5 text-xs disabled:opacity-40"
                      >
                        <Trash2 size={13} /> Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <form
            onSubmit={(event) => {
              event.preventDefault()
              simpan()
            }}
            className="card flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {modal.id ? 'Ubah' : 'Tambah'}{' '}
                  {modal.mode === 'umum' ? 'Program Latihan Umum' : 'Program Latihan Khusus'}
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  {modal.mode === 'umum'
                    ? 'Informasi ini tampil untuk semua pengunjung.'
                    : 'Informasi ini hanya tampil untuk penerima yang Anda pilih.'}
                </p>
              </div>
              <button type="button" onClick={() => setModal(null)} aria-label="Tutup">
                <X size={20} className="text-slate-400 hover:text-slate-700" />
              </button>
            </div>

            <div className="grid gap-4 overflow-y-auto px-6 py-5 sm:grid-cols-2">
              <Field label="Judul program" full>
                <input
                  className="input"
                  value={form.judul}
                  onChange={(e) => atur('judul', e.target.value)}
                  placeholder="Contoh: Latihan Dasar Pencak Silat"
                  required
                />
              </Field>

              <Field label="Jenis program">
                <select
                  className="input"
                  value={form.jenis}
                  onChange={(e) => atur('jenis', e.target.value)}
                >
                  {(modal.mode === 'umum' ? JENIS_UMUM_OPTIONS : JENIS_KHUSUS_OPTIONS).map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </Field>

              <Field label="Status">
                <select
                  className="input"
                  value={form.status}
                  onChange={(e) => atur('status', e.target.value)}
                >
                  {STATUS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </Field>

              <Field label="Tanggal mulai" help="Awal rentang pelaksanaan.">
                <input
                  type="date"
                  className="input"
                  value={form.tanggal_mulai}
                  onChange={(e) => atur('tanggal_mulai', e.target.value)}
                  required
                />
              </Field>

              <Field label="Tanggal selesai" help="Kosongkan jika hanya satu hari.">
                <input
                  type="date"
                  className="input"
                  value={form.tanggal_selesai}
                  onChange={(e) => atur('tanggal_selesai', e.target.value)}
                />
              </Field>

              <Field label="Hari" help="Pilih satu atau beberapa hari.">
                <ChipPicker
                  options={HARI_OPTIONS}
                  value={form.hari}
                  onChange={(next) => atur('hari', next)}
                />
              </Field>

              {modal.mode === 'khusus' && (
                <Field label="Bulan" help="Kosongkan untuk sepanjang tahun.">
                  <ChipPicker
                    options={BULAN_OPTIONS}
                    value={form.bulan}
                    onChange={(next) => atur('bulan', next)}
                  />
                </Field>
              )}

              <Field label="Jam mulai">
                <input
                  type="time"
                  className="input"
                  value={form.jam_mulai}
                  onChange={(e) => atur('jam_mulai', e.target.value)}
                />
              </Field>

              <Field label="Jam selesai">
                <input
                  type="time"
                  className="input"
                  value={form.jam_selesai}
                  onChange={(e) => atur('jam_selesai', e.target.value)}
                />
              </Field>

              <Field label="Lokasi">
                <input
                  className="input"
                  value={form.lokasi}
                  onChange={(e) => atur('lokasi', e.target.value)}
                  placeholder="Gedung / lapangan"
                />
              </Field>

              <Field label="Instruktur / penanggung jawab">
                <input
                  className="input"
                  value={form.instruktur}
                  onChange={(e) => atur('instruktur', e.target.value)}
                  placeholder="Nama pelatih"
                />
              </Field>

              {modal.mode === 'umum' && (
                <Field label="Kuota peserta">
                  <input
                    type="number"
                    min={0}
                    className="input"
                    value={form.kuota}
                    onChange={(e) => atur('kuota', e.target.value)}
                    placeholder="Contoh: 30"
                  />
                </Field>
              )}

              <Field label="Target program" full help="Tampil menonjol pada tampilan anggota.">
                <input
                  className="input"
                  value={form.target}
                  onChange={(e) => atur('target', e.target.value)}
                  placeholder="Contoh: Menguasai teknik dasar dan etika latihan"
                />
              </Field>

              <Field label="Deskripsi" full>
                <textarea
                  className="input min-h-[90px]"
                  value={form.deskripsi}
                  onChange={(e) => atur('deskripsi', e.target.value)}
                  placeholder="Penjelasan singkat mengenai program..."
                />
              </Field>

              <Field label="Gambar program" full help="Opsional. Format gambar akan tampil di kartu program.">
                <div className="flex flex-wrap items-center gap-3">
                  <label className="btn-outline cursor-pointer text-sm">
                    {mengunggah ? <Loader2 size={15} className="animate-spin" /> : <ImagePlus size={15} />}
                    Pilih gambar
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) unggahGambar(file)
                      }}
                    />
                  </label>
                  {form.gambar_url && (
                    <div className="flex items-center gap-2">
                      <img src={form.gambar_url} alt="Pratinjau" className="h-12 w-16 rounded object-cover" />
                      <button
                        type="button"
                        onClick={() => atur('gambar_url', '')}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Hapus
                      </button>
                    </div>
                  )}
                </div>
              </Field>

              {modal.mode === 'khusus' && (
                <div className="sm:col-span-2">
                  <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 accent-brand-600"
                      checked={form.kirim_ke_semua}
                      onChange={(e) => atur('kirim_ke_semua', e.target.checked)}
                    />
                    <span>
                      <span className="block text-sm font-semibold text-slate-800">
                        Kirim ke semua anggota
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-500">
                        Semua akun anggota akan melihat program ini, termasuk yang mendaftar
                        kemudian. Nonaktifkan untuk memilih beberapa akun saja.
                      </span>
                    </span>
                  </label>

                  <div className="mt-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="label mb-0">
                        Penerima tertentu{' '}
                        <span className="font-normal text-slate-500">
                          ({form.penerima.length} dipilih)
                        </span>
                      </label>
                      <div className="flex gap-2 text-xs">
                        <button
                          type="button"
                          className="font-semibold text-brand-700 hover:underline"
                          onClick={() => atur('penerima', calonPenerima.map((p) => p.id))}
                        >
                          Pilih semua
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          className="font-semibold text-slate-500 hover:underline"
                          onClick={() => atur('penerima', [])}
                        >
                          Kosongkan
                        </button>
                      </div>
                    </div>
                    <div className="relative mt-2">
                      <Search
                        size={15}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        className="input pl-9"
                        placeholder="Cari nama, email, atau jabatan..."
                        value={cariPenerima}
                        onChange={(e) => setCariPenerima(e.target.value)}
                      />
                    </div>
                    <div className="mt-2 max-h-56 space-y-1 overflow-y-auto rounded-xl border border-slate-200 p-2">
                      {calonTerfilter.length === 0 && (
                        <p className="p-3 text-center text-xs text-slate-500">
                          Tidak ada akun yang cocok.
                        </p>
                      )}
                      {calonTerfilter.map((p) => {
                        const dipilih = form.penerima.includes(p.id)
                        return (
                          <label
                            key={p.id}
                            className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                              dipilih ? 'bg-brand-50' : 'hover:bg-slate-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="h-4 w-4 accent-brand-600"
                              checked={dipilih}
                              onChange={(e) =>
                                atur(
                                  'penerima',
                                  e.target.checked
                                    ? [...form.penerima, p.id]
                                    : form.penerima.filter((id) => id !== p.id),
                                )
                              }
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate font-medium text-slate-800">
                                {p.full_name || (p.email ?? 'Tanpa nama')}
                              </span>
                              <span className="block truncate text-xs text-slate-500">
                                {p.email ?? '-'} {p.jabatan ? `• ${p.jabatan}` : ''}
                              </span>
                            </span>
                            <span className={`badge ${badgeClass(p.role)}`}>{p.role}</span>
                          </label>
                        )
                      })}
                    </div>
                    <p className="mt-1.5 text-xs text-slate-500">
                      Centang satu atau beberapa akun. Centangan disimpan saat program disimpan.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
              <p className="hidden text-xs text-slate-500 sm:block">
                Diperbarui {formatDate(new Date().toISOString())}
              </p>
              <div className="ml-auto flex gap-2">
                <button type="button" className="btn-outline text-sm" onClick={() => setModal(null)}>
                  Batal
                </button>
                <button type="submit" className="btn-primary text-sm" disabled={menyimpan}>
                  {menyimpan && <Loader2 size={15} className="animate-spin" />}
                  Simpan program
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
