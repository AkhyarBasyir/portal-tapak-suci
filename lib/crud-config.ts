import type { CrudConfig } from '@/components/crud/types'

const JENJANG = ['Pengenal', 'Penggalang', 'Pembina', 'Muda', 'Madya', 'Utama', 'Pendekar']
  .map((value) => ({ value, label: value }))

const JABATAN = ['Ketua', 'Wakil Ketua', 'Sekretaris', 'Bendahara', 'Pelatih', 'Instruktur', 'Anggota']
  .map((value) => ({ value, label: value }))

export const CRUD_CONFIGS: Record<string, CrudConfig> = {
  anggota: {
    key: 'anggota',
    table: 'anggota',
    title: 'Data Anggota',
    singular: 'Anggota',
    description: 'Kelola profil anggota, jenjang, jabatan, dan status keanggotaan.',
    fields: [
      { name: 'nip', label: 'NIP / Nomor Anggota', type: 'text', required: true, placeholder: 'TS-2026-001' },
      { name: 'nama', label: 'Nama Lengkap', type: 'text', required: true },
      { name: 'jenjang', label: 'Jenjang', type: 'select', options: JENJANG },
      { name: 'jabatan', label: 'Jabatan', type: 'select', options: JABATAN },
      { name: 'cabang', label: 'Cabang / Daerah', type: 'text', placeholder: 'Contoh: Jakarta Pusat' },
      { name: 'telepon', label: 'Telepon / WhatsApp', type: 'text' },
      { name: 'email', label: 'Email', type: 'text' },
      { name: 'alamat', label: 'Alamat', type: 'textarea' },
      { name: 'tanggal_masuk', label: 'Tanggal Masuk', type: 'date' },
      { name: 'status', label: 'Status', type: 'select', required: true, options: [
        { value: 'Aktif', label: 'Aktif' },
        { value: 'Nonaktif', label: 'Nonaktif' },
      ] },
      { name: 'foto_url', label: 'Foto Profil', type: 'image', bucket: 'media', help: 'Unggah foto ke storage cloud.' },
    ],
    columns: [
      { name: 'nip', label: 'NIP' },
      { name: 'nama', label: 'Nama' },
      { name: 'jenjang', label: 'Jenjang' },
      { name: 'jabatan', label: 'Jabatan' },
      { name: 'cabang', label: 'Cabang' },
      { name: 'status', label: 'Status', type: 'badge' },
    ],
    minRole: 'pengurus',
    deleteRole: 'pengurus',
  },

  kegiatan: {
    key: 'kegiatan',
    table: 'kegiatan',
    title: 'Jadwal Kegiatan',
    singular: 'Kegiatan',
    description: 'Atur latihan, seminar, turnamen, rapat, dan acara organisasi.',
    fields: [
      { name: 'judul', label: 'Judul Kegiatan', type: 'text', required: true },
      { name: 'jenis', label: 'Jenis', type: 'select', required: true, options: [
        { value: 'Latihan', label: 'Latihan' },
        { value: 'Seminar', label: 'Seminar' },
        { value: 'Turnamen', label: 'Turnamen' },
        { value: 'Rapat', label: 'Rapat' },
        { value: 'Kegiatan Sosial', label: 'Kegiatan Sosial' },
        { value: 'Lainnya', label: 'Lainnya' },
      ] },
      { name: 'tanggal_mulai', label: 'Tanggal Mulai', type: 'date', required: true },
      { name: 'tanggal_selesai', label: 'Tanggal Selesai', type: 'date' },
      { name: 'lokasi', label: 'Lokasi', type: 'text' },
      { name: 'status', label: 'Status', type: 'select', options: [
        { value: 'Akan Datang', label: 'Akan Datang' },
        { value: 'Berlangsung', label: 'Berlangsung' },
        { value: 'Selesai', label: 'Selesai' },
      ] },
      { name: 'deskripsi', label: 'Deskripsi', type: 'textarea' },
      { name: 'gambar_url', label: 'Gambar Kegiatan', type: 'image', bucket: 'media' },
    ],
    columns: [
      { name: 'judul', label: 'Judul' },
      { name: 'jenis', label: 'Jenis', type: 'badge' },
      { name: 'tanggal_mulai', label: 'Tanggal', type: 'date' },
      { name: 'lokasi', label: 'Lokasi' },
      { name: 'status', label: 'Status', type: 'badge' },
    ],
    orderBy: 'tanggal_mulai',
    ascending: false,
    minRole: 'pengurus',
    deleteRole: 'pengurus',
  },

  berita: {
    key: 'berita',
    table: 'berita',
    title: 'Berita & Pengumuman',
    singular: 'Berita',
    description: 'Terbitkan artikel dan pengumuman resmi organisasi.',
    fields: [
      { name: 'judul', label: 'Judul', type: 'text', required: true },
      { name: 'slug', label: 'Slug URL', type: 'text', help: 'Dikosongkan agar dibuat otomatis dari judul.' },
      { name: 'ringkasan', label: 'Ringkasan', type: 'textarea' },
      { name: 'konten', label: 'Isi Artikel', type: 'textarea', required: true },
      { name: 'penulis', label: 'Penulis', type: 'text' },
      { name: 'status', label: 'Status', type: 'select', required: true, options: [
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Diterbitkan' },
      ] },
      { name: 'published_at', label: 'Tanggal Terbit', type: 'date' },
      { name: 'gambar_url', label: 'Gambar Utama', type: 'image', bucket: 'media' },
    ],
    columns: [
      { name: 'judul', label: 'Judul' },
      { name: 'penulis', label: 'Penulis' },
      { name: 'status', label: 'Status', type: 'badge' },
      { name: 'published_at', label: 'Diterbitkan', type: 'date' },
    ],
    minRole: 'pengurus',
    deleteRole: 'pengurus',
  },

  media: {
    key: 'media',
    table: 'media',
    title: 'Dokumen & Galeri',
    singular: 'Media',
    description: 'Unggah foto kegiatan (galeri) dan arsip dokumen.',
    fields: [
      { name: 'judul', label: 'Judul', type: 'text', required: true },
      { name: 'tipe', label: 'Tipe', type: 'select', required: true, options: [
        { value: 'galeri', label: 'Galeri Foto' },
        { value: 'dokumen', label: 'Dokumen' },
      ] },
      { name: 'kategori', label: 'Kategori', type: 'text', placeholder: 'Contoh: Latihan Dasar / AD-ART' },
      { name: 'file_url', label: 'File / Foto', type: 'file', bucket: 'media', required: true },
      { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    ],
    columns: [
      { name: 'judul', label: 'Judul' },
      { name: 'tipe', label: 'Tipe', type: 'badge' },
      { name: 'kategori', label: 'Kategori' },
      { name: 'created_at', label: 'Diunggah', type: 'date' },
    ],
    minRole: 'pengurus',
    deleteRole: 'pengurus',
  },

  keuangan: {
    key: 'keuangan',
    table: 'keuangan',
    title: 'Keuangan & Kas',
    singular: 'Transaksi',
    description: 'Catat pemasukan dan pengeluaran organisasi. Hanya admin yang bisa menghapus.',
    fields: [
      { name: 'jenis', label: 'Jenis', type: 'select', required: true, options: [
        { value: 'masuk', label: 'Pemasukan' },
        { value: 'keluar', label: 'Pengeluaran' },
      ] },
      { name: 'kategori', label: 'Kategori', type: 'text', required: true, placeholder: 'Contoh: Iuran, Donasi, Operasional' },
      { name: 'keterangan', label: 'Keterangan', type: 'text' },
      { name: 'jumlah', label: 'Jumlah (Rp)', type: 'number', required: true, placeholder: '0' },
      { name: 'tanggal', label: 'Tanggal', type: 'date', required: true },
      { name: 'bukti_url', label: 'Bukti Transaksi', type: 'file', bucket: 'bukti', help: 'Disimpan di bucket privat, hanya pengurus/admin yang bisa melihat.' },
    ],
    columns: [
      { name: 'tanggal', label: 'Tanggal', type: 'date' },
      { name: 'jenis', label: 'Jenis', type: 'badge' },
      { name: 'kategori', label: 'Kategori' },
      { name: 'keterangan', label: 'Keterangan' },
      { name: 'jumlah', label: 'Jumlah', type: 'currency' },
    ],
    orderBy: 'tanggal',
    ascending: false,
    minRole: 'pengurus',
    deleteRole: 'admin',
  },

  iuran: {
    key: 'iuran',
    table: 'iuran',
    title: 'Iuran Anggota',
    singular: 'Iuran',
    description: 'Pantau pembayaran iuran anggota per periode.',
    fields: [
      { name: 'anggota_id', label: 'Anggota', type: 'relation', required: true, relation: { table: 'anggota', value: 'id', label: 'nama' } },
      { name: 'periode', label: 'Periode', type: 'text', required: true, placeholder: 'Contoh: November 2026' },
      { name: 'jumlah', label: 'Jumlah (Rp)', type: 'number', required: true },
      { name: 'status', label: 'Status', type: 'select', required: true, options: [
        { value: 'lunas', label: 'Lunas' },
        { value: 'belum', label: 'Belum Bayar' },
      ] },
      { name: 'tanggal_bayar', label: 'Tanggal Bayar', type: 'date' },
      { name: 'keterangan', label: 'Keterangan', type: 'text' },
    ],
    columns: [
      { name: 'anggota_id', label: 'Anggota', type: 'relation' },
      { name: 'periode', label: 'Periode' },
      { name: 'jumlah', label: 'Jumlah', type: 'currency' },
      { name: 'status', label: 'Status', type: 'badge' },
      { name: 'tanggal_bayar', label: 'Tanggal Bayar', type: 'date' },
    ],
    orderBy: 'created_at',
    ascending: false,
    minRole: 'pengurus',
    deleteRole: 'pengurus',
  },

  pengguna: {
    key: 'pengguna',
    table: 'profiles',
    title: 'Pengguna & Hak Akses',
    singular: 'Pengguna',
    description: 'Atur peran pengguna: admin, pengurus, atau anggota.',
    fields: [
      { name: 'full_name', label: 'Nama Lengkap', type: 'text', required: true },
      { name: 'username', label: 'Username (untuk login)', type: 'text' },
      { name: 'role', label: 'Peran', type: 'select', required: true, options: [
        { value: 'admin', label: 'Admin' },
        { value: 'pengurus', label: 'Pengurus' },
        { value: 'anggota', label: 'Anggota' },
      ] },
      { name: 'jabatan', label: 'Jabatan', type: 'text' },
      { name: 'telepon', label: 'Telepon', type: 'text' },
      { name: 'avatar_url', label: 'Avatar', type: 'image', bucket: 'media' },
    ],
    columns: [
      { name: 'full_name', label: 'Nama' },
      { name: 'email', label: 'Email' },
      { name: 'role', label: 'Peran', type: 'badge' },
      { name: 'jabatan', label: 'Jabatan' },
    ],
    minRole: 'admin',
    deleteRole: 'admin',
    disableCreate: true,
    hideDelete: true,
  },
}

export const CRUD_KEYS = Object.keys(CRUD_CONFIGS)
