import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getBeritaBySlug } from '@/lib/data'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function BeritaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const item = await getBeritaBySlug(slug)
  if (!item) notFound()

  return (
    <article className="container-page max-w-4xl py-12">
      <Link href="/berita" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:underline">
        <ArrowLeft size={16} />
        Kembali ke berita
      </Link>
      <h1 className="mt-6 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">{item.judul}</h1>
      <p className="mt-3 text-sm text-slate-500">
        {formatDate(item.published_at)} · {item.penulis || 'Pengurus'}
      </p>
      {item.gambar_url && (
        <img src={item.gambar_url} alt={item.judul} className="mt-8 h-72 w-full rounded-2xl object-cover" />
      )}
      <div className="prose mt-8 max-w-none whitespace-pre-line text-base leading-relaxed text-slate-700">
        {item.konten}
      </div>
    </article>
  )
}
