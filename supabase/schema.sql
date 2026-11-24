-- ============================================================================
-- Portal Informasi Pencak Silat Tapak Suci
-- Jalankan seluruh file ini di Supabase Dashboard > SQL Editor > New query
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- Enum types
-- ----------------------------------------------------------------------------
do $$ begin
  create type public.user_role as enum ('admin', 'pengurus', 'anggota');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.anggota_status as enum ('Aktif', 'Nonaktif');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.berita_status as enum ('draft', 'published');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.media_tipe as enum ('galeri', 'dokumen');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.keuangan_jenis as enum ('masuk', 'keluar');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.iuran_status as enum ('lunas', 'belum');
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- Tables
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text not null default '',
  role public.user_role not null default 'anggota',
  jabatan text,
  telepon text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Username opsional untuk login (selain email). Nullable agar user lama tetap valid.
alter table public.profiles add column if not exists username text unique;

create table if not exists public.anggota (
  id uuid primary key default gen_random_uuid(),
  nip text unique not null,
  nama text not null,
  jenjang text,
  jabatan text,
  cabang text,
  telepon text,
  email text,
  alamat text,
  tanggal_masuk date,
  status public.anggota_status not null default 'Aktif',
  foto_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.kegiatan (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  jenis text not null default 'Latihan',
  tanggal_mulai date not null,
  tanggal_selesai date,
  lokasi text,
  status text not null default 'Akan Datang',
  deskripsi text,
  gambar_url text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.berita (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  slug text unique not null,
  ringkasan text,
  konten text not null default '',
  penulis text,
  status public.berita_status not null default 'draft',
  published_at date,
  gambar_url text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  tipe public.media_tipe not null default 'galeri',
  kategori text,
  file_url text not null,
  keterangan text,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.keuangan (
  id uuid primary key default gen_random_uuid(),
  jenis public.keuangan_jenis not null,
  kategori text not null,
  keterangan text,
  jumlah numeric(14, 2) not null check (jumlah >= 0),
  tanggal date not null,
  bukti_url text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.iuran (
  id uuid primary key default gen_random_uuid(),
  anggota_id uuid not null references public.anggota(id) on delete cascade,
  periode text not null,
  jumlah numeric(14, 2) not null default 0,
  status public.iuran_status not null default 'belum',
  tanggal_bayar date,
  keterangan text,
  unique (anggota_id, periode),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Program latihan umum: dibaca semua pengguna, dikelola pengurus/admin.
create table if not exists public.program_latihan (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  jenis text not null default 'Latihan Reguler',
  target text,
  tanggal_mulai date not null,
  tanggal_selesai date,
  hari text,
  jam_mulai time,
  jam_selesai time,
  lokasi text,
  instruktur text,
  kuota integer,
  status text not null default 'Aktif',
  deskripsi text,
  gambar_url text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Program latihan khusus: hanya terlihat oleh penerima yang ditentukan admin.
create table if not exists public.program_khusus (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  jenis text not null default 'Latihan Khusus',
  target text,
  tanggal_mulai date not null,
  tanggal_selesai date,
  hari text,
  bulan text,
  jam_mulai time,
  jam_selesai time,
  lokasi text,
  instruktur text,
  kirim_ke_semua boolean not null default false,
  status text not null default 'Aktif',
  deskripsi text,
  gambar_url text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Penerima program khusus: satu baris per pengguna yang ditunjuk.
create table if not exists public.program_khusus_penerima (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.program_khusus(id) on delete cascade,
  profil_id uuid not null references public.profiles(id) on delete cascade,
  dibaca_at timestamptz,
  created_at timestamptz not null default now(),
  unique (program_id, profil_id)
);
create index if not exists program_khusus_penerima_profil_idx
  on public.program_khusus_penerima (profil_id);

-- ----------------------------------------------------------------------------
-- Helper functions
-- ----------------------------------------------------------------------------
-- Mengubah email atau username menjadi email untuk Supabase Auth.
-- security definer diperlukan agar form login (anon) bisa mencari username.
create or replace function public.email_for_login(identifier text)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select case
    when identifier like '%@%' then identifier
    else (select email from public.profiles where lower(username) = lower(identifier))
  end;
$$;

create or replace function public.current_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role = 'admin' from public.profiles where id = auth.uid()),
    false
  );
$$;

create or replace function public.is_pengurus()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role in ('admin', 'pengurus') from public.profiles where id = auth.uid()),
    false
  );
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    'anggota'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- auth.uid() kosong untuk akses server/SQL Editor; perubahan lewat API tetap
  -- dibatasi oleh RLS profiles_update (hanya admin).
  if new.role is distinct from old.role and auth.uid() is not null and not public.is_admin() then
    raise exception 'Hanya admin yang dapat mengubah peran pengguna';
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

drop trigger if exists protect_role on public.profiles;
create trigger protect_role
  before update on public.profiles
  for each row execute function public.protect_profile_role();

do $$
declare
  t text;
begin
  foreach t in array array['profiles','anggota','kegiatan','berita','media','keuangan','iuran','program_latihan','program_khusus'] loop
    execute format('drop trigger if exists touch_updated_at on public.%I', t);
    execute format(
      'create trigger touch_updated_at before update on public.%I for each row execute function public.touch_updated_at()',
      t
    );
  end loop;
end $$;

grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
grant execute on function public.email_for_login(text) to anon, authenticated;
grant execute on function public.current_role() to anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.is_pengurus() to anon, authenticated;

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.anggota enable row level security;
alter table public.kegiatan enable row level security;
alter table public.berita enable row level security;
alter table public.media enable row level security;
alter table public.keuangan enable row level security;
alter table public.iuran enable row level security;

-- profiles: hanya pengguna login yang bisa melihat; admin yang bisa mengubah peran
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select to authenticated
  using (
    id = auth.uid()
    or public.is_admin()
    or (public.is_pengurus() and role = 'anggota')
  );

drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles
  for insert to authenticated with check (id = auth.uid());

drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
  for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- Peran hanya bisa diubah admin (atau API service_role milik portal).
create or replace function public.jaga_peran_profil()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT'
     and new.role <> 'anggota'
     and auth.role() <> 'service_role'
     and not public.is_admin() then
    raise exception 'Hanya admin yang bisa membuat akun bukan anggota';
  end if;

  if tg_op = 'UPDATE'
     and new.role is distinct from old.role
     and auth.role() <> 'service_role'
     and not public.is_admin() then
    raise exception 'Hanya admin yang bisa mengubah peran pengguna';
  end if;

  return new;
end;
$$;

drop trigger if exists jaga_peran_profil on public.profiles;
create trigger jaga_peran_profil
before insert or update on public.profiles
for each row execute function public.jaga_peran_profil();

-- anggota: publik melihat yang Aktif, pengurus mengelola semua
drop policy if exists anggota_select on public.anggota;
create policy anggota_select on public.anggota
  for select using (status = 'Aktif' or public.is_pengurus());

drop policy if exists anggota_insert on public.anggota;
create policy anggota_insert on public.anggota
  for insert to authenticated with check (public.is_pengurus());

drop policy if exists anggota_update on public.anggota;
create policy anggota_update on public.anggota
  for update to authenticated using (public.is_pengurus()) with check (public.is_pengurus());

drop policy if exists anggota_delete on public.anggota;
create policy anggota_delete on public.anggota
  for delete to authenticated using (public.is_pengurus());

-- kegiatan: publik bisa membaca
drop policy if exists kegiatan_select on public.kegiatan;
create policy kegiatan_select on public.kegiatan for select using (true);

drop policy if exists kegiatan_insert on public.kegiatan;
create policy kegiatan_insert on public.kegiatan
  for insert to authenticated with check (public.is_pengurus());

drop policy if exists kegiatan_update on public.kegiatan;
create policy kegiatan_update on public.kegiatan
  for update to authenticated using (public.is_pengurus()) with check (public.is_pengurus());

drop policy if exists kegiatan_delete on public.kegiatan;
create policy kegiatan_delete on public.kegiatan
  for delete to authenticated using (public.is_pengurus());

-- berita: publik hanya melihat yang published
drop policy if exists berita_select on public.berita;
create policy berita_select on public.berita
  for select using (status = 'published' or public.is_pengurus());

drop policy if exists berita_insert on public.berita;
create policy berita_insert on public.berita
  for insert to authenticated with check (public.is_pengurus());

drop policy if exists berita_update on public.berita;
create policy berita_update on public.berita
  for update to authenticated using (public.is_pengurus()) with check (public.is_pengurus());

drop policy if exists berita_delete on public.berita;
create policy berita_delete on public.berita
  for delete to authenticated using (public.is_pengurus());

-- media: galeri & dokumen dapat dibaca publik
drop policy if exists media_select on public.media;
create policy media_select on public.media for select using (true);

drop policy if exists media_insert on public.media;
create policy media_insert on public.media
  for insert to authenticated with check (public.is_pengurus());

drop policy if exists media_update on public.media;
create policy media_update on public.media
  for update to authenticated using (public.is_pengurus()) with check (public.is_pengurus());

drop policy if exists media_delete on public.media;
create policy media_delete on public.media
  for delete to authenticated using (public.is_pengurus());

-- keuangan & iuran: hanya pengguna login, tulis oleh pengurus/admin
drop policy if exists keuangan_select on public.keuangan;
create policy keuangan_select on public.keuangan
  for select to authenticated using (true);

drop policy if exists keuangan_insert on public.keuangan;
create policy keuangan_insert on public.keuangan
  for insert to authenticated with check (public.is_pengurus());

drop policy if exists keuangan_update on public.keuangan;
create policy keuangan_update on public.keuangan
  for update to authenticated using (public.is_pengurus()) with check (public.is_pengurus());

drop policy if exists keuangan_delete on public.keuangan;
create policy keuangan_delete on public.keuangan
  for delete to authenticated using (public.is_admin());

drop policy if exists iuran_select on public.iuran;
create policy iuran_select on public.iuran
  for select to authenticated
  using (
    public.is_pengurus()
    or exists (
      select 1
      from public.anggota a
      join public.profiles p on lower(p.email) = lower(a.email)
      where a.id = iuran.anggota_id
        and p.id = auth.uid()
    )
  );

drop policy if exists iuran_insert on public.iuran;
create policy iuran_insert on public.iuran
  for insert to authenticated with check (public.is_pengurus());

drop policy if exists iuran_update on public.iuran;
create policy iuran_update on public.iuran
  for update to authenticated using (public.is_pengurus()) with check (public.is_pengurus());

drop policy if exists iuran_delete on public.iuran;
create policy iuran_delete on public.iuran
  for delete to authenticated using (public.is_pengurus());

alter table public.program_latihan enable row level security;
alter table public.program_khusus enable row level security;
alter table public.program_khusus_penerima enable row level security;

-- program_latihan: semua orang boleh membaca, pengurus/admin mengelola
drop policy if exists program_latihan_select on public.program_latihan;
create policy program_latihan_select on public.program_latihan
  for select using (true);

drop policy if exists program_latihan_insert on public.program_latihan;
create policy program_latihan_insert on public.program_latihan
  for insert to authenticated with check (public.is_pengurus());

drop policy if exists program_latihan_update on public.program_latihan;
create policy program_latihan_update on public.program_latihan
  for update to authenticated using (public.is_pengurus()) with check (public.is_pengurus());

drop policy if exists program_latihan_delete on public.program_latihan;
create policy program_latihan_delete on public.program_latihan
  for delete to authenticated using (public.is_pengurus());

-- program_khusus: hanya admin yang mengelola; hanya penerima (atau semua anggota
-- bila kirim_ke_semua) yang melihat. Pengurus/admin selalu melihat untuk keperluan pantauan.
drop policy if exists program_khusus_select on public.program_khusus;
create policy program_khusus_select on public.program_khusus
  for select using (
    public.is_pengurus()
    or (
      auth.uid() is not null
      and status = 'Aktif'
      and (
        kirim_ke_semua
        or exists (
          select 1 from public.program_khusus_penerima p
          where p.program_id = program_khusus.id
            and p.profil_id = auth.uid()
        )
      )
    )
  );

drop policy if exists program_khusus_insert on public.program_khusus;
create policy program_khusus_insert on public.program_khusus
  for insert to authenticated with check (public.is_admin());

drop policy if exists program_khusus_update on public.program_khusus;
create policy program_khusus_update on public.program_khusus
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists program_khusus_delete on public.program_khusus;
create policy program_khusus_delete on public.program_khusus
  for delete to authenticated using (public.is_admin());

-- penerima: anggota melihat/tandai dibaca miliknya saja, admin mengelola seluruhnya
drop policy if exists program_khusus_penerima_select on public.program_khusus_penerima;
create policy program_khusus_penerima_select on public.program_khusus_penerima
  for select using (profil_id = auth.uid() or public.is_pengurus());

drop policy if exists program_khusus_penerima_insert on public.program_khusus_penerima;
create policy program_khusus_penerima_insert on public.program_khusus_penerima
  for insert to authenticated with check (public.is_admin());

drop policy if exists program_khusus_penerima_update on public.program_khusus_penerima;
create policy program_khusus_penerima_update on public.program_khusus_penerima
  for update to authenticated
  using (profil_id = auth.uid() or public.is_admin())
  with check (profil_id = auth.uid() or public.is_admin());

drop policy if exists program_khusus_penerima_delete on public.program_khusus_penerima;
create policy program_khusus_penerima_delete on public.program_khusus_penerima
  for delete to authenticated using (public.is_admin());

-- ----------------------------------------------------------------------------
-- Storage buckets & policies
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

insert into storage.buckets (id, name, public)
values ('bukti', 'bukti', false)
on conflict (id) do nothing;

drop policy if exists media_storage_read on storage.objects;
create policy media_storage_read on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists media_storage_write on storage.objects;
create policy media_storage_write on storage.objects
  for all to authenticated
  using (bucket_id = 'media' and public.is_pengurus())
  with check (bucket_id = 'media' and public.is_pengurus());

drop policy if exists bukti_storage_read on storage.objects;
create policy bukti_storage_read on storage.objects
  for select to authenticated
  using (bucket_id = 'bukti' and public.is_pengurus());

drop policy if exists bukti_storage_write on storage.objects;
create policy bukti_storage_write on storage.objects
  for all to authenticated
  using (bucket_id = 'bukti' and public.is_pengurus())
  with check (bucket_id = 'bukti' and public.is_pengurus());

-- ----------------------------------------------------------------------------
-- Data contoh (boleh dihapus setelah data asli diisi)
-- ----------------------------------------------------------------------------
insert into public.anggota (nip, nama, jenjang, jabatan, cabang, telepon, email, tanggal_masuk, status)
values
  ('TS-2026-001', 'Dewi Anggraini', 'Utama', 'Ketua', 'Jakarta Pusat', '0812-1000-0001', 'dewi@example.com', '2020-01-10', 'Aktif'),
  ('TS-2026-002', 'Rizky Pratama', 'Madya', 'Sekretaris', 'Jakarta Pusat', '0812-1000-0002', 'rizky@example.com', '2021-03-15', 'Aktif'),
  ('TS-2026-003', 'Siti Nurhaliza', 'Muda', 'Bendahara', 'Jakarta Selatan', '0812-1000-0003', 'siti@example.com', '2022-07-01', 'Aktif'),
  ('TS-2026-004', 'Ahmad Fauzi', 'Pembina', 'Pelatih', 'Jakarta Timur', '0812-1000-0004', 'ahmad@example.com', '2019-05-20', 'Aktif')
on conflict (nip) do nothing;

insert into public.kegiatan (judul, jenis, tanggal_mulai, tanggal_selesai, lokasi, status, deskripsi)
select 'Latihan Dasar Pencak Silat', 'Latihan', '2026-12-06', null, 'Gedung Serbaguna Jakarta Pusat', 'Akan Datang', 'Latihan dasar untuk anggota baru.'
where not exists (select 1 from public.kegiatan where judul = 'Latihan Dasar Pencak Silat');

insert into public.kegiatan (judul, jenis, tanggal_mulai, tanggal_selesai, lokasi, status, deskripsi)
select 'Seminar Sejarah Tapak Suci', 'Seminar', '2026-12-13', '2026-12-13', 'Aula Kantor Cabang', 'Akan Datang', 'Mengenal sejarah dan nilai-nilai Tapak Suci.'
where not exists (select 1 from public.kegiatan where judul = 'Seminar Sejarah Tapak Suci');

insert into public.berita (judul, slug, ringkasan, konten, penulis, status, published_at)
values
  (
    'Selamat Datang di Portal Informasi Tapak Suci',
    'selamat-datang-portal-tapak-suci',
    'Portal resmi untuk berita, jadwal, dan informasi organisasi.',
    'Selamat datang di portal informasi organisasi pencak silat Tapak Suci. Di sini Anda dapat melihat berita terbaru, jadwal latihan, profil anggota, galeri kegiatan, dan dokumen penting.',
    'Pengurus Tapak Suci',
    'published',
    '2026-11-01'
  ),
  (
    'Pendaftaran Anggota Baru Dibuka',
    'pendaftaran-anggota-baru-dibuka',
    'Pendaftaran terbuka untuk usia 7 tahun ke atas.',
    'Pendaftaran anggota baru untuk periode berikutnya telah dibuka. Silakan hubungi cabang terdekat untuk informasi jadwal latihan dan persyaratan.',
    'Sekretariat',
    'published',
    '2026-11-10'
  )
on conflict (slug) do nothing;

insert into public.media (judul, tipe, kategori, file_url, keterangan)
select 'Foto Latihan Bersama', 'galeri', 'Latihan', '/prestasi-gelanggang.jpg', 'Dokumentasi latihan bersama anggota.'
where not exists (select 1 from public.media where judul = 'Foto Latihan Bersama');

insert into public.media (judul, tipe, kategori, file_url, keterangan)
select 'AD/ART Tapak Suci', 'dokumen', 'Tata Kelola', '/login-silat.jpg', 'Anggaran Dasar dan Anggaran Rumah Tangga (contoh).'
where not exists (select 1 from public.media where judul = 'AD/ART Tapak Suci');

insert into public.keuangan (jenis, kategori, keterangan, jumlah, tanggal)
select 'masuk', 'Iuran', 'Iuran anggota bulan November', 1500000, '2026-11-05'
where not exists (select 1 from public.keuangan where keterangan = 'Iuran anggota bulan November');

insert into public.keuangan (jenis, kategori, keterangan, jumlah, tanggal)
select 'keluar', 'Operasional', 'Pembelian alat latihan', 450000, '2026-11-12'
where not exists (select 1 from public.keuangan where keterangan = 'Pembelian alat latihan');

insert into public.iuran (anggota_id, periode, jumlah, status, tanggal_bayar)
select (select id from public.anggota where nip = 'TS-2026-001'), 'November 2026', 150000, 'lunas', '2026-11-05'
where exists (select 1 from public.anggota where nip = 'TS-2026-001')
  and not exists (select 1 from public.iuran where periode = 'November 2026' and anggota_id = (select id from public.anggota where nip = 'TS-2026-001'));

insert into public.program_latihan
  (judul, jenis, target, tanggal_mulai, tanggal_selesai, hari, jam_mulai, jam_selesai, lokasi, instruktur, kuota, status, deskripsi)
select 'Latihan Dasar Pencak Silat', 'Latihan Reguler', 'Anggota baru usia 7 tahun ke atas', '2026-12-01', '2026-12-31', 'Senin, Rabu', '16:00', '18:00', 'Gedung Serbaguna Jakarta Pusat', 'Pelatih Tapak Suci', 30, 'Aktif', 'Pembentukan dasar gerak, sikap, dan etika pencak silat untuk anggota baru.'
where not exists (select 1 from public.program_latihan where judul = 'Latihan Dasar Pencak Silat');

insert into public.program_latihan
  (judul, jenis, target, tanggal_mulai, tanggal_selesai, hari, jam_mulai, jam_selesai, lokasi, instruktur, kuota, status, deskripsi)
select 'Latihan Lanjutan Teknik Serangan', 'Latihan Lanjutan', 'Anggota jenjang Madya dan Utama', '2026-12-05', '2027-01-20', 'Sabtu', '09:00', '12:00', 'Aula Cabang Jakarta Selatan', 'Ahmad Fauzi', 20, 'Aktif', 'Penyempurnaan teknik serangan, tangkapan, dan strategi pertandingan.'
where not exists (select 1 from public.program_latihan where judul = 'Latihan Lanjutan Teknik Serangan');

insert into public.program_latihan
  (judul, jenis, target, tanggal_mulai, tanggal_selesai, hari, jam_mulai, jam_selesai, lokasi, instruktur, kuota, status, deskripsi)
select 'Pembinaan Mental dan Disiplin', 'Pembinaan', 'Seluruh anggota aktif', '2027-01-03', '2027-01-31', 'Minggu', '08:00', '10:00', 'Lapangan Cabang Jakarta Timur', 'Dewi Anggraini', 40, 'Aktif', 'Penguatan karakter, disiplin, dan nilai-nilai kekeluargaan Tapak Suci.'
where not exists (select 1 from public.program_latihan where judul = 'Pembinaan Mental dan Disiplin');

insert into public.program_khusus
  (judul, jenis, target, tanggal_mulai, tanggal_selesai, hari, bulan, jam_mulai, jam_selesai, lokasi, instruktur, kirim_ke_semua, status, deskripsi)
select 'Persiapan Khusus Pertandingan Antar Cabang', 'Latihan Intensif', 'Anggota yang akan bertanding', '2026-12-10', '2026-12-24', 'Selasa, Kamis, Sabtu', 'Desember', '15:30', '18:00', 'Gedung Serbaguna Jakarta Pusat', 'Tim Pelatih Tapak Suci', true, 'Aktif', 'Program intensif persiapan pertandingan antar cabang: sparring terkontrol, strategi, dan pengukuran performa.'
where not exists (select 1 from public.program_khusus where judul = 'Persiapan Khusus Pertandingan Antar Cabang');

-- ============================================================================
-- Selesai. Selanjutnya: buat user pertama dan angkat menjadi admin.
-- Di Supabase > Authentication > Users > Add user, lalu jalankan:
-- update public.profiles set role = 'admin' where email = 'email-admin-anda@example.com';
-- ============================================================================
