'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { CRUD_CONFIGS } from '@/lib/crud-config'
import type { ColumnConfig, FieldConfig } from '@/components/crud/types'
import type { Role } from '@/lib/types'
import { badgeClass, formatCurrency, formatDate, slugify } from '@/lib/utils'

export default function CrudManager({
  configKey,
  role,
}: {
  configKey: string
  role: Role
}) {
  const config = CRUD_CONFIGS[configKey]
  const supabase = useMemo(() => createClient(), [])

  const [rows, setRows] = useState<Record<string, any>[]>([])
  const [relations, setRelations] = useState<Record<string, Record<string, string>>>({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Record<string, any> | null>(null)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Record<string, any>>({})
  const [saving, setSaving] = useState(false)
  const [uploadingField, setUploadingField] = useState<string | null>(null)
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const canWrite =
    role === 'admin' || (role === 'pengurus' && config.minRole === 'pengurus')
  const canDelete =
    !config.hideDelete &&
    (role === 'admin' || (role === 'pengurus' && config.deleteRole === 'pengurus'))

  const load = useCallback(async () => {
    if (!config) return
    setLoading(true)
    const { data, error } = await supabase
      .from(config.table)
      .select('*')
      .order(config.orderBy ?? 'created_at', { ascending: config.ascending ?? false })
      .limit(300)

    if (error) {
      setNotice({ type: 'error', message: error.message })
    } else {
      setRows((data as Record<string, any>[]) ?? [])
    }
    setLoading(false)
  }, [config, supabase])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!config) return
    config.fields.filter((field) => field.relation).forEach(async (field) => {
      const relation = field.relation!
      const { data } = await supabase
        .from(relation.table)
        .select(`${relation.value}, ${relation.label}`)
        .order(relation.label)

      const map: Record<string, string> = {}
      ;(data ?? []).forEach((item: any) => {
        map[String(item[relation.value])] = String(item[relation.label])
      })
      setRelations((prev) => ({ ...prev, [field.name]: map }))
    })
  }, [config, supabase])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return rows
    return rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value ?? '').toLowerCase().includes(query),
      ),
    )
  }, [rows, search])

  if (!config) return <p>Konfigurasi tidak ditemukan.</p>

  function initialForm(): Record<string, any> {
    const values: Record<string, any> = {}
    config.fields.forEach((field) => {
      values[field.name] = field.type === 'select' ? field.options?.[0]?.value ?? '' : ''
    })
    if (config.key === 'anggota') values.status = 'Aktif'
    if (config.key === 'kegiatan') {
      values.jenis = 'Latihan'
      values.status = 'Akan Datang'
    }
    if (config.key === 'berita') values.status = 'draft'
    if (config.key === 'media') values.tipe = 'galeri'
    if (config.key === 'keuangan') {
      values.jenis = 'masuk'
      values.tanggal = new Date().toISOString().slice(0, 10)
    }
    if (config.key === 'iuran') values.status = 'belum'
    if (config.key === 'beranda_konten') {
      values.status = 'Aktif'
      values.urutan = 0
    }
    if (config.key === 'sanggar_fokus') {
      values.status = 'Aktif'
      values.urutan = 0
      values.ikon = 'Sparkles'
    }
    if (config.key === 'sanggar_penampilan') {
      values.status = 'Aktif'
      values.jenis = 'Sendratari'
      values.tanggal_mulai = new Date().toISOString().slice(0, 10)
    }
    if (config.key === 'prestasi') {
      values.status = 'Aktif'
      values.kategori = 'Gelanggang'
      values.tingkat = 'Cabang'
      values.tanggal = new Date().toISOString().slice(0, 10)
      values.urutan = 0
    }
    if (config.key === 'raport_atlet') {
      values.status = 'Terbit'
      values.tanggal = new Date().toISOString().slice(0, 10)
      values.skor_keseluruhan = 0
      values.kehadiran_persen = 0
    }
    if (config.key === 'raport_pengukuran') {
      values.catatan = ''
    }
    if (
      config.key === 'raport_performa' ||
      config.key === 'raport_prestasi' ||
      config.key === 'raport_kepribadian'
    ) {
      values.nilai = 0
      values.urutan = 0
      values.tanggal = new Date().toISOString().slice(0, 10)
    }
    return values
  }

  function openCreate() {
    setEditing(null)
    setForm(initialForm())
    setNotice(null)
    setOpen(true)
  }

  function openEdit(row: Record<string, any>) {
    const values: Record<string, any> = { ...row }
    config.fields.forEach((field) => {
      if (field.type === 'date' && values[field.name]) {
        values[field.name] = String(values[field.name]).slice(0, 10)
      }
      if (values[field.name] == null) values[field.name] = ''
    })
    setEditing(row)
    setForm(values)
    setNotice(null)
    setOpen(true)
  }

  async function uploadFile(field: FieldConfig, file: File) {
    const bucket = field.bucket ?? 'media'
    const extension =
      file.name.split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'bin'
    const path = `${config.key}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`

    setUploadingField(field.name)
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: true, contentType: file.type })
      if (error) throw new Error(error.message)

      if (bucket === 'bukti') return path
      const { data } = supabase.storage.from(bucket).getPublicUrl(path)
      return data.publicUrl
    } finally {
      setUploadingField(null)
    }
  }

  async function save(event: React.FormEvent) {
    event.preventDefault()
    setSaving(true)
    setNotice(null)

    try {
      const payload: Record<string, any> = {}
      config.fields.forEach((field) => {
        let value = form[field.name]
        if (field.type === 'number') {
          value = value === '' || value == null ? null : Number(value)
        }
        if (field.type === 'date' && value === '') value = null
        if ((field.type === 'select' || field.type === 'relation') && value === '') value = null
        payload[field.name] = value
      })

      if (config.key === 'berita') {
        payload.slug = form.slug
          ? slugify(String(form.slug))
          : slugify(String(form.judul ?? ''))
        if (!payload.slug) throw new Error('Judul wajib diisi.')
        if (payload.status === 'published' && !form.published_at) {
          payload.published_at = new Date().toISOString().slice(0, 10)
        }
      }

      const result = editing
        ? await supabase.from(config.table).update(payload).eq('id', editing.id)
        : await supabase.from(config.table).insert(payload)

      if (result.error) throw new Error(result.error.message)

      setOpen(false)
      setNotice({
        type: 'success',
        message: editing ? 'Data berhasil diperbarui.' : 'Data berhasil ditambahkan.',
      })
      await load()
    } catch (error: any) {
      setNotice({
        type: 'error',
        message: error?.message ?? 'Gagal menyimpan data.',
      })
    } finally {
      setSaving(false)
    }
  }

  async function remove(row: Record<string, any>) {
    if (!canDelete) return
    if (!window.confirm(`Hapus data "${row.nama ?? row.judul ?? row.id}"?`)) return

    const { error } = await supabase.from(config.table).delete().eq('id', row.id)
    if (error) {
      setNotice({ type: 'error', message: error.message })
    } else {
      setNotice({ type: 'success', message: 'Data berhasil dihapus.' })
      await load()
    }
  }

  function renderCell(row: Record<string, any>, column: ColumnConfig) {
    const value = row[column.name]
    if (column.type === 'currency') return formatCurrency(value)
    if (column.type === 'date') return formatDate(value)
    if (column.type === 'badge') {
      return (
        <span className={`badge ${badgeClass(value)}`}>{String(value ?? '-')}</span>
      )
    }
    if (column.type === 'relation') {
      return relations[column.name]?.[String(value)] ?? '-'
    }
    const text = String(value ?? '-')
    return text.length > 60 ? `${text.slice(0, 60)}…` : text
  }

  function renderField(field: FieldConfig) {
    const value = form[field.name] ?? ''
    const options =
      field.options ??
      Object.entries(relations[field.name] ?? {}).map(([optionValue, label]) => ({
        value: optionValue,
        label,
      }))

    return (
      <div key={field.name}>
        <label className="label" htmlFor={`field-${field.name}`}>
          {field.label}
          {field.required && <span className="ml-1 text-red-500">*</span>}
        </label>

        {field.type === 'textarea' ? (
          <textarea
            id={`field-${field.name}`}
            className="input min-h-[110px]"
            value={value}
            placeholder={field.placeholder}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, [field.name]: event.target.value }))
            }
          />
        ) : field.type === 'select' || field.type === 'relation' ? (
          <select
            id={`field-${field.name}`}
            className="input"
            value={value}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, [field.name]: event.target.value }))
            }
          >
            <option value="">-- Pilih --</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : field.type === 'image' || field.type === 'file' ? (
          <div>
            <label
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-sm text-slate-600 hover:border-brand-400"
              htmlFor={`field-${field.name}`}
            >
              {uploadingField === field.name ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <UploadCloud size={18} />
              )}
              {uploadingField === field.name
                ? 'Mengunggah...'
                : field.type === 'image'
                  ? 'Pilih gambar'
                  : 'Pilih file'}
            </label>
            <input
              id={`field-${field.name}`}
              type="file"
              accept={field.type === 'image' ? 'image/*' : undefined}
              className="hidden"
              disabled={saving}
              onChange={async (event) => {
                const file = event.target.files?.[0]
                if (!file) return
                try {
                  const url = await uploadFile(field, file)
                  setForm((prev) => ({ ...prev, [field.name]: url }))
                } catch (error: any) {
                  setNotice({ type: 'error', message: error.message })
                }
              }}
            />
            {field.type === 'image' && String(value).startsWith('http') && (
              <img
                src={String(value)}
                alt="Pratinjau"
                className="mt-2 h-24 w-32 rounded-lg object-cover"
              />
            )}
            {value && !String(value).startsWith('http') && (
              <p className="mt-1 truncate text-xs text-emerald-600">
                File tersimpan: {String(value).split('/').pop()}
              </p>
            )}
          </div>
        ) : (
          <input
            id={`field-${field.name}`}
            className="input"
            type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
            value={value}
            placeholder={field.placeholder}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, [field.name]: event.target.value }))
            }
          />
        )}
        {field.help && <p className="mt-1 text-xs text-slate-500">{field.help}</p>}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{config.title}</h2>
          {config.description && (
            <p className="mt-1 text-sm text-slate-600">{config.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              className="input w-52 pl-9"
              placeholder="Cari data..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          {canWrite && !config.disableCreate && (
            <button type="button" className="btn-primary" onClick={openCreate}>
              <Plus size={16} />
              Tambah
            </button>
          )}
        </div>
      </div>

      {notice && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            notice.type === 'success'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {notice.message}
        </div>
      )}

      <div className="card table-wrap">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500">
            <Loader2 size={18} className="animate-spin" />
            Memuat data...
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-slate-500">Belum ada data.</p>
        ) : (
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                {config.columns.map((column) => (
                  <th key={column.name} className="px-4 py-3 font-semibold">
                    {column.label}
                  </th>
                ))}
                {(canWrite || canDelete) && (
                  <th className="px-4 py-3 text-right font-semibold">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((row) => (
                <tr key={String(row.id)} className="hover:bg-slate-50/70">
                  {config.columns.map((column) => (
                    <td key={column.name} className="px-4 py-3 text-slate-700">
                      {renderCell(row, column)}
                    </td>
                  ))}
                  {(canWrite || canDelete) && (
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-2">
                        {canWrite && (
                          <button
                            type="button"
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-brand-700"
                            title="Ubah"
                            onClick={() => openEdit(row)}
                          >
                            <Pencil size={16} />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            type="button"
                            className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                            title="Hapus"
                            onClick={() => remove(row)}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 py-10">
          <form
            onSubmit={save}
            className="card w-full max-w-2xl p-6"
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                {editing ? `Ubah ${config.singular}` : `Tambah ${config.singular}`}
              </h3>
              <button
                type="button"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                onClick={() => setOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {config.fields.map(renderField)}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                className="btn-outline"
                onClick={() => setOpen(false)}
              >
                Batal
              </button>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving && <Loader2 size={16} className="animate-spin" />}
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
