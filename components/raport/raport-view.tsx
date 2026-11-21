'use client'

import { useMemo, useState } from 'react'
import {
  Award,
  CalendarDays,
  CheckCircle2,
  Download,
  Printer,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
} from 'lucide-react'
import { LineChart, ProgressRing, RadarChart } from '@/components/raport/charts'
import {
  ASPEK_KEPRIBADIAN,
  ASPEK_PERFORMA,
  WARNA_GRAFIK,
  nilaiAman,
  periodePendek,
  tanggalRaport,
  type RaportLengkap,
} from '@/lib/raport'

function escaping(value: unknown): string {
  return String(value ?? '-')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function unduhRaport(r: RaportLengkap, nama: string) {
  const performaRows = r.performa
    .map(
      (item) =>
        `<tr><td>${escaping(item.aspek)}</td><td>${escaping(item.nilai)}</td><td>${escaping(item.satuan ?? '-')}</td><td>${escaping(item.keterangan ?? '-')}</td></tr>`,
    )
    .join('')

  const pengukuranRows = [
    ['Tinggi Badan', r.pengukuran[0]?.tinggi_badan_cm, 'cm'],
    ['Berat Badan', r.pengukuran[0]?.berat_badan_kg, 'kg'],
    ['Lingkar Dada', r.pengukuran[0]?.lingkar_dada_cm, 'cm'],
    ['Lingkar Pinggang', r.pengukuran[0]?.lingkar_pinggang_cm, 'cm'],
    ['Lingkar Paha', r.pengukuran[0]?.lingkar_paha_cm, 'cm'],
    ['Denyut Nadi Istirahat', r.pengukuran[0]?.denyut_nadi_istirahat, '/menit'],
  ]
    .map(
      ([label, value, satuan]) =>
        `<tr><td>${escaping(label)}</td><td>${escaping(value ?? '-')} ${escaping(satuan)}</td></tr>`,
    )
    .join('')

  const prestasiRows = r.prestasi.length
    ? r.prestasi
        .map(
          (item) =>
            `<tr><td>${escaping(item.judul)}</td><td>${escaping(item.tingkat ?? '-')}</td><td>${escaping(item.peringkat ?? '-')}</td><td>${escaping(tanggalRaport(item.tanggal))}</td></tr>`,
        )
        .join('')
    : '<tr><td colspan="4">Belum ada prestasi tercatat.</td></tr>'

  const kepribadianRows = r.kepribadian
    .map(
      (item) =>
        `<tr><td>${escaping(item.aspek)}</td><td>${escaping(item.nilai)}</td><td>${escaping(item.keterangan ?? '-')}</td></tr>`,
    )
    .join('')

  const html = `<!doctype html>
<html lang="id"><head><meta charset="utf-8" />
<title>Raport Atlet - ${escaping(periodePendek(r.periode))}</title>
<style>
  body{font-family:Arial,sans-serif;color:#0f172a;margin:36px;line-height:1.5}
  h1{color:#991b1b;margin:0 0 4px} h2{color:#7f1d1d;font-size:16px;margin:26px 0 8px;border-bottom:2px solid #fee2e2;padding-bottom:5px}
  .meta{color:#64748b;font-size:12px;margin-bottom:20px}
  .badge{display:inline-block;background:#fee2e2;color:#991b1b;border-radius:20px;padding:4px 12px;font-size:12px;font-weight:bold;margin-right:6px}
  table{width:100%;border-collapse:collapse;font-size:12px;margin-top:8px}
  th,td{border:1px solid #e2e8f0;padding:7px 9px;text-align:left;vertical-align:top}
  th{background:#fff1f2;color:#7f1d1d}
  .box{background:#f8fafc;border-left:4px solid #b91c1c;padding:12px 14px;font-size:13px;border-radius:0 8px 8px 0}
  footer{margin-top:34px;display:flex;justify-content:space-between;font-size:12px;color:#475569}
</style></head><body>
<h1>RAPORT ATLET TAPAK SUCI</h1>
<div class="meta">Periode ${escaping(periodePendek(r.periode))} &middot; Diterbitkan ${escaping(tanggalRaport(r.tanggal))}</div>
<p><span class="badge">${escaping(nama)}</span><span class="badge">Skor ${escaping(r.skor_keseluruhan)}</span><span class="badge">Kehadiran ${escaping(r.kehadiran_persen)}%</span><span class="badge">${escaping(r.peringkat ?? '-')}</span></p>
<p class="meta">Jenjang: ${escaping(r.jenjang ?? '-')} &middot; Kelas: ${escaping(r.kelas ?? '-')} &middot; Cabang: ${escaping(r.cabang ?? '-')} &middot; Pelatih: ${escaping(r.pelatih ?? '-')}</p>
<h2>Pengukuran Fisik</h2><table><thead><tr><th>Komponen</th><th>Hasil</th></tr></thead><tbody>${pengukuranRows}</tbody></table>
<h2>Penilaian Performa</h2><table><thead><tr><th>Aspek</th><th>Nilai</th><th>Satuan</th><th>Keterangan</th></tr></thead><tbody>${performaRows || '<tr><td colspan="4">Belum ada penilaian.</td></tr>'}</tbody></table>
<h2>Prestasi</h2><table><thead><tr><th>Kejuaraan</th><th>Tingkat</th><th>Peringkat</th><th>Tanggal</th></tr></thead><tbody>${prestasiRows}</tbody></table>
<h2>Kepribadian</h2><table><thead><tr><th>Aspek</th><th>Nilai</th><th>Keterangan</th></tr></thead><tbody>${kepribadianRows || '<tr><td colspan="3">Belum ada penilaian.</td></tr>'}</tbody></table>
<h2>Catatan & Rekomendasi</h2><div class="box"><strong>Catatan Pelatih:</strong> ${escaping(r.catatan ?? '-')}<br /><strong>Rekomendasi:</strong> ${escaping(r.rekomendasi ?? '-')}</div>
<footer><div>Mengetahui,<br /><br />_______________________<br />Pelatih</div><div>Yogyakarta, ${escaping(tanggalRaport(r.tanggal))}<br /><br />_______________________<br />Pengurus</div></footer>
</body></html>`

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `raport-atlet-${r.periode.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.html`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export default function RaportView({
  raport,
  nama,
}: {
  raport: RaportLengkap[]
  nama: string
}) {
  const [aktifId, setAktifId] = useState(raport[0]?.id ?? '')
  const aktif = useMemo(
    () => raport.find((item) => item.id === aktifId) ?? raport[0],
    [raport, aktifId],
  )

  if (!raport.length || !aktif) {
    return (
      <div className="overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-sm">
        <div className="relative h-44 bg-gradient-to-br from-brand-900 via-brand-700 to-[#3b0f0a]">
          <div className="nusantara-motif absolute inset-0 opacity-70" />
          <img
            src="/raport-atlet.jpg"
            alt="Atlet pencak silat Tapak Suci"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-45"
          />
        </div>
        <div className="p-8 text-center">
          <Sparkles className="mx-auto mb-3 text-brand-600" size={30} />
          <h2 className="text-xl font-bold text-slate-900">Belum ada raport diterbitkan</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600">
            Raport atlet akan tampil di halaman ini setelah pengurus menerbitkannya. Sementara itu,
            teruslah berlatih dan pantau perkembangan performa bersama pelatih.
          </p>
        </div>
      </div>
    )
  }

  const performaLabels = aktif.performa.length
    ? aktif.performa.map((item) => item.aspek)
    : ASPEK_PERFORMA
  const performaValues = performaLabels.map((aspek) =>
    nilaiAman(aktif.performa.find((item) => item.aspek === aspek)?.nilai),
  )
  const rataValues = performaLabels.map((aspek) => {
    const values = raport
      .map((item) => item.performa.find((p) => p.aspek === aspek)?.nilai)
      .filter((value): value is number => value != null)
    if (!values.length) return 0
    return values.reduce((total, value) => total + nilaiAman(value), 0) / values.length
  })

  const grafikPerkembangan = ASPEK_PERFORMA.map((aspek, index) => ({
    name: aspek.length > 12 ? `${aspek.slice(0, 11)}…` : aspek,
    values: raport.map((item) =>
      nilaiAman(item.performa.find((p) => p.aspek === aspek)?.nilai),
    ),
    color: WARNA_GRAFIK[index % WARNA_GRAFIK.length],
  })).filter((seri) => seri.values.some((value) => value > 0))

  const pengukuran = aktif.pengukuran[0]
  const pengukuranItems = [
    { label: 'Tinggi', value: pengukuran?.tinggi_badan_cm, satuan: 'cm' },
    { label: 'Berat', value: pengukuran?.berat_badan_kg, satuan: 'kg' },
    { label: 'Dada', value: pengukuran?.lingkar_dada_cm, satuan: 'cm' },
    { label: 'Pinggang', value: pengukuran?.lingkar_pinggang_cm, satuan: 'cm' },
    { label: 'Paha', value: pengukuran?.lingkar_paha_cm, satuan: 'cm' },
    { label: 'Nadi Istirahat', value: pengukuran?.denyut_nadi_istirahat, satuan: '/menit' },
  ]

  return (
    <div className="space-y-5">
      <div className="no-print flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-100 bg-gradient-to-r from-brand-50 via-white to-amber-50 p-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-600">
            Raport Atlet
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Menampilkan {raport.length} periode penilaian untuk <strong>{nama}</strong>.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="btn-outline"
          >
            <Printer size={16} /> Simpan PDF
          </button>
          <button
            type="button"
            onClick={() => unduhRaport(aktif, nama)}
            className="btn-primary"
          >
            <Download size={16} /> Unduh Raport
          </button>
        </div>
      </div>

      <div className="no-print flex flex-wrap gap-2">
        {raport.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setAktifId(item.id)}
            className={`rounded-xl border px-4 py-2 text-left text-sm font-semibold transition ${
              item.id === aktif.id
                ? 'border-brand-600 bg-brand-600 text-white shadow-lg shadow-brand-900/20'
                : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700'
            }`}
          >
            {periodePendek(item.periode)}
            <span className={`ml-2 text-[11px] ${item.id === aktif.id ? 'text-brand-100' : 'text-slate-400'}`}>
              {tanggalRaport(item.tanggal)}
            </span>
          </button>
        ))}
      </div>

      <article className="print-area overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#2a0a0a] via-brand-800 to-[#120606] px-6 py-8 text-white sm:px-10">
          <div className="nusantara-motif absolute inset-0 opacity-90" />
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl" />
          <div className="relative flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-amber-300">
                Tapak Suci &middot; Pembinaan Prestasi
              </p>
              <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
                Raport Perkembangan Atlet
              </h1>
              <p className="mt-1 text-sm text-brand-100">
                {periodePendek(aktif.periode)} &middot; Diterbitkan {tanggalRaport(aktif.tanggal)}
              </p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-xl">
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-100">Atlet</p>
              <p className="mt-1 text-lg font-bold">{nama}</p>
              <p className="text-xs text-brand-100">
                {aktif.jenjang ?? '-'} {aktif.kelas ? `· ${aktif.kelas}` : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[280px_1fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-amber-50 p-5">
              <div className="flex justify-around gap-2">
                <ProgressRing value={aktif.skor_keseluruhan} label="Skor" />
                <ProgressRing value={aktif.kehadiran_persen} label="Kehadiran" color="#f59e0b" />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-brand-100 pt-4 text-center text-xs">
                <div>
                  <p className="font-bold text-slate-900">{aktif.peringkat ?? '-'}</p>
                  <p className="mt-0.5 text-slate-500">Peringkat</p>
                </div>
                <div>
                  <p className="font-bold text-slate-900">{aktif.cabang ?? '-'}</p>
                  <p className="mt-0.5 text-slate-500">Cabang</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5">
              <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <UserRound size={16} className="text-brand-600" /> Identitas Latihan
              </h3>
              <dl className="mt-3 space-y-2 text-xs">
                {[
                  ['Jenjang', aktif.jenjang],
                  ['Kelas', aktif.kelas],
                  ['Cabang', aktif.cabang],
                  ['Pelatih', aktif.pelatih],
                  ['Status', aktif.status],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-3 border-b border-slate-100 pb-2">
                    <dt className="text-slate-500">{label}</dt>
                    <dd className="text-right font-semibold text-slate-800">{value ?? '-'}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5">
              <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Award size={16} className="text-brand-600" /> Prestasi Periode Ini
              </h3>
              {aktif.prestasi.length ? (
                <ul className="mt-3 space-y-3">
                  {aktif.prestasi.map((item) => (
                    <li key={item.id} className="rounded-xl bg-brand-50/70 p-3">
                      <p className="text-xs font-bold text-slate-900">{item.judul}</p>
                      <p className="mt-1 text-[11px] text-slate-600">
                        {item.peringkat ?? '-'} &middot; {item.tingkat ?? '-'} &middot;{' '}
                        {tanggalRaport(item.tanggal)}
                      </p>
                      {item.penyelenggara && (
                        <p className="mt-1 text-[11px] text-slate-500">{item.penyelenggara}</p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-xs text-slate-500">Belum ada prestasi tercatat.</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-2">
                <Target size={17} className="text-brand-600" />
                <h3 className="text-sm font-bold text-slate-900">Profil Kemampuan</h3>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Perbandingan nilai periode ini dengan rata-rata seluruh periode.
              </p>
              <div className="mt-3">
                <RadarChart
                  labels={performaLabels}
                  series={[
                    { name: 'Periode ini', values: performaValues, color: '#b91c1c' },
                    { name: 'Rata-rata', values: rataValues, color: '#f59e0b' },
                  ]}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-2">
                <TrendingUp size={17} className="text-brand-600" />
                <h3 className="text-sm font-bold text-slate-900">Grafik Perkembangan Performa</h3>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Perkembangan nilai atlet dari periode ke periode.
              </p>
              <div className="mt-4 overflow-x-auto">
                <LineChart
                  labels={raport.map((item) => periodePendek(item.periode))}
                  series={grafikPerkembangan}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 p-5">
              <h3 className="text-sm font-bold text-slate-900">Pengukuran Fisik</h3>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {pengukuranItems.map((item) => (
                  <div key={item.label} className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[11px] text-slate-500">{item.label}</p>
                    <p className="mt-1 text-lg font-extrabold text-slate-900">
                      {item.value ?? '-'}
                      <span className="ml-1 text-[10px] font-semibold text-slate-500">
                        {item.satuan}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
              {pengukuran?.catatan && (
                <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs text-amber-900">
                  {pengukuran.catatan}
                </p>
              )}
            </section>

            <section className="rounded-2xl border border-slate-200 p-5">
              <h3 className="text-sm font-bold text-slate-900">Penilaian Performa</h3>
              <div className="table-wrap mt-3">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2 font-semibold">Aspek</th>
                      <th className="py-2 font-semibold">Nilai</th>
                      <th className="py-2 font-semibold">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aktif.performa.map((item) => (
                      <tr key={item.id} className="border-b border-slate-100">
                        <td className="py-2 font-semibold text-slate-800">{item.aspek}</td>
                        <td className="py-2">
                          <span className="inline-flex min-w-[44px] justify-center rounded-full bg-brand-50 px-2 py-1 font-bold text-brand-700">
                            {item.nilai}
                          </span>
                          {item.satuan && <span className="ml-1 text-[10px] text-slate-400">{item.satuan}</span>}
                        </td>
                        <td className="py-2 text-slate-600">{item.keterangan ?? '-'}</td>
                      </tr>
                    ))}
                    {!aktif.performa.length && (
                      <tr>
                        <td colSpan={3} className="py-3 text-slate-500">Belum ada penilaian performa.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 p-5">
              <h3 className="text-sm font-bold text-slate-900">Penilaian Kepribadian</h3>
              <div className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {(aktif.kepribadian.length
                  ? aktif.kepribadian.map((item) => ({
                      aspek: item.aspek,
                      nilai: item.nilai,
                      keterangan: item.keterangan,
                    }))
                  : ASPEK_KEPRIBADIAN.map((aspek) => ({ aspek, nilai: 0, keterangan: null }))
                ).map((item) => (
                  <div key={item.aspek}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{item.aspek}</span>
                      <span className="font-bold text-brand-700">{nilaiAman(item.nilai)}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-700 via-brand-500 to-amber-400"
                        style={{ width: `${nilaiAman(item.nilai)}%` }}
                      />
                    </div>
                    {item.keterangan && (
                      <p className="mt-1 text-[10px] leading-snug text-slate-500">{item.keterangan}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-brand-800">
                  <CheckCircle2 size={16} /> Catatan Pelatih
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-700">
                  {aktif.catatan ?? 'Belum ada catatan khusus pada periode ini.'}
                </p>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-amber-800">
                  <CalendarDays size={16} /> Rekomendasi Latihan
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-700">
                  {aktif.rekomendasi ?? 'Pertahankan konsistensi latihan dan evaluasi berkala bersama pelatih.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <footer className="grid gap-6 border-t border-slate-200 bg-slate-50 px-6 py-6 text-center text-xs text-slate-600 sm:grid-cols-2 sm:px-10">
          <div>
            <p>Mengetahui,</p>
            <p className="mt-8 font-semibold text-slate-900">........................................</p>
            <p className="mt-1">Pelatih</p>
          </div>
          <div>
            <p>Yogyakarta, {tanggalRaport(aktif.tanggal)}</p>
            <p className="mt-8 font-semibold text-slate-900">........................................</p>
            <p className="mt-1">Pengurus Tapak Suci</p>
          </div>
        </footer>
      </article>
    </div>
  )
}
