'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  KeyRound,
  Loader2,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Role } from '@/lib/types'
import { badgeClass } from '@/lib/utils'

interface Pengguna {
  id: string
  email: string | null
  full_name: string
  username: string | null
  role: Role
  jabatan: string | null
  telepon: string | null
}

interface FormPengguna {
  full_name: string
  email: string
  username: string
  password: string
  role: Role
  jabatan: string
  telepon: string
  buatAnggota: boolean
}

const awalForm: FormPengguna = {
  full_name: '',
  email: '',
  username: '',
  password: '',
  role: 'anggota',
  jabatan: '',
  telepon: '',
  buatAnggota: true,
}

const ROLE_LABEL: Record<Role, string> = {
  admin: 'Admin',
  pengurus: 'Pengurus',
  anggota: 'Anggota',
}

export default function UserManager({ role }: { role: Role }) {
  const supabase = useMemo(() => createClient(), [])
  const [rows, setRows] = useState<Pengguna[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Pengguna | null>(null)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormPengguna>(awalForm)
  const [passwordTarget, setPasswordTarget] = useState<Pengguna | null>(null)
  const [passwordBaru, setPasswordBaru] = useState('')
  const [passwordUlang, setPasswordUlang] = useState('')
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const query = supabase
      .from('profiles')
      .select('id, email, full_name, username, role, jabatan, telepon')
      .order('full_name')
    const { data, error } = role === 'pengurus'
      ? await query.eq('role', 'anggota')
      : await query

    if (error) {
      setNotice({ type: 'error', message: error.message })
    } else {
      setRows((data as Pengguna[]) ?? [])
    }
    setLoading(false)
  }, [supabase, role])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(() => {
    const sumber = role === 'pengurus' ? rows.filter((row) => row.role === 'anggota') : rows
    const query = search.trim().toLowerCase()
    if (!query) return sumber
    return sumber.filter((row) =>
      [row.full_name, row.email, row.username, row.jabatan, row.role]
        .some((value) => String(value ?? '').toLowerCase().includes(query)),
    )
  }, [rows, search, role])

  function ubah<K extends keyof FormPengguna>(name: K, value: FormPengguna[K]) {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function openCreate() {
    setEditing(null)
    setForm(awalForm)
    setNotice(null)
    setOpen(true)
  }

  function openEdit(row: Pengguna) {
    if (role === 'pengurus' && row.role !== 'anggota') return
    setEditing(row)
    setForm({
      full_name: row.full_name ?? '',
      email: row.email ?? '',
      username: row.username ?? '',
      password: '',
      role: role === 'pengurus' ? 'anggota' : row.role ?? 'anggota',
      jabatan: row.jabatan ?? '',
      telepon: row.telepon ?? '',
      buatAnggota: true,
    })
    setNotice(null)
    setOpen(true)
  }

  function openPassword(row: Pengguna) {
    if (role === 'pengurus' && row.role !== 'anggota') return
    setPasswordTarget(row)
    setPasswordBaru('')
    setPasswordUlang('')
    setNotice(null)
  }

  async function save(event: React.FormEvent) {
    event.preventDefault()
    setSaving(true)
    setNotice(null)

    try {
      if (!editing && form.password.length < 6) {
        throw new Error('Password minimal 6 karakter.')
      }
      if (editing && form.password && form.password.length < 6) {
        throw new Error('Password minimal 6 karakter.')
      }

      const payload: Record<string, any> = {
        full_name: form.full_name.trim(),
        email: form.email.trim().toLowerCase(),
        username: form.username.trim().toLowerCase(),
        role: form.role,
        jabatan: form.jabatan.trim(),
        telepon: form.telepon.trim(),
      }
      if (form.password) payload.password = form.password
      if (!editing) {
        payload.nama = form.full_name.trim()
        payload.buat_anggota = form.buatAnggota
      }

      const res = await fetch(
        editing ? `/api/admin/users/${editing.id}` : '/api/admin/users',
        {
          method: editing ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan pengguna.')

      setOpen(false)
      setNotice({
        type: 'success',
        message: editing
          ? `Pengguna ${form.full_name} berhasil diperbarui.`
          : `Pengguna ${form.full_name} berhasil ditambahkan.`,
      })
      await load()
    } catch (error) {
      setNotice({
        type: 'error',
        message: error instanceof Error ? error.message : 'Gagal menyimpan pengguna.',
      })
    } finally {
      setSaving(false)
    }
  }

  async function savePassword(event: React.FormEvent) {
    event.preventDefault()
    if (!passwordTarget) return
    setSaving(true)
    setNotice(null)

    try {
      if (passwordBaru.length < 6) throw new Error('Password minimal 6 karakter.')
      if (passwordBaru !== passwordUlang) throw new Error('Konfirmasi password tidak cocok.')

      const res = await fetch(`/api/admin/users/${passwordTarget.id}/password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordBaru }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal mengganti password.')

      setPasswordTarget(null)
      setNotice({
        type: 'success',
        message: `Password ${passwordTarget.full_name} berhasil diganti.`,
      })
    } catch (error) {
      setNotice({
        type: 'error',
        message: error instanceof Error ? error.message : 'Gagal mengganti password.',
      })
    } finally {
      setSaving(false)
    }
  }

  async function hapus(row: Pengguna) {
    const pesan = role === 'pengurus'
      ? `Hapus akun anggota ${row.full_name}? Data anggota yang tertaut juga akan dihapus.`
      : `Hapus akun ${row.full_name}?`
    if (!window.confirm(pesan)) return

    setSaving(true)
    setNotice(null)
    try {
      const res = await fetch(`/api/admin/users/${row.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal menghapus akun.')
      setNotice({
        type: 'success',
        message: `Akun ${row.full_name} berhasil dihapus.`,
      })
      await load()
    } catch (error) {
      setNotice({
        type: 'error',
        message: error instanceof Error ? error.message : 'Gagal menghapus akun.',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Pengguna & Hak Akses</h2>
          <p className="mt-1 text-sm text-slate-600">
            {role === 'admin'
              ? 'Tambah dan ubah pengguna (admin, pengurus, anggota), atur peran, serta ganti password.'
              : 'Kelola akun anggota: tambah, ubah data, ganti password, dan hapus akun. Akun admin/pengurus hanya dikelola admin.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              className="input w-52 pl-9"
              placeholder="Cari pengguna..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <button type="button" className="btn-primary" onClick={openCreate}>
            <Plus size={16} />
            {role === 'admin' ? 'Tambah Pengguna' : 'Tambah Anggota'}
          </button>
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
            Memuat pengguna...
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-slate-500">Belum ada pengguna.</p>
        ) : (
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Nama</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Username</th>
                <th className="px-4 py-3 font-semibold">Peran</th>
                <th className="px-4 py-3 font-semibold">Jabatan</th>
                <th className="px-4 py-3 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-medium text-slate-800">{row.full_name || '-'}</td>
                  <td className="px-4 py-3 text-slate-700">{row.email || '-'}</td>
                  <td className="px-4 py-3 text-slate-700">{row.username || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${badgeClass(row.role)}`}>
                      {ROLE_LABEL[row.role] ?? row.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{row.jabatan || '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        type="button"
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-brand-700"
                        title="Ubah pengguna"
                        onClick={() => openEdit(row)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-700"
                        title="Ganti password"
                        onClick={() => openPassword(row)}
                      >
                        <KeyRound size={16} />
                      </button>
                      <button
                        type="button"
                        className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                        title="Hapus akun"
                        disabled={saving}
                        onClick={() => hapus(row)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="flex items-center gap-2 text-xs text-slate-500">
        <ShieldCheck size={14} />
        {role === 'admin'
          ? 'Peran admin memiliki akses penuh, pengurus mengelola data, anggota melihat informasi.'
          : 'Pengurus hanya mengelola akun anggota. Akun admin dan pengurus tidak bisa ditambah, diubah, atau dihapus.'}
      </p>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 py-10">
          <form onSubmit={save} className="card w-full max-w-2xl p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                {editing
                  ? `Ubah ${editing.full_name}`
                  : role === 'admin' ? 'Tambah Pengguna' : 'Tambah Anggota'}
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
              <label className="text-sm sm:col-span-2">
                <span className="font-semibold text-slate-700">Nama Lengkap *</span>
                <input
                  className="input mt-1"
                  required
                  value={form.full_name}
                  onChange={(e) => ubah('full_name', e.target.value)}
                />
              </label>
              <label className="text-sm">
                <span className="font-semibold text-slate-700">Email *</span>
                <input
                  className="input mt-1"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => ubah('email', e.target.value)}
                />
              </label>
              <label className="text-sm">
                <span className="font-semibold text-slate-700">Username</span>
                <input
                  className="input mt-1"
                  value={form.username}
                  onChange={(e) => ubah('username', e.target.value)}
                  placeholder="Opsional, untuk login"
                />
              </label>
              <label className="text-sm">
                <span className="font-semibold text-slate-700">Peran *</span>
                {role === 'admin' ? (
                  <select
                    className="input mt-1"
                    value={form.role}
                    onChange={(e) => ubah('role', e.target.value as Role)}
                  >
                    <option value="anggota">Anggota</option>
                    <option value="pengurus">Pengurus</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  <input className="input mt-1 bg-slate-50" value="Anggota" readOnly />
                )}
              </label>
              <label className="text-sm">
                <span className="font-semibold text-slate-700">
                  Password {editing ? '(kosongkan jika tidak diubah)' : '*'}
                </span>
                <input
                  className="input mt-1"
                  type="password"
                  required={!editing}
                  minLength={6}
                  value={form.password}
                  onChange={(e) => ubah('password', e.target.value)}
                  placeholder="Minimal 6 karakter"
                />
              </label>
              <label className="text-sm">
                <span className="font-semibold text-slate-700">Jabatan</span>
                <input
                  className="input mt-1"
                  value={form.jabatan}
                  onChange={(e) => ubah('jabatan', e.target.value)}
                />
              </label>
              <label className="text-sm">
                <span className="font-semibold text-slate-700">Telepon</span>
                <input
                  className="input mt-1"
                  value={form.telepon}
                  onChange={(e) => ubah('telepon', e.target.value)}
                />
              </label>
            </div>

            {!editing && (
              <label className="mt-4 flex items-start gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={form.buatAnggota}
                  onChange={(e) => ubah('buatAnggota', e.target.checked)}
                />
                <span>
                  Buat juga data anggota (NIP otomatis). Aktifkan bila pengguna perlu muncul di
                  Data Anggota dan raport.
                </span>
              </label>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button type="button" className="btn-outline" onClick={() => setOpen(false)}>
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

      {passwordTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <form onSubmit={savePassword} className="card w-full max-w-md p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Ganti Password</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Password baru untuk {passwordTarget.full_name}.
                </p>
              </div>
              <button
                type="button"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                onClick={() => setPasswordTarget(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-4">
              <label className="text-sm">
                <span className="font-semibold text-slate-700">Password baru *</span>
                <input
                  className="input mt-1"
                  type="password"
                  required
                  minLength={6}
                  value={passwordBaru}
                  onChange={(e) => setPasswordBaru(e.target.value)}
                />
              </label>
              <label className="text-sm">
                <span className="font-semibold text-slate-700">Ulangi password baru *</span>
                <input
                  className="input mt-1"
                  type="password"
                  required
                  minLength={6}
                  value={passwordUlang}
                  onChange={(e) => setPasswordUlang(e.target.value)}
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                className="btn-outline"
                onClick={() => setPasswordTarget(null)}
              >
                Batal
              </button>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving && <Loader2 size={16} className="animate-spin" />}
                Simpan Password
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
