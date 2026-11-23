import type { Metadata } from 'next'
import './globals.css'
import { SITE_URL } from '@/lib/constants'
const DESKRIPSI =
  'Portal resmi Tapak Suci Putera Muhammadiyah dan Sanggar Surya Manggala Integra: prestasi di gelanggang, seni pertunjukan pentas, jadwal latihan, dan berita organisasi.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Portal Informasi Tapak Suci',
    template: '%s | Tapak Suci',
  },
  description: DESKRIPSI,
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: '/',
    siteName: 'Portal Informasi Tapak Suci',
    title: 'Portal Informasi Tapak Suci',
    description: DESKRIPSI,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portal Informasi Tapak Suci',
    description: DESKRIPSI,
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
