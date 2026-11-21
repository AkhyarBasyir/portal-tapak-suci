import type { Role } from '@/lib/types'

export const HARI_OPTIONS = [
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
  'Minggu',
]

export const BULAN_OPTIONS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]

export const JENIS_UMUM_OPTIONS = [
  'Latihan Reguler',
  'Latihan Dasar',
  'Latihan Lanjutan',
  'Latihan Intensif',
  'Pembinaan',
  'Latihan Spesialisasi',
]

/**
 * Jenis yang boleh tampil di area publik/beranda. Program dengan pola
 * khusus, intensif, pertandingan, kamp, maupun spesialisasi sengaja
 * dikecualikan karena ditujukan hanya untuk anggota dan pengurus.
 */
export const JENIS_UMUM_PUBLIK = [
  'Latihan Reguler',
  'Latihan Dasar',
  'Latihan Lanjutan',
  'Pembinaan',
]

export const JENIS_KHUSUS_OPTIONS = [
  'Latihan Khusus',
  'Latihan Intensif',
  'Latihan Persiapan Pertandingan',
  'Kamp Pelatihan',
  'Pembinaan Khusus',
]

export const STATUS_OPTIONS = ['Aktif', 'Nonaktif']

export interface ProgramUmum {
  id: string
  judul: string
  jenis: string
  target: string | null
  tanggal_mulai: string
  tanggal_selesai: string | null
  hari: string | null
  jam_mulai: string | null
  jam_selesai: string | null
  lokasi: string | null
  instruktur: string | null
  kuota: number | null
  status: string
  deskripsi: string | null
  gambar_url: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface ProgramKhusus {
  id: string
  judul: string
  jenis: string
  target: string | null
  tanggal_mulai: string
  tanggal_selesai: string | null
  hari: string | null
  bulan: string | null
  jam_mulai: string | null
  jam_selesai: string | null
  lokasi: string | null
  instruktur: string | null
  kirim_ke_semua: boolean
  status: string
  deskripsi: string | null
  gambar_url: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface PenerimaProgram {
  id: string
  program_id: string
  profil_id: string
  dibaca_at: string | null
  created_at: string
}

export interface CalonPenerima {
  id: string
  full_name: string
  email: string | null
  role: Role
  jabatan: string | null
}

export function jamSingkat(value: string | null): string {
  return value ? String(value).slice(0, 5) : '-'
}

export function rentangTanggal(mulai: string | null, selesai: string | null): string {
  if (!mulai) return '-'
  const awal = new Date(mulai)
  const akhir = selesai ? new Date(selesai) : null
  const opsi: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }
  const awalText = awal.toLocaleDateString('id-ID', opsi)
  if (!akhir || Number.isNaN(akhir.getTime())) return awalText
  return `${awalText} – ${akhir.toLocaleDateString('id-ID', opsi)}`
}

export function pilihKe(options: string[], value: string | null): string[] {
  if (!value) return []
  return options.filter((option) =>
    value.split(',').map((part) => part.trim().toLowerCase()).includes(option.toLowerCase()),
  )
}
