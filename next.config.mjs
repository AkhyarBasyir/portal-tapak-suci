/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
  async redirects() {
    return [
      {
        source: '/dashboard/raport-atlet',
        destination: '/dashboard/raport_atlet',
        permanent: false,
      },
      {
        source: '/dashboard/raport_pengukuran',
        destination: '/dashboard/raport_atlet?tab=pengukuran',
        permanent: false,
      },
      {
        source: '/dashboard/raport_performa',
        destination: '/dashboard/raport_atlet?tab=performa',
        permanent: false,
      },
      {
        source: '/dashboard/raport_prestasi',
        destination: '/dashboard/raport_atlet?tab=prestasi',
        permanent: false,
      },
      {
        source: '/dashboard/raport_kepribadian',
        destination: '/dashboard/raport_atlet?tab=kepribadian',
        permanent: false,
      },
      {
        source: '/dashboard/konten-beranda',
        destination: '/dashboard/beranda_konten',
        permanent: false,
      },
      {
        source: '/dashboard/kegiatan',
        destination: '/dashboard/beranda_konten?tab=kegiatan',
        permanent: false,
      },
      {
        source: '/dashboard/berita',
        destination: '/dashboard/beranda_konten?tab=berita',
        permanent: false,
      },
      {
        source: '/dashboard/prestasi',
        destination: '/dashboard/beranda_konten?tab=prestasi',
        permanent: false,
      },
      {
        source: '/dashboard/media',
        destination: '/dashboard/beranda_konten?tab=media',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
