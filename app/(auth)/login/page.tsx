import type { Metadata } from 'next'
import { Suspense } from 'react'
import LoginForm from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Masuk',
  description:
    'Masuk ke portal Tapak Suci untuk mengelola dan melihat informasi organisasi, program latihan, serta data keanggotaan.',
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="auth-card animate-pulse" aria-label="Memuat formulir masuk">
          <div className="h-3 w-32 rounded-full bg-brand-100" />
          <div className="mt-5 h-8 w-3/4 rounded-lg bg-slate-200" />
          <div className="mt-3 h-4 w-2/3 rounded-lg bg-slate-100" />
          <div className="mt-8 h-12 rounded-xl bg-slate-100" />
          <div className="mt-4 h-12 rounded-xl bg-slate-100" />
          <div className="mt-6 h-12 rounded-xl bg-brand-100" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
