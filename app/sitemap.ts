import type { MetadataRoute } from 'next'

const SITE_URL = 'https://portal-tapak-suci.vercel.app'

const HALAMAN: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/program-latihan', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/sanggar', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/prestasi', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/berita', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/kegiatan', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/anggota', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/galeri', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/dokumen', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/kredit-foto', priority: 0.3, changeFrequency: 'yearly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return HALAMAN.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }))
}
