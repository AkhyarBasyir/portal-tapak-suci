import { Suspense } from 'react'
import LoginForm from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="card p-8 text-sm text-slate-500">Memuat formulir...</div>}>
      <LoginForm />
    </Suspense>
  )
}
