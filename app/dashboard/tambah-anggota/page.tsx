import { redirect } from 'next/navigation'
import { getSessionProfile } from '@/lib/auth'
import TambahAnggotaForm from '@/components/admin/tambah-anggota-form'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Tambah Anggota | Tapak Suci',
}

export default async function TambahAnggotaPage() {
  const session = await getSessionProfile()
  if (!session) redirect('/login')
  if (session.profile.role !== 'admin') redirect('/dashboard')

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Tambah Anggota</h1>
      <p className="mt-1 text-sm text-slate-500">
        Buat akun login sekaligus data anggota baru.
      </p>
      <div className="mt-6">
        <TambahAnggotaForm />
      </div>
    </div>
  )
}
