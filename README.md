# Portal Informasi Pencak Silat Tapak Suci

Website portal informasi organisasi dengan CRUD lengkap, database cloud, login, dan hak akses berbasis peran. **Tidak memerlukan server lokal** saat produksi: aplikasi dijalankan di Vercel, database dan file tersimpan di Supabase, sehingga dapat diakses dari mana saja dan kapan saja selama ada internet.

## Teknologi yang dipilih

| Kebutuhan | Layanan / Teknologi |
| --- | --- |
| UI & aplikasi | Next.js 16 (App Router) + Tailwind CSS + TypeScript |
| Database | Supabase PostgreSQL (tier gratis) |
| Autentikasi | Supabase Auth (email & kata sandi) |
| Penyimpanan file | Supabase Storage (bucket `media` publik, `bukti` privat) |
| Hosting | Vercel (serverless / edge, tier gratis) |
| Domain | Vercel default atau domain sendiri (opsional) |

## Fitur

### Halaman publik
- **Beranda cinematic yang dinamis**: hero dengan foto pencak silat, gradasi Nusantara/Jawa/Wayang bermotif mega mendung, animasi, marquee, kartu "Dua Bidang, Satu Semangat", sorotan sanggar, jadwal latihan, prestasi, berita, dan pilihan login
- Beranda dan halaman program publik hanya menampilkan **program Umum**; program khusus/intensif/pertandingan tidak pernah tampil ke publik
- **Dua bidang utama**: Prestasi di Gelanggang dan Seni Pertunjukan Pentas, masing-masing punya halaman khusus
- **Sanggar Seni Budaya Surya Manggala Integra** (`/sanggar`): sendratari, penampilan, tradisi pencak silat, sosiodrama, dan pembinaan akhlak berlandaskan Al-Qur'an dan Sunnah, lengkap dengan jadwal penampilan
- **Prestasi** (`/prestasi`) dikelompokkan menjadi gelanggang dan seni pertunjukan
- **Jadwal latihan di beranda** diambil langsung dari `program_latihan`, sehingga perubahan admin langsung tampil
- Berita & pengumuman + halaman detail per artikel
- Jadwal kegiatan
- **Program Latihan**: tab **Umum** (jadwal, macam program, target, filter jenis & pencarian) dan tab **Khusus** (tombol hanya muncul untuk anggota/pengurus/admin yang login; isi hanya untuk anggota yang ditunjuk admin, dengan status sudah dibaca). Beranda dan area publik hanya menampilkan program dengan jenis Umum, tanpa filter sub-jenis.
- Profil anggota aktif
- Galeri foto
- Arsip dokumen dengan tombol unduh
- **Kredit Foto** (`/kredit-foto`): atribusi seluruh foto pencak silat berlisensi terbuka yang dipakai portal

### Dashboard (setelah login)
- **Halaman masuk yang elegan dan responsif**: pemilih peran interaktif, tampilkan/sembunyikan kata sandi, peringatan Caps Lock, serta opsi mengingat username (kata sandi tidak pernah disimpan)
- **Ringkasan** statistik
- CRUD **Anggota & jabatan**
- **Konten Beranda** (`/dashboard/beranda_konten`) untuk pengurus: satu halaman bertab untuk **Teks Beranda**, **Kegiatan**, **Berita**, **Prestasi**, dan **Dokumen & Galeri**; link lama otomatis diarahkan ke tab yang sesuai
- **Kelola Program Latihan** (`/dashboard/program-latihan`): form lengkap untuk program umum dan khusus, pilih hari/bulan, rentang tanggal, jam, target, kuota, upload gambar, serta kirim ke semua anggota atau beberapa akun tertentu
- CRUD **Keuangan & kas** (bukti transaksi di bucket privat)
- CRUD **Iuran anggota**
- **Pengguna** (khusus admin): tambah & ubah akun (admin/pengurus/anggota), atur peran, dan ganti password pengguna lain—semuanya dalam satu menu
- **Ganti Password**: anggota dan pengurus dapat mengubah password sendiri dari menu tersendiri; admin melakukannya lewat menu **Pengguna**
- **Raport Saya** (`/dashboard/raport-saya`): raport atlet dengan grafik radar dan garis, pengukuran fisik (tinggi, berat, lingkar tubuh, denyut nadi), performa (power, kecepatan, VO2 max, teknik, strategi, mental), prestasi, penilaian kepribadian 12 aspek, tombol **Simpan PDF** (print) dan **Unduh Raport** (HTML)
- **Raport Atlet** (`/dashboard/raport_atlet`) untuk pengurus: satu halaman bertab untuk **Data Raport**, **Pengukuran Fisik**, **Performa Atlet**, **Prestasi Atlet**, dan **Kepribadian**; link lama otomatis diarahkan ke tab yang sesuai
- Kelola **Pengguna & hak akses** (khusus admin), termasuk pembuatan akun baru dengan peran admin/pengurus/anggota dan penggantian password

### Hak akses

| Data | Admin | Pengurus | Anggota | Publik |
| --- | --- | --- | --- | --- |
| Anggota | Tambah/Ubah/Hapus | Tambah/Ubah/Hapus | Lihat | Lihat yang Aktif |
| Kegiatan | Tambah/Ubah/Hapus | Tambah/Ubah/Hapus | Lihat | Lihat |
| Program latihan umum | Tambah/Ubah/Hapus | Tambah/Ubah/Hapus | Lihat | Lihat |
| Program latihan khusus | Tambah/Ubah/Hapus | Lihat saja | Lihat yang ditujukan padanya | Tidak bisa lihat |
| Berita | Tambah/Ubah/Hapus | Tambah/Ubah/Hapus | Lihat | Lihat yang diterbitkan |
| Dokumen & galeri | Tambah/Ubah/Hapus | Tambah/Ubah/Hapus | Lihat | Lihat |
| Keuangan | Tambah/Ubah/Hapus | Tambah/Ubah | Lihat | Tidak bisa lihat |
| Iuran | Tambah/Ubah/Hapus | Tambah/Ubah/Hapus | Lihat | Tidak bisa lihat |
| Pengguna | Tambah/Ubah akun & ganti password | Lihat profil | Ubah profil sendiri | Tidak bisa lihat |
| Raport atlet | Tambah/Ubah/Hapus | Tambah/Ubah/Hapus | Lihat raport sendiri yang Terbit/Arsip | Tidak bisa lihat |

Aturan di atas tidak hanya ada di tampilan, tetapi juga diterapkan di **Row Level Security (RLS)** Supabase dan trigger database, sehingga data tetap aman walaupun ada permintaan langsung ke API.

---

## Status setup saat ini

Supabase sudah aktif dan terhubung ke aplikasi lokal.

| Item | Status |
| --- | --- |
| Project Supabase | Sudah dibuat (`portal-tapak-suci`) |
| Schema | Sudah dijalankan (tabel, RLS, storage, data contoh) |
| Akun admin pertama | Sudah dibuat dan role-nya sudah `admin` |
| `.env.local` | Sudah diisi dengan Project URL + anon key |
| GitHub | `https://github.com/AkhyarBasyir/portal-tapak-suci` |
| Vercel | `https://portal-tapak-suci.vercel.app` |
| Auto deploy | Aktif: setiap push ke `main` otomatis di-deploy |

> URL produksi sudah diuji: beranda, berita, login admin, dan dashboard menampilkan data langsung dari Supabase. Kredensial detail (URL, anon key, email/password admin, dan database password) tersimpan di `credentials.local.md` yang **tidak ikut di-push** ke repository. Segera ganti kata sandi admin setelah login pertama di **Supabase → Authentication → Users**.

Data contoh yang sudah masuk: 4 anggota, 2 kegiatan, 2 berita, 2 media, 2 catatan keuangan, 1 iuran, dan 3 raport atlet lengkap dengan pengukuran, performa, prestasi, serta kepribadian (hasil migrasi `supabase/migration-raport-atlet.sql`).

---

## Langkah 1 — Buat project Supabase

1. Buka https://supabase.com dan buat project baru (pilih region terdekat, misalnya Singapore).
2. Buka **SQL Editor → New query**.
3. Salin seluruh isi [`supabase/schema.sql`](supabase/schema.sql), lalu jalankan.
4. Script di atas akan membuat:
   - semua tabel + enum,
   - function keamanan (`is_admin`, `is_pengurus`),
   - trigger profil otomatis saat admin membuat akun,
   - kebijakan RLS,
   - bucket `media` (publik) dan `bukti` (privat),
   - data contoh.
5. Jalankan juga migrasi lanjutan berikut secara berurutan di SQL Editor yang sama:
   - [`supabase/migration-sanggar.sql`](supabase/migration-sanggar.sql) — konten beranda, fokus sanggar, penampilan, prestasi;
   - [`supabase/migration-raport-atlet.sql`](supabase/migration-raport-atlet.sql) — raport atlet, pengukuran fisik, performa, prestasi, kepribadian, dan RLS-nya;
   - [`supabase/migration-service-role-grants.sql`](supabase/migration-service-role-grants.sql) — grant akses `service_role` supaya menu **Pengguna** bisa menambah/ubah akun dan password;
   - [`supabase/migration-service-role-profile-role.sql`](supabase/migration-service-role-profile-role.sql) — sinkronisasi trigger peran agar perubahan role lewat Admin API diizinkan.

   Keempatnya idempoten, jadi aman dijalankan ulang.

## Langkah 2 — Buat akun admin pertama

1. Di Supabase, buka **Authentication → Users → Add user**.
2. Masukkan email & kata sandi admin, lalu centang **Auto confirm user**.
3. Buka **SQL Editor** dan jalankan:

```sql
update public.profiles
set role = 'admin'
where email = 'email-admin-anda@example.com';
```

4. Untuk akun pengurus:

```sql
update public.profiles
set role = 'pengurus'
where email = 'email-pengurus@example.com';
```

> Catatan: Pendaftaran publik sudah dihapus. **Seluruh akun anggota dan pengurus dibuat oleh admin** lewat **Dashboard → Pengguna → Tambah Pengguna**, sekaligus menentukan perannya. Matikan juga *Allow new users to sign up* di **Supabase Dashboard → Authentication → Providers → Email** agar akun tidak bisa dibuat lewat API publik. Calon anggota/pengurus meminta akun melalui email/WhatsApp pengurus.

## Langkah 3 — Isi environment variable

Salin `.env.example` menjadi `.env.local`:

```bash
cp .env.example .env.local
```

Ambil nilai dari **Supabase → Project Settings → API**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

`SUPABASE_SERVICE_ROLE_KEY` dipakai hanya di server oleh menu admin **Pengguna** untuk membuat/ubah akun dan mengganti password. Jangan pernah diberi awalan `NEXT_PUBLIC_` karena kunci ini tidak boleh sampai ke browser.

## Langkah 4 — Jalankan di komputer (hanya untuk development)

```bash
npm install
npm run dev
```

Buka http://localhost:3000.

> Ini **hanya untuk pengembangan**. Aplikasi produksi tidak bergantung pada komputer/local server.

## Langkah 5 — Deploy ke Vercel (tanpa server lokal)

1. Push proyek ini ke GitHub/GitLab.
2. Buka https://vercel.com → **Add New → Project** → import repository.
3. Pada **Environment Variables**, tambahkan variabel yang sama:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (tanpa `NEXT_PUBLIC_`; dipakai untuk fitur admin)
4. Klik **Deploy**.
5. Setelah selesai, Vercel memberi URL seperti `https://portal-tapak-suci.vercel.app`.
6. (Opsional) Tambahkan domain sendiri di **Project Settings → Domains** dan arahkan DNS sesuai petunjuk Vercel.

Selesai. Website dapat diakses dari mana saja dan kapan saja. Komputer Anda tidak perlu menyala.

## Struktur folder

```text
app/
  (public)/            # Halaman publik: beranda, berita, kegiatan, anggota, galeri, dokumen
  (auth)/              # Halaman login
  dashboard/           # Area terlindungi + CRUD dinamis per entitas
components/
  auth/                # Form login (client)
  crud/                # Komponen CRUD generik
  site-header.tsx
  site-footer.tsx
  logout-button.tsx
lib/
  auth.ts              # Ambil profil & peran dari server
  crud-config.ts       # Konfigurasi field/kolom semua entitas
  data.ts              # Query untuk halaman publik & statistik
  supabase/            # Client browser, server, dan middleware
proxy.ts               # Proteksi route /dashboard dan redirect login
supabase/
  schema.sql                       # Schema lengkap + RLS + storage + data contoh
  migration-sanggar.sql            # Konten beranda & sanggar
  migration-raport-atlet.sql       # Raport atlet
  migration-service-role-grants.sql   # Grant service_role untuk fitur admin
  migration-service-role-profile-role.sql # Trigger peran untuk Admin API
```

> Untuk pemeriksaan tipe tanpa build: `npm run typecheck`.

## Menambah field atau entitas baru

1. Tambahkan kolom di `supabase/schema.sql` dan jalankan query ALTER di SQL Editor.
2. Tambahkan entitas/field di `lib/crud-config.ts`.
3. Jika ingin tampil di sidebar, tambahkan menu di `app/dashboard/layout.tsx`.

CRUD generik di `components/crud/crud-manager.tsx` akan otomatis menyesuaikan.

## Troubleshooting

| Masalah | Solusi |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL belum diisi` | Pastikan `.env.local` ada dan dengan benar, lalu restart `npm run dev`. Di Vercel, cek Environment Variables lalu redeploy. |
| Login berhasil tapi dashboard kosong / redirect terus | Pastikan user ada di tabel `profiles` (trigger berjalan saat user dibuat). Cek `select * from public.profiles;` |
| Upload gagal | Pastikan bucket `media` dan `bukti` sudah dibuat dan policy storage dari `schema.sql` aktif. |
| Berita tidak muncul di publik | Pastikan status `published` dan `published_at` terisi. |
| Error `new row violates row-level security policy` | Peran pengguna belum pengurus/admin, atau policy belum dibuat. Cek peran di tabel `profiles`. |
| Email konfirmasi tidak sampai | Di Supabase **Authentication → Providers → Email**, matikan *Confirm email* untuk development, atau gunakan email valid. |

## Catatan keamanan

- Kunci `anon` aman disimpan di frontend karena akses dikendalikan RLS.
- Jangan pernah memasukkan **service_role key** ke variabel `NEXT_PUBLIC_*`.
- Untuk produksi, aktifkan *Rate Limit* dan gunakan domain HTTPS (Vercel otomatis).
- Data keuangan sengaja tidak ditampilkan ke publik. Jika ingin transparansi publik, buat RPC khusus yang hanya mengembalikan agregat, bukan detail transaksi.
