'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/dashboard'
  const roleParam = searchParams.get('role')
  const roleLabels: Record<string, string> = {
    admin: 'Admin',
    pengurus: 'Pengurus',
    anggota: 'Anggota',
  }
  const roleLabel = roleParam ? roleLabels[roleParam] : null

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    // Username dan email keduanya diterima. Jika input bukan email,
    // resolver database mencari email berdasarkan username.
    const { data: resolvedEmail, error: resolveError } = await supabase.rpc(
      'email_for_login',
      { identifier: identifier.trim() },
    )

    if (resolveError || !resolvedEmail) {
      setError('Username atau email tidak ditemukan.')
      setLoading(false)
      return
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: resolvedEmail,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    router.push(next)
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="card p-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Selamat datang</p>
      <h1 className="mt-1 text-2xl font-bold text-slate-900">Masuk ke Akun</h1>
      <p className="mt-2 text-sm text-slate-600">Gunakan username atau email dan kata sandi yang terdaftar.</p>

      {roleLabel && (
        <div className="mt-4 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-900">
          Pilihan Anda: <strong>Masuk sebagai {roleLabel}</strong>.
          <span className="mt-1 block text-xs text-brand-800/80">
            Hak akses tetap mengikuti peran yang ditetapkan admin pada akun Anda.
          </span>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      <div className="mt-6 space-y-4">
        <div>
          <label className="label" htmlFor="identifier">Username atau Email</label>
          <input
            id="identifier"
            type="text"
            className="input"
            placeholder="akhyar atau nama@example.com"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="password">Kata Sandi</label>
          <input
            id="password"
            type="password"
            className="input"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
      </div>

      <button type="submit" className="btn-primary mt-6 w-full" disabled={loading}>
        {loading && <Loader2 size={16} className="animate-spin" />}
        Masuk
      </button>

      <p className="mt-5 text-center text-sm text-slate-600">
        Belum punya akun?{' '}
        <Link href="/register" className="font-semibold text-brand-700 hover:underline">
          Daftar sebagai anggota
        </Link>
      </p>
      <p className="mt-3 text-center text-sm">
        <Link href="/" className="text-slate-500 hover:underline">Kembali ke beranda</Link>
      </p>
    </form>
  )
}
