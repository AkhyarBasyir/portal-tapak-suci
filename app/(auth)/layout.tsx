import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowUpRight,
  CalendarDays,
  MapPin,
  Newspaper,
  Quote,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
function LogoMark({ ukuran = 44 }: { ukuran?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-2xl bg-white shadow-lg shadow-black/10 ring-1 ring-black/5"
      style={{ width: ukuran, height: ukuran }}
    >
      <Image
        src="/tapak-suci-logo.webp"
        alt="Lambang Tapak Suci"
        width={ukuran - 8}
        height={ukuran - 8}
        className="h-[calc(100%-8px)] w-[calc(100%-8px)] object-contain"
        priority
      />
    </span>
  )
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const tahun = new Date().getFullYear()

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f6f6f7] text-slate-900">
      <div className="pointer-events-none absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-brand-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-amber-100/50 blur-3xl" />

      <div className="relative grid min-h-screen lg:grid-cols-[1.06fr_0.94fr]">
        {/* Panel visual */}
        <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-[#170a0a] p-10 text-white lg:flex xl:p-14">
          <div className="absolute inset-0">
            <Image
              src="/login-silat.jpg"
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 53vw, 100vw"
              className="object-cover object-center opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-brand-800/95 via-[#4c0d0d]/92 to-[#120808]/97" />
            <div className="auth-grid absolute inset-0 opacity-40" />
            <div className="absolute -left-24 top-24 h-80 w-80 animate-aura rounded-full bg-brand-500/30 blur-3xl" />
            <div className="absolute bottom-10 right-0 h-72 w-72 animate-float rounded-full bg-amber-500/10 blur-3xl" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#120808] to-transparent" />
          </div>

          <header className="relative z-10 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <LogoMark />
              <span>
                <span className="block text-base font-bold leading-tight tracking-tight">
                  Tapak Suci
                </span>
                <span className="block text-xs font-medium uppercase tracking-[0.2em] text-white/70">
                  Portal Resmi
                </span>
              </span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3.5 py-2 text-xs font-semibold text-white/80 transition hover:border-white/40 hover:bg-white/10 hover:text-white"
            >
              Kembali ke beranda <ArrowUpRight size={14} />
            </Link>
          </header>

          <div className="relative z-10 max-w-xl animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-amber-200">
              <Sparkles size={13} /> Pembinaan Generasi Berakhlak
            </span>

            <h2 className="mt-6 text-[2.85rem] font-bold leading-[1.08] tracking-tight xl:text-6xl">
              Satu gerakan,
              <br />
              <span className="bg-gradient-to-r from-amber-200 via-white to-brand-200 bg-clip-text text-transparent">
                satu informasi.
              </span>
            </h2>

            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/70">
              Jadwal latihan, program khusus, berita, dan dokumen organisasi hadir dalam satu
              ruang. Masuk untuk tetap terhubung dengan perkembangan Tapak Suci.
            </p>

            <div className="mt-9 grid max-w-lg grid-cols-3 gap-3">
              {[
                { icon: Users, label: 'Anggota', detail: 'Satu komunitas' },
                { icon: CalendarDays, label: 'Jadwal', detail: 'Latihan & kegiatan' },
                { icon: Newspaper, label: 'Berita', detail: 'Info terbaru' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/12 bg-white/[0.07] p-3.5 backdrop-blur-md transition hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.11]"
                >
                  <item.icon size={17} className="text-amber-200" />
                  <p className="mt-3 text-sm font-bold leading-none">{item.label}</p>
                  <p className="mt-1.5 text-[11px] leading-tight text-white/70">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>

            <figure className="mt-8 max-w-lg rounded-2xl border-l-2 border-amber-300/70 bg-white/[0.04] px-5 py-4">
              <Quote size={18} className="text-amber-300/80" />
              <blockquote className="mt-2 text-sm italic leading-relaxed text-white/75">
                Dengan iman dan akhlak saya menjadi kuat, tanpa iman dan akhlak saya menjadi
                lemah.
              </blockquote>
              <figcaption className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
                Motto Tapak Suci
              </figcaption>
            </figure>
          </div>

          <footer className="relative z-10 flex items-center justify-between text-xs text-white/70">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={13} /> Data tersimpan aman di cloud
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={13} /> Yogyakarta, Indonesia
            </span>
            <span>Foto ilustrasi: Pexels</span>
          </footer>
        </section>

        {/* Panel formulir */}
        <section className="relative flex min-h-screen flex-col">
          <header className="flex items-center justify-between border-b border-slate-200/70 bg-white/70 px-5 py-4 backdrop-blur lg:hidden">
            <Link href="/" className="flex items-center gap-3">
              <LogoMark ukuran={38} />
              <span>
                <span className="block text-sm font-bold leading-tight text-slate-900">
                  Tapak Suci
                </span>
                <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
                  Portal Informasi
                </span>
              </span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-brand-200 hover:text-brand-700"
            >
              Beranda <ArrowUpRight size={13} />
            </Link>
          </header>

          <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8 sm:py-12">
            <div className="w-full max-w-[450px] animate-fade-up">{children}</div>
          </div>

          <footer className="hidden items-center justify-between border-t border-slate-200/70 px-10 py-5 text-xs text-slate-600 lg:flex">
            <span>© {tahun} Tapak Suci Putera Muhammadiyah</span>
            <span>Dibangun untuk kemajuan organisasi</span>
          </footer>
        </section>
      </div>
    </div>
  )
}
