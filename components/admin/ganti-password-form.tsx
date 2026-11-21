'use client'

import { useState } from 'react'
import { KeyRound, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export interface PilihanPengguna {
  id: string
  label: string
  email: string
}

export default function GantiPasswordForm({
  isAdmin,
  email,
  users,
}: {
  isAdmin: boolean
  email: string
  users: PilihanPengguna[]
}) {
  const [mode, setMode] = useState<'saya' | 'pengguna'>('saya')
  const [userId, setUserId] = useState(users[0]?.id ?? '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  function bersihkan() {
    setCurrentPassword('')
    setPassword('')
    setConfirmPassword('')
  }

  async function gantiSaya(event: React.FormEvent) {
    event.preventDefault()
    setNotice(null)
    if (password !== confirmPassword) {
      setNotice({ type: 'error', message: 'Konfirmasi password tidak cocok.' })
      return
    }
    setSaving(true)
    try {
      const supabase = createClient()
      const { error: signError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      })
      if (signError) throw new Error('Password saat ini tidak benar.')
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw new Error(error.message)
      setNotice({ type: 'success', message: 'Password Anda berhasil diperbarui.' })
      bersihkan()
    } catch (error) {
      setNotice({
        type: 'error',
        message: error instanceof Error ? error.message : 'Gagal mengganti password.',
      })
    } finally {
      setSaving(false)
    }
  }

  async function gantiPengguna(event: React.FormEvent) {
    event.preventDefault()
    setNotice(null)
    if (!userId) {
      setNotice({ type: 'error', message: 'Pilih pengguna terlebih dahulu.' })
      return
    }
    if (password !== confirmPassword) {
      setNotice({ type: 'error', message: 'Konfirmasi password tidak cocok.' })
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/users/${userId}/password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal mengganti password.')
      const dipilih = users.find((item) => item.id === userId)
      setNotice({
        type: 'success',
        message: `Password ${dipilih?.label ?? 'pengguna'} berhasil diganti.`,
      })
      bersihkan()
    } catch (error) {
      setNotice({
        type: 'error',
        message: error instanceof Error ? error.message : 'Gagal mengganti password.',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-700">
          <KeyRound size={20} />
        </span>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Ganti Password</h2>
          <p className="text-sm text-slate-500">
            Perbarui password akun Anda sendiri{isAdmin ? ' atau password akun anggota/admin lain.' : '.'}
          </p>
        </div>
      </div>

      {isAdmin && (
        <div className="mt-6 inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            onClick={() => {
              setMode('saya')
              setNotice(null)
            }}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${
              mode === 'saya' ? 'bg-brand-600 text-white' : 'text-slate-600'
            }`}
          >
            Password saya
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('pengguna')
              setNotice(null)
            }}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${
              mode === 'pengguna' ? 'bg-brand-600 text-white' : 'text-slate-600'
            }`}
          >
            Password pengguna
          </button>
        </div>
      )}

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

      {mode === 'saya' ? (
        <form onSubmit={gantiSaya} className="mt-6 grid gap-4">
          <label className="text-sm">
            <span className="font-semibold text-slate-700">Email akun</span>
            <input className="input mt-1 bg-slate-50" value={email} readOnly />
          </label>
          <label className="text-sm">
            <span className="font-semibold text-slate-700">Password saat ini *</span>
            <input
              className="input mt-1"
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </label>
          <label className="text-sm">
            <span className="font-semibold text-slate-700">Password baru *</span>
            <input
              className="input mt-1"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <label className="text-sm">
            <span className="font-semibold text-slate-700">Ulangi password baru *</span>
            <input
              className="input mt-1"
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>
          <div>
            <button type="submit" className="btn-primary inline-flex items-center gap-2" disabled={saving}>
              {saving ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />}
              {saving ? 'Menyimpan...' : 'Perbarui Password Saya'}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={gantiPengguna} className="mt-6 grid gap-4">
          <label className="text-sm">
            <span className="font-semibold text-slate-700">Pengguna *</span>
            <select
              className="input mt-1"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            >
              {users.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label} — {item.email}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="font-semibold text-slate-700">Password baru *</span>
            <input
              className="input mt-1"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <label className="text-sm">
            <span className="font-semibold text-slate-700">Ulangi password baru *</span>
            <input
              className="input mt-1"
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>
          <div>
            <button type="submit" className="btn-primary inline-flex items-center gap-2" disabled={saving}>
              {saving ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />}
              {saving ? 'Menyimpan...' : 'Ganti Password Pengguna'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
