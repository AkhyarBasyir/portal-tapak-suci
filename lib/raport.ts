export type RaportStatus = 'Draft' | 'Terbit' | 'Arsip'

export interface RaportHeader {
  id: string
  profil_id: string
  anggota_id: string | null
  periode: string
  tanggal: string
  jenjang: string | null
  kelas: string | null
  cabang: string | null
  pelatih: string | null
  status: RaportStatus | string
  skor_keseluruhan: number
  kehadiran_persen: number
  peringkat: string | null
  catatan: string | null
  rekomendasi: string | null
  created_at: string
  updated_at: string
}

export interface RaportPengukuran {
  id: string
  raport_id: string
  tinggi_badan_cm: number | null
  berat_badan_kg: number | null
  lingkar_dada_cm: number | null
  lingkar_pinggang_cm: number | null
  lingkar_paha_cm: number | null
  denyut_nadi_istirahat: number | null
  catatan: string | null
}

export interface RaportPerforma {
  id: string
  raport_id: string
  aspek: string
  nilai: number
  satuan: string | null
  keterangan: string | null
  urutan: number
}

export interface RaportPrestasi {
  id: string
  raport_id: string
  judul: string
  tingkat: string | null
  peringkat: string | null
  tanggal: string | null
  penyelenggara: string | null
  keterangan: string | null
  urutan: number
}

export interface RaportKepribadian {
  id: string
  raport_id: string
  aspek: string
  nilai: number
  keterangan: string | null
  urutan: number
}

export interface RaportLengkap extends RaportHeader {
  pengukuran: RaportPengukuran[]
  performa: RaportPerforma[]
  prestasi: RaportPrestasi[]
  kepribadian: RaportKepribadian[]
}

export const ASPEK_PERFORMA = [
  'Power',
  'Kecepatan',
  'Daya Tahan (VO2 Max)',
  'Teknik',
  'Strategi',
  'Mental',
]

export const ASPEK_KEPRIBADIAN = [
  'Disiplin',
  'Tanggung Jawab',
  'Kerja Sama',
  'Sportivitas',
  'Kepemimpinan',
  'Kepercayaan Diri',
  'Sabar',
  'Rendah Hati',
  'Komunikasi',
  'Ketahanan Mental',
  'Etika',
  'Inisiatif',
]

export const WARNA_GRAFIK = ['#b91c1c', '#f59e0b', '#0f766e', '#7c3aed']

export function nilaiAman(value: unknown): number {
  const n = Number(value)
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(100, n))
}

export function tanggalRaport(value: string | null | undefined): string {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function periodePendek(value: string): string {
  return value.replace(/^Contoh\s+/i, '')
}
