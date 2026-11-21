'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function RegisterForm() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const supabase = createClient()
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    setMessage('Pendaftaran berhasil. Silakan cek email untuk konfirmasi, lalu masuk.')
    setLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="card p-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Anggota baru</p>
      <h1 className="mt-1 text-2xl font-bold text-slate-900">Buat Akun</h1>
      <p className="mt-2 text-sm text-slate-600">Akun baru dibuat dengan peran Anggota.</p>

      {error && <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
      {message && <div className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</div>}

      <div className="mt-6 space-y-4">
        <div>
          <label className="label" htmlFor="fullName">Nama Lengkap</label>
          <input id="fullName" className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="label" htmlFor="password">Kata Sandi</label>
          <input id="password" type="password" className="input" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
      </div>

      <button type="submit" className="btn-primary mt-6 w-full" disabled={loading}>
        {loading && <Loader2 size={16} className="animate-spin" />}
        Daftar
      </button>

      <p className="mt-5 text-center text-sm text-slate-600">
        Sudah punya akun?{' '}
        <Link href="/login" className="font-semibold text-brand-700 hover:underline">Masuk</Link>
      </p>
    </form>
  )
}
