'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ArrowRight,
  CircleAlert,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
  UserCog,
  X,
  type LucideIcon,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const peranOptions: {
  id: string
  label: string
  hint: string
  icon: LucideIcon
  aktif: string
}[] = [
  {
    id: 'admin',
    label: 'Admin',
    hint: 'Akses penuh',
    icon: ShieldCheck,
    aktif: 'border-brand-300 bg-brand-50 text-brand-700 shadow-sm',
  },
  {
    id: 'pengurus',
    label: 'Pengurus',
    hint: 'Kelola data',
    icon: UserCog,
    aktif: 'border-amber-300 bg-amber-50 text-amber-700 shadow-sm',
  },
  {
    id: 'anggota',
    label: 'Anggota',
    hint: 'Lihat informasi',
    icon: User,
    aktif: 'border-sky-300 bg-sky-50 text-sky-700 shadow-sm',
  },
]

const kunciIngat = 'tapaksuci_ingat_identifier'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const nextParam = searchParams.get('next')
  const next = nextParam && nextParam.startsWith('/') && !nextParam.startsWith('//')
    ? nextParam
    : '/dashboard'
  const roleParam = searchParams.get('role')
  const roleAwal = peranOptions.some((p) => p.id === roleParam) ? roleParam : null

  const [role, setRole] = useState<string | null>(roleAwal)
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [tampilPassword, setTampilPassword] = useState(false)
  const [ingat, setIngat] = useState(false)
  const [capsLock, setCapsLock] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errorKey, setErrorKey] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    try {
      const tersimpan = window.localStorage.getItem(kunciIngat)
      if (tersimpan) {
        setIdentifier(tersimpan)
        setIngat(true)
      }
    } catch {
      // LocalStorage bisa dinonaktifkan; login tetap berfungsi normal.
    }
  }, [])

  function gagal(pesan: string) {
    setError(pesan)
    setErrorKey((n) => n + 1)
    setLoading(false)
  }

  function pilihPeran(id: string | null) {
    setRole(id)
    try {
      const params = new URLSearchParams(window.location.search)
      if (id) params.set('role', id)
      else params.delete('role')
      const query = params.toString()
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${query ? `?${query}` : ''}`,
      )
    } catch {
      // Abaikan bila history tidak tersedia.
    }
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const bersih = identifier.trim()
    if (!bersih) {
      gagal('Username atau email wajib diisi.')
      return
    }

    const supabase = createClient()

    // Username dan email keduanya diterima. Jika input bukan email,
    // resolver database mencari email berdasarkan username.
    const { data: resolvedEmail, error: resolveError } = await supabase.rpc(
      'email_for_login',
      { identifier: bersih },
    )

    if (resolveError || !resolvedEmail) {
      gagal('Username atau email tidak ditemukan. Periksa kembali tulisan Anda.')
      return
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: resolvedEmail,
      password,
    })

    if (signInError) {
      gagal('Kata sandi tidak benar. Silakan coba lagi.')
      return
    }

    try {
      if (ingat) window.localStorage.setItem(kunciIngat, bersih)
      else window.localStorage.removeItem(kunciIngat)
    } catch {
      // Abaikan kegagalan penyimpanan preferensi.
    }

    router.push(next)
    router.refresh()
  }

  const peranAktif = peranOptions.find((p) => p.id === role)

  return (
    <form onSubmit={submit} className="auth-card group">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-700 via-amber-400 to-brand-600" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-100/60 blur-2xl transition group-hover:bg-brand-100" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-700">
            <Sparkles size={12} /> Selamat datang kembali
          </span>
          <h1 className="mt-4 text-[1.9rem] font-bold leading-tight tracking-tight text-slate-900 sm:text-[2.15rem]">
            Masuk ke akun Anda
          </h1>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
            Gunakan username atau email terdaftar untuk melanjutkan.
          </p>
        </div>
        <span className="hidden h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/25 sm:grid">
          <KeyRound size={21} />
        </span>
      </div>

      <div className="relative mt-7">
        <p className="label mb-2">Peran <span className="font-normal text-slate-400">(opsional)</span></p>
        <div className="grid grid-cols-3 gap-2">
          {peranOptions.map((item) => {
            const aktif = role === item.id
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={aktif}
                onClick={() => pilihPeran(aktif ? null : item.id)}
                className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center transition duration-200 hover:-translate-y-0.5 ${
                  aktif
                    ? item.aktif
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <item.icon size={18} strokeWidth={aktif ? 2.3 : 1.8} />
                <span className="text-xs font-semibold">{item.label}</span>
                <span className="text-[10px] text-slate-400">{item.hint}</span>
              </button>
            )
          })}
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
          Pilihan ini hanya menandai konteks. Hak akses tetap mengikuti peran akun Anda.
        </p>
      </div>

      {peranAktif && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-brand-100 bg-gradient-to-r from-brand-50 to-white px-4 py-3">
          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-brand-600 shadow-sm">
            <peranAktif.icon size={16} />
          </span>
          <p className="min-w-0 flex-1 text-xs leading-relaxed text-slate-600">
            Anda akan masuk sebagai <strong className="text-brand-700">{peranAktif.label}</strong>.
            <span className="block text-[11px] text-slate-500">
              Pastikan akun Anda memiliki peran tersebut.
            </span>
          </p>
          <button
            type="button"
            onClick={() => pilihPeran(null)}
            aria-label="Hapus pilihan peran"
            className="rounded-md p-1 text-slate-400 transition hover:bg-white hover:text-slate-700"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {error && (
        <div
          key={errorKey}
          role="alert"
          className="mt-4 flex animate-shake items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <CircleAlert size={17} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="relative mt-6 space-y-4">
        <div>
          <label className="label" htmlFor="identifier">
            Username atau Email
          </label>
          <div className="relative">
            <Mail
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              id="identifier"
              type="text"
              autoComplete="username"
              autoFocus
              className="auth-input pl-11"
              placeholder="akhyar atau nama@example.com"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <label className="label" htmlFor="password">
              Kata Sandi
            </label>
            <span className="mb-1 inline-flex items-center gap-1 text-[11px] text-slate-400">
              <LockKeyhole size={12} /> Terenkripsi
            </span>
          </div>
          <div className="relative">
            <KeyRound
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              id="password"
              type={tampilPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className="auth-input pl-11 pr-12"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={(event) => setCapsLock(event.getModifierState('CapsLock'))}
              onKeyUp={(event) => setCapsLock(event.getModifierState('CapsLock'))}
              onBlur={() => setCapsLock(false)}
              required
            />
            <button
              type="button"
              onClick={() => setTampilPassword((v) => !v)}
              aria-label={tampilPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-brand-700"
            >
              {tampilPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {capsLock && (
            <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-amber-600">
              <CircleAlert size={12} /> Caps Lock sedang aktif
            </p>
          )}
        </div>
      </div>

      <div className="relative mt-5 flex flex-wrap items-center justify-between gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-slate-600">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 accent-brand-600"
            checked={ingat}
            onChange={(event) => setIngat(event.target.checked)}
          />
          Ingat username di perangkat ini
        </label>
        <a
          href="mailto:pimpinanpusattapaksuci@gmail.com?subject=Bantuan%20akses%20portal%20Tapak%20Suci"
          className="text-xs font-semibold text-brand-700 transition hover:underline"
        >
          Butuh bantuan akses?
        </a>
      </div>

      <button
        type="submit"
        className="btn-primary relative mt-6 h-12 w-full overflow-hidden rounded-xl text-[15px] shadow-lg shadow-brand-600/25 transition hover:-translate-y-0.5 hover:shadow-xl disabled:hover:translate-y-0"
        disabled={loading}
      >
        <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/20 opacity-0 transition group-hover:animate-shine group-hover:opacity-100" />
        <span className="relative flex items-center justify-center gap-2">
          {loading ? (
            <>
              <Loader2 size={17} className="animate-spin" /> Memeriksa akun...
            </>
          ) : (
            <>
              Masuk ke portal <ArrowRight size={17} />
            </>
          )}
        </span>
      </button>

      <div className="relative mt-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-slate-200" />
        <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
          atau
        </span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <Link
        href="/register"
        className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50/50 hover:text-brand-700"
      >
        Daftar sebagai anggota <ArrowRight size={15} />
      </Link>

      <p className="relative mt-5 text-center text-xs text-slate-400">
        Kembali ke{' '}
        <Link href="/" className="font-semibold text-slate-600 transition hover:text-brand-700">
          beranda portal
        </Link>
      </p>
    </form>
  )
}
