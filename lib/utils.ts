export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 120)
}

export function formatDate(value: unknown): string {
  if (!value) return '-'
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 10)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatCurrency(value: unknown): string {
  const number = Number(value ?? 0)
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(number)
}

export function badgeClass(value: unknown): string {
  const text = String(value ?? '').toLowerCase()
  if (
    ['aktif', 'published', 'lunas', 'masuk', 'selesai', 'admin'].includes(text)
  ) {
    return 'bg-emerald-100 text-emerald-700'
  }
  if (
    ['nonaktif', 'draft', 'belum', 'keluar', 'pengurus'].includes(text)
  ) {
    return 'bg-amber-100 text-amber-700'
  }
  if (['anggota', 'berlangsung'].includes(text)) {
    return 'bg-sky-100 text-sky-700'
  }
  return 'bg-slate-100 text-slate-600'
}
