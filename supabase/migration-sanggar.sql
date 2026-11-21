-- =============================================================================
-- Migrasi: Sanggar Surya Manggala Integra, Prestasi, dan Konten Beranda
-- Jalankan di Supabase Dashboard > SQL Editor. Idempoten.
-- =============================================================================

create table if not exists public.beranda_konten (
  id uuid primary key default gen_random_uuid(),
  kunci text not null unique,
  judul text not null,
  subtitle text,
  deskripsi text,
  gambar_url text,
  label_link text,
  link_url text,
  warna text,
  urutan integer not null default 0,
  status text not null default 'Aktif',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sanggar_fokus (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  subtitle text,
  deskripsi text,
  ikon text,
  gambar_url text,
  urutan integer not null default 0,
  status text not null default 'Aktif',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sanggar_penampilan (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  jenis text not null default 'Sendratari',
  tanggal_mulai date not null,
  tanggal_selesai date,
  jam_mulai time,
  jam_selesai time,
  lokasi text,
  target text,
  deskripsi text,
  gambar_url text,
  status text not null default 'Aktif',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.prestasi (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  kategori text not null default 'Gelanggang',
  tingkat text not null default 'Cabang',
  nama_peserta text,
  nama_sanggar text,
  tanggal date not null,
  penyelenggara text,
  deskripsi text,
  gambar_url text,
  status text not null default 'Aktif',
  urutan integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists beranda_konten_status_idx on public.beranda_konten (status, urutan);
create index if not exists sanggar_fokus_status_idx on public.sanggar_fokus (status, urutan);
create index if not exists sanggar_penampilan_tanggal_idx on public.sanggar_penampilan (tanggal_mulai);
create index if not exists prestasi_tanggal_idx on public.prestasi (tanggal desc);

do $$
declare t text;
begin
  foreach t in array array['beranda_konten', 'sanggar_fokus', 'sanggar_penampilan', 'prestasi'] loop
    execute format('drop trigger if exists touch_updated_at on public.%I', t);
    execute format('create trigger touch_updated_at before update on public.%I for each row execute function public.touch_updated_at()', t);
  end loop;
end $$;

grant all on all tables in schema public to anon, authenticated;

alter table public.beranda_konten enable row level security;
alter table public.sanggar_fokus enable row level security;
alter table public.sanggar_penampilan enable row level security;
alter table public.prestasi enable row level security;

-- Konten beranda
drop policy if exists beranda_konten_select on public.beranda_konten;
create policy beranda_konten_select on public.beranda_konten for select using (status = 'Aktif' or public.is_pengurus());
drop policy if exists beranda_konten_insert on public.beranda_konten;
create policy beranda_konten_insert on public.beranda_konten for insert to authenticated with check (public.is_pengurus());
drop policy if exists beranda_konten_update on public.beranda_konten;
create policy beranda_konten_update on public.beranda_konten for update to authenticated using (public.is_pengurus()) with check (public.is_pengurus());
drop policy if exists beranda_konten_delete on public.beranda_konten;
create policy beranda_konten_delete on public.beranda_konten for delete to authenticated using (public.is_pengurus());

-- Fokus sanggar
drop policy if exists sanggar_fokus_select on public.sanggar_fokus;
create policy sanggar_fokus_select on public.sanggar_fokus for select using (status = 'Aktif' or public.is_pengurus());
drop policy if exists sanggar_fokus_insert on public.sanggar_fokus;
create policy sanggar_fokus_insert on public.sanggar_fokus for insert to authenticated with check (public.is_pengurus());
drop policy if exists sanggar_fokus_update on public.sanggar_fokus;
create policy sanggar_fokus_update on public.sanggar_fokus for update to authenticated using (public.is_pengurus()) with check (public.is_pengurus());
drop policy if exists sanggar_fokus_delete on public.sanggar_fokus;
create policy sanggar_fokus_delete on public.sanggar_fokus for delete to authenticated using (public.is_pengurus());

-- Penampilan sanggar
drop policy if exists sanggar_penampilan_select on public.sanggar_penampilan;
create policy sanggar_penampilan_select on public.sanggar_penampilan for select using (status = 'Aktif' or public.is_pengurus());
drop policy if exists sanggar_penampilan_insert on public.sanggar_penampilan;
create policy sanggar_penampilan_insert on public.sanggar_penampilan for insert to authenticated with check (public.is_pengurus());
drop policy if exists sanggar_penampilan_update on public.sanggar_penampilan;
create policy sanggar_penampilan_update on public.sanggar_penampilan for update to authenticated using (public.is_pengurus()) with check (public.is_pengurus());
drop policy if exists sanggar_penampilan_delete on public.sanggar_penampilan;
create policy sanggar_penampilan_delete on public.sanggar_penampilan for delete to authenticated using (public.is_pengurus());

-- Prestasi
drop policy if exists prestasi_select on public.prestasi;
create policy prestasi_select on public.prestasi for select using (status = 'Aktif' or public.is_pengurus());
drop policy if exists prestasi_insert on public.prestasi;
create policy prestasi_insert on public.prestasi for insert to authenticated with check (public.is_pengurus());
drop policy if exists prestasi_update on public.prestasi;
create policy prestasi_update on public.prestasi for update to authenticated using (public.is_pengurus()) with check (public.is_pengurus());
drop policy if exists prestasi_delete on public.prestasi;
create policy prestasi_delete on public.prestasi for delete to authenticated using (public.is_pengurus());

-- Konten beranda
insert into public.beranda_konten (kunci, judul, subtitle, deskripsi, label_link, link_url, urutan) values
('hero_kicker', 'TAPAK SUCI × SURYA MANGGALA INTEGRA', null, null, null, null, 1),
('hero_judul', 'Bela diri berprestasi. Seni yang berakhlak.', null, null, null, null, 2),
('hero_deskripsi', 'Prestasi dan seni dalam satu wadah', null, 'Dua semangat dalam satu wadah: prestasi di gelanggang dan keindahan pertunjukan pentas, berpijak pada Al-Qur''an dan Sunnah.', null, null, 3),
('bidang_judul', 'Dua Bidang, Satu Semangat', null, 'Prestasi di gelanggang dan seni pertunjukan pentas saling menguatkan dalam pembinaan anggota Tapak Suci.', null, null, 4),
('sanggar_judul', 'Surya Manggala Integra', 'Sanggar Seni Budaya Tapak Suci', 'Sanggar yang menghadirkan sendratari, penampilan, tradisi pencak silat, dan sosiodrama yang dibalut gerak Tapak Suci serta nilai Al-Qur''an dan Sunnah.', 'Kenali Sanggar', '/sanggar', 5),
('motto', 'Dengan iman dan akhlak saya menjadi kuat, tanpa iman dan akhlak saya menjadi lemah.', 'Motto Tapak Suci', null, null, null, 6),
('cta_judul', 'Bergabung dan Berkarya Bersama Kami', null, 'Latihan, berprestasi, atau berpentas—semua punya ruang di Tapak Suci dan Surya Manggala Integra.', 'Hubungi Kami', 'mailto:pimpinanpusattapaksuci@gmail.com', 7)
on conflict (kunci) do nothing;

-- Fokus sanggar
insert into public.sanggar_fokus (judul, subtitle, deskripsi, ikon, urutan)
select v.judul, v.subtitle, v.deskripsi, v.ikon, v.urutan::integer
from (values
  ('Sendratari', 'Gerak yang bercerita', 'Pewarisan nilai melalui dramatari yang memadukan teknik pencak silat Tapak Suci dengan narasi budaya.', 'Drama', 1),
  ('Penampilan', 'Pentas yang berkelas', 'Penampilan di festival, acara organisasi, dan pertunjukan publik dengan standar artistik dan akhlak.', 'Sparkles', 2),
  ('Tradisi Pencak Silat', 'Budaya yang hidup', 'Pelestarian pola gerak, adat, dan filosofi pencak silat Tapak Suci sebagai warisan bangsa.', 'Swords', 3),
  ('Sosiodrama', 'Cerminan kehidupan', 'Pementasan bertema sosial yang mengangkat akhlak, kekeluargaan, dan penyelesaian masalah secara bijak.', 'Users', 4),
  ('Pembinaan Akhlak', 'Berpijak pada wahyu', 'Setiap proses kreatif diwarnai nilai Al-Qur''an dan Sunnah serta adab beladiri yang bertanggung jawab.', 'BookOpen', 5)
) as v(judul, subtitle, deskripsi, ikon, urutan)
where not exists (select 1 from public.sanggar_fokus f where f.judul = v.judul);

-- Penampilan sanggar
insert into public.sanggar_penampilan (judul, jenis, tanggal_mulai, jam_mulai, jam_selesai, lokasi, target, deskripsi)
select v.judul, v.jenis, v.tanggal_mulai::date, v.jam_mulai::time, v.jam_selesai::time, v.lokasi, v.target, v.deskripsi
from (values
  ('Sendratari Cahaya Kauman', 'Sendratari', '2026-12-20', '19:00', '21:00', 'Gedung Serbaguna Jakarta Pusat', 'Undangan dan masyarakat umum', 'Pertunjukan perdana yang mengangkat kisah perjuangan dan keihsanan dalam balutan gerak pencak silat.'),
  ('Sosiodrama Akhlak dan Silat', 'Sosiodrama', '2027-01-08', '16:00', '18:00', 'Aula Cabang Jakarta Selatan', 'Anggota dan orang tua', 'Sosiodrama tentang hijrah, sikap saling menghormati, dan penyelesaian konflik dengan adab.'),
  ('Tradisi Pencak Silat Tapak Suci', 'Tradisi Pencak Silat', '2027-02-14', '15:30', '17:30', 'Lapangan Cabang Jakarta Timur', 'Seluruh anggota', 'Penampilan pola dasar, jurus, dan permainan tradisional sebagai pelestarian budaya beladiri.')
) as v(judul, jenis, tanggal_mulai, jam_mulai, jam_selesai, lokasi, target, deskripsi)
where not exists (select 1 from public.sanggar_penampilan p where p.judul = v.judul);

-- Prestasi
insert into public.prestasi (judul, kategori, tingkat, nama_peserta, tanggal, penyelenggara, deskripsi, urutan)
select v.judul, v.kategori, v.tingkat, v.nama_peserta, v.tanggal::date, v.penyelenggara, v.deskripsi, v.urutan::integer
from (values
  ('Juara Umum Kejuaraan Pencak Silat Antar Cabang 2026', 'Gelanggang', 'Cabang', 'Tim Tapak Suci Jakarta Pusat', '2026-10-12', 'Pengcab IPSI Jakarta Pusat', 'Prestasi tertinggi pada kejuaraan antar cabang dengan penampilan teknik dan sportivitas yang konsisten.', 1),
  ('Best Performance Festival Sendratari Budaya 2026', 'Seni Pertunjukan', 'Kabupaten', 'Surya Manggala Integra', '2026-09-15', 'Dinas Kebudayaan Jakarta', 'Penilaian terbaik untuk unsur dramatik, koreografi, dan penyampaian nilai budaya.', 2),
  ('Finalis Sosiodrama Pencak Silat Tingkat Nasional', 'Seni Pertunjukan', 'Nasional', 'Surya Manggala Integra', '2026-08-03', 'PP Tapak Suci', 'Mengangkat tema akhlak dan kekeluargaan dalam bahasa gerak pencak silat di tingkat nasional.', 3)
) as v(judul, kategori, tingkat, nama_peserta, tanggal, penyelenggara, deskripsi, urutan)
where not exists (select 1 from public.prestasi p where p.judul = v.judul);

select
  (select count(*) from public.beranda_konten) as konten_beranda,
  (select count(*) from public.sanggar_fokus) as fokus_sanggar,
  (select count(*) from public.sanggar_penampilan) as penampilan,
  (select count(*) from public.prestasi) as prestasi;
