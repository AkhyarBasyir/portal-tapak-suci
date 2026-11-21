'use client'

import { useState } from 'react'
import { Loader2, UserPlus } from 'lucide-react'

const JENJANG = ['Pengenal', 'Penggalang', 'Pembina', 'Muda', 'Madya', 'Utama', 'Pendekar']
const JABATAN = ['Ketua', 'Wakil Ketua', 'Sekretaris', 'Bendahara', 'Pelatih', 'Instruktur', 'Anggota']

const awal = {
  nip: '',
  nama: '',
  email: '',
  password: '',
  role: 'anggota',
  jenjang: 'Pengenal',
  jabatan: 'Anggota',
  cabang: '',
  telepon: '',
}

export default function TambahAnggotaForm() {
  const [form, setForm] = useState(awal)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  function ubah(name: keyof typeof awal, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function kirim(event: React.FormEvent) {
    event.preventDefault()
    setSaving(true)
    setNotice(null)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal menambah anggota.')
      setNotice({
        type: 'success',
        message: `Akun ${form.nama} berhasil dibuat${data.nip ? ` dengan NIP ${data.nip}` : ''}.`,
      })
      setForm(awal)
    } catch (error) {
      setNotice({
        type: 'error',
        message: error instanceof Error ? error.message : 'Gagal menambah anggota.',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-700">
          <UserPlus size={20} />
        </span>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Tambah Akun Anggota</h2>
          <p className="text-sm text-slate-500">
            Akun login, profil, dan data anggota dibuat sekaligus. Email langsung terverifikasi.
          </p>
        </div>
      </div>

      {notice && (
        <p
          className={`mt-5 rounded-xl px-4 py-3 text-sm ${
            notice.type === 'success'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {notice.message}
        </p>
      )}

      <form onSubmit={kirim} className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="text-sm">
          <span className="font-semibold text-slate-700">NIP / Nomor Anggota</span>
          <input
            className="input mt-1"
            value={form.nip}
            onChange={(e) => ubah('nip', e.target.value)}
            placeholder="Kosongkan untuk otomatis"
          />
        </label>
        <label className="text-sm">
          <span className="font-semibold text-slate-700">Nama Lengkap *</span>
          <input
            className="input mt-1"
            required
            value={form.nama}
            onChange={(e) => ubah('nama', e.target.value)}
          />
        </label>
        <label className="text-sm">
          <span className="font-semibold text-slate-700">Email *</span>
          <input
            className="input mt-1"
            required
            type="email"
            value={form.email}
            onChange={(e) => ubah('email', e.target.value)}
          />
        </label>
        <label className="text-sm">
          <span className="font-semibold text-slate-700">Password *</span>
          <input
            className="input mt-1"
            required
            type="password"
            minLength={6}
            value={form.password}
            onChange={(e) => ubah('password', e.target.value)}
            placeholder="Minimal 6 karakter"
          />
        </label>
        <label className="text-sm">
          <span className="font-semibold text-slate-700">Peran *</span>
          <select
            className="input mt-1"
            value={form.role}
            onChange={(e) => ubah('role', e.target.value)}
          >
            <option value="anggota">Anggota</option>
            <option value="pengurus">Pengurus</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <label className="text-sm">
          <span className="font-semibold text-slate-700">Jenjang</span>
          <select
            className="input mt-1"
            value={form.jenjang}
            onChange={(e) => ubah('jenjang', e.target.value)}
          >
            {JENJANG.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="font-semibold text-slate-700">Jabatan</span>
          <select
            className="input mt-1"
            value={form.jabatan}
            onChange={(e) => ubah('jabatan', e.target.value)}
          >
            {JABATAN.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="font-semibold text-slate-700">Cabang / Daerah</span>
          <input
            className="input mt-1"
            value={form.cabang}
            onChange={(e) => ubah('cabang', e.target.value)}
          />
        </label>
        <label className="text-sm sm:col-span-2">
          <span className="font-semibold text-slate-700">Telepon</span>
          <input
            className="input mt-1"
            value={form.telepon}
            onChange={(e) => ubah('telepon', e.target.value)}
          />
        </label>

        <div className="sm:col-span-2">
          <button type="submit" className="btn-primary inline-flex items-center gap-2" disabled={saving}>
            {saving ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
            {saving ? 'Menyimpan...' : 'Tambah Anggota'}
          </button>
        </div>
      </form>
    </div>
  )
}
