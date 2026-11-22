'use client'

import { useState } from 'react'
import { KeyRound, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function GantiPasswordForm({ email }: { email: string }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  async function gantiSaya(event: React.FormEvent) {
    event.preventDefault()
    setNotice(null)
    if (password !== confirmPassword) {
      setNotice({ type: 'error', message: 'Konfirmasi password tidak cocok.' })
      return
    }
    if (password.length < 6) {
      setNotice({ type: 'error', message: 'Password minimal 6 karakter.' })
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
      setCurrentPassword('')
      setPassword('')
      setConfirmPassword('')
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
          <p className="text-sm text-slate-500">Perbarui password akun Anda sendiri.</p>
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
    </div>
  )
}
