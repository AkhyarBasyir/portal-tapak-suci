import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Portal Informasi Tapak Suci',
    template: '%s | Tapak Suci',
  },
  description:
    'Portal informasi organisasi pencak silat Tapak Suci: berita, kegiatan, anggota, galeri, dokumen, dan keuangan.',
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
