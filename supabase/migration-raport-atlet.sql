-- =============================================================================
-- Migrasi: Modul Raport Atlet, Pengukuran Fisik, dan Penilaian Performa
-- Jalankan di Supabase Dashboard > SQL Editor. Idempoten.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tabel utama
-- -----------------------------------------------------------------------------
create table if not exists public.raport_atlet (
  id uuid primary key default gen_random_uuid(),
  profil_id uuid not null references public.profiles(id) on delete cascade,
  anggota_id uuid references public.anggota(id) on delete set null,
  periode text not null,
  tanggal date not null default current_date,
  jenjang text,
  kelas text,
  cabang text,
  pelatih text,
  status text not null default 'Terbit' check (status in ('Draft', 'Terbit', 'Arsip')),
  skor_keseluruhan numeric(5, 2) not null default 0 check (skor_keseluruhan between 0 and 100),
  kehadiran_persen numeric(5, 2) not null default 0 check (kehadiran_persen between 0 and 100),
  peringkat text,
  catatan text,
  rekomendasi text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.raport_pengukuran (
  id uuid primary key default gen_random_uuid(),
  raport_id uuid not null references public.raport_atlet(id) on delete cascade,
  tinggi_badan_cm numeric(6, 2),
  berat_badan_kg numeric(6, 2),
  lingkar_dada_cm numeric(6, 2),
  lingkar_pinggang_cm numeric(6, 2),
  lingkar_paha_cm numeric(6, 2),
  denyut_nadi_istirahat integer,
  catatan text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.raport_performa (
  id uuid primary key default gen_random_uuid(),
  raport_id uuid not null references public.raport_atlet(id) on delete cascade,
  aspek text not null,
  nilai numeric(5, 2) not null default 0 check (nilai between 0 and 100),
  satuan text,
  keterangan text,
  urutan integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.raport_prestasi (
  id uuid primary key default gen_random_uuid(),
  raport_id uuid not null references public.raport_atlet(id) on delete cascade,
  judul text not null,
  tingkat text,
  peringkat text,
  tanggal date,
  penyelenggara text,
  keterangan text,
  urutan integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.raport_kepribadian (
  id uuid primary key default gen_random_uuid(),
  raport_id uuid not null references public.raport_atlet(id) on delete cascade,
  aspek text not null,
  nilai numeric(5, 2) not null default 0 check (nilai between 0 and 100),
  keterangan text,
  urutan integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists raport_atlet_profil_tanggal_idx
  on public.raport_atlet (profil_id, tanggal desc);
create index if not exists raport_atlet_status_idx on public.raport_atlet (status);
create index if not exists raport_pengukuran_raport_idx on public.raport_pengukuran (raport_id);
create index if not exists raport_performa_raport_idx on public.raport_performa (raport_id, urutan);
create index if not exists raport_prestasi_raport_idx on public.raport_prestasi (raport_id, urutan);
create index if not exists raport_kepribadian_raport_idx on public.raport_kepribadian (raport_id, urutan);

-- -----------------------------------------------------------------------------
-- Trigger updated_at
-- -----------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'raport_atlet',
    'raport_pengukuran',
    'raport_performa',
    'raport_prestasi',
    'raport_kepribadian'
  ] loop
    execute format('drop trigger if exists touch_updated_at on public.%I', t);
    execute format(
      'create trigger touch_updated_at before update on public.%I for each row execute function public.touch_updated_at()',
      t
    );
  end loop;
end $$;

grant all on all tables in schema public to anon, authenticated;

-- -----------------------------------------------------------------------------
-- Row Level Security
-- Atlet hanya dapat melihat raportnya sendiri yang sudah diterbitkan.
-- Admin/pengurus mengelola seluruh raport.
-- -----------------------------------------------------------------------------
alter table public.raport_atlet enable row level security;
alter table public.raport_pengukuran enable row level security;
alter table public.raport_performa enable row level security;
alter table public.raport_prestasi enable row level security;
alter table public.raport_kepribadian enable row level security;

drop policy if exists raport_atlet_select on public.raport_atlet;
create policy raport_atlet_select on public.raport_atlet
  for select to authenticated using (
    public.is_pengurus()
    or (profil_id = auth.uid() and status <> 'Draft')
  );

drop policy if exists raport_atlet_insert on public.raport_atlet;
create policy raport_atlet_insert on public.raport_atlet
  for insert to authenticated with check (public.is_pengurus());

drop policy if exists raport_atlet_update on public.raport_atlet;
create policy raport_atlet_update on public.raport_atlet
  for update to authenticated using (public.is_pengurus()) with check (public.is_pengurus());

drop policy if exists raport_atlet_delete on public.raport_atlet;
create policy raport_atlet_delete on public.raport_atlet
  for delete to authenticated using (public.is_pengurus());

-- Tabel turunan mengikuti visibilitas header raport.
drop policy if exists raport_pengukuran_select on public.raport_pengukuran;
create policy raport_pengukuran_select on public.raport_pengukuran
  for select to authenticated using (
    public.is_pengurus()
    or exists (
      select 1 from public.raport_atlet h
      where h.id = raport_pengukuran.raport_id
        and h.profil_id = auth.uid()
        and h.status <> 'Draft'
    )
  );

drop policy if exists raport_pengukuran_insert on public.raport_pengukuran;
create policy raport_pengukuran_insert on public.raport_pengukuran
  for insert to authenticated with check (public.is_pengurus());

drop policy if exists raport_pengukuran_update on public.raport_pengukuran;
create policy raport_pengukuran_update on public.raport_pengukuran
  for update to authenticated using (public.is_pengurus()) with check (public.is_pengurus());

drop policy if exists raport_pengukuran_delete on public.raport_pengukuran;
create policy raport_pengukuran_delete on public.raport_pengukuran
  for delete to authenticated using (public.is_pengurus());

drop policy if exists raport_performa_select on public.raport_performa;
create policy raport_performa_select on public.raport_performa
  for select to authenticated using (
    public.is_pengurus()
    or exists (
      select 1 from public.raport_atlet h
      where h.id = raport_performa.raport_id
        and h.profil_id = auth.uid()
        and h.status <> 'Draft'
    )
  );

drop policy if exists raport_performa_insert on public.raport_performa;
create policy raport_performa_insert on public.raport_performa
  for insert to authenticated with check (public.is_pengurus());

drop policy if exists raport_performa_update on public.raport_performa;
create policy raport_performa_update on public.raport_performa
  for update to authenticated using (public.is_pengurus()) with check (public.is_pengurus());

drop policy if exists raport_performa_delete on public.raport_performa;
create policy raport_performa_delete on public.raport_performa
  for delete to authenticated using (public.is_pengurus());

drop policy if exists raport_prestasi_select on public.raport_prestasi;
create policy raport_prestasi_select on public.raport_prestasi
  for select to authenticated using (
    public.is_pengurus()
    or exists (
      select 1 from public.raport_atlet h
      where h.id = raport_prestasi.raport_id
        and h.profil_id = auth.uid()
        and h.status <> 'Draft'
    )
  );

drop policy if exists raport_prestasi_insert on public.raport_prestasi;
create policy raport_prestasi_insert on public.raport_prestasi
  for insert to authenticated with check (public.is_pengurus());

drop policy if exists raport_prestasi_update on public.raport_prestasi;
create policy raport_prestasi_update on public.raport_prestasi
  for update to authenticated using (public.is_pengurus()) with check (public.is_pengurus());

drop policy if exists raport_prestasi_delete on public.raport_prestasi;
create policy raport_prestasi_delete on public.raport_prestasi
  for delete to authenticated using (public.is_pengurus());

drop policy if exists raport_kepribadian_select on public.raport_kepribadian;
create policy raport_kepribadian_select on public.raport_kepribadian
  for select to authenticated using (
    public.is_pengurus()
    or exists (
      select 1 from public.raport_atlet h
      where h.id = raport_kepribadian.raport_id
        and h.profil_id = auth.uid()
        and h.status <> 'Draft'
    )
  );

drop policy if exists raport_kepribadian_insert on public.raport_kepribadian;
create policy raport_kepribadian_insert on public.raport_kepribadian
  for insert to authenticated with check (public.is_pengurus());

drop policy if exists raport_kepribadian_update on public.raport_kepribadian;
create policy raport_kepribadian_update on public.raport_kepribadian
  for update to authenticated using (public.is_pengurus()) with check (public.is_pengurus());

drop policy if exists raport_kepribadian_delete on public.raport_kepribadian;
create policy raport_kepribadian_delete on public.raport_kepribadian
  for delete to authenticated using (public.is_pengurus());

-- -----------------------------------------------------------------------------
-- Data contoh (hanya dibuat bila sudah ada profil dan belum ada raport sama sekali)
-- -----------------------------------------------------------------------------
do $$
declare
  p uuid;
  r1 uuid;
  r2 uuid;
  r3 uuid;
begin
  select id into p from public.profiles order by created_at asc limit 1;
  if p is null then
    raise notice 'Belum ada profil; seed raport dilewati.';
  elsif exists (select 1 from public.raport_atlet) then
    raise notice 'Raport sudah ada; seed dilewati.';
  else
    insert into public.raport_atlet
      (profil_id, periode, tanggal, jenjang, kelas, cabang, pelatih, status,
       skor_keseluruhan, kehadiran_persen, peringkat, catatan, rekomendasi)
    values
      (p, 'Contoh Triwulan I 2026', '2026-03-31', 'Madya', 'B 55-60 kg', 'Yogyakarta', 'Pelatih Tapak Suci', 'Terbit',
       78.50, 92, 'Peringkat 3', 'Teknik dasar sudah stabil. Need peningkatan pada kecepatan gerak dan daya tahan.',
       'Tambah latihan interval dan sparring terkontrol 2 kali seminggu.'),
      (p, 'Contoh Triwulan II 2026', '2026-06-30', 'Madya', 'B 55-60 kg', 'Yogyakarta', 'Pelatih Tapak Suci', 'Terbit',
       84.20, 95, 'Peringkat 2', 'Terjadi peningkatan signifikan pada power dan kontrol jarak.',
       'Pertahankan intensitas latihan dan perkuat analisis pertandingan.'),
      (p, 'Contoh Triwulan III 2026', '2026-09-30', 'Utama', 'C 60-65 kg', 'Yogyakarta', 'Pelatih Tapak Suci', 'Terbit',
       89.75, 97, 'Juara 1', 'Performa teknik, mental, dan kepribadian sangat baik di gelanggang.',
       'Persiapkan program khusus pertandingan tingkat provinsi.');

    -- Ambil tiga id yang baru dibuat berdasarkan periode.
    select id into r1 from public.raport_atlet where periode = 'Contoh Triwulan I 2026' and profil_id = p;
    select id into r2 from public.raport_atlet where periode = 'Contoh Triwulan II 2026' and profil_id = p;
    select id into r3 from public.raport_atlet where periode = 'Contoh Triwulan III 2026' and profil_id = p;

    -- Pengukuran fisik
    insert into public.raport_pengukuran
      (raport_id, tinggi_badan_cm, berat_badan_kg, lingkar_dada_cm, lingkar_pinggang_cm, lingkar_paha_cm, denyut_nadi_istirahat, catatan)
    values
      (r1, 168, 57.5, 88, 74, 52, 68, 'Komposisi tubuh dalam rentang ideal.'),
      (r2, 169, 58.2, 90, 73, 53, 64, 'Kenaikan massa otot ringan.'),
      (r3, 170, 59.0, 92, 72, 54, 60, 'Kondisi fisik prima menjelang pertandingan.');

    -- Penilaian performa lintas periode
    insert into public.raport_performa (raport_id, aspek, nilai, satuan, keterangan, urutan)
    select r.id, v.aspek, v.nilai, v.satuan, v.keterangan, v.urutan
    from public.raport_atlet r
    join (
      select 1 as periode, 'Power' as aspek, 72::numeric as nilai, 'skor' as satuan, 'Tenaga pukulan dan tendangan' as keterangan, 1 as urutan
      union all select 1, 'Kecepatan', 68, 'skor', 'Kecepatan gerak dan reaksi', 2
      union all select 1, 'Daya Tahan (VO2 Max)', 65, 'ml/kg/menit', 'Kapabilitas aerobik', 3
      union all select 1, 'Teknik', 80, 'skor', 'Pola dasar dan jurus', 4
      union all select 1, 'Strategi', 71, 'skor', 'Membaca lawan', 5
      union all select 1, 'Mental', 78, 'skor', 'Fokus dan sportivitas', 6
      union all select 2, 'Power', 81, 'skor', 'Tenaga pukulan dan tendangan', 1
      union all select 2, 'Kecepatan', 77, 'skor', 'Kecepatan gerak dan reaksi', 2
      union all select 2, 'Daya Tahan (VO2 Max)', 74, 'ml/kg/menit', 'Kapabilitas aerobik', 3
      union all select 2, 'Teknik', 86, 'skor', 'Pola dasar dan jurus', 4
      union all select 2, 'Strategi', 82, 'skor', 'Membaca lawan', 5
      union all select 2, 'Mental', 85, 'skor', 'Fokus dan sportivitas', 6
      union all select 3, 'Power', 90, 'skor', 'Tenaga pukulan dan tendangan', 1
      union all select 3, 'Kecepatan', 88, 'skor', 'Kecepatan gerak dan reaksi', 2
      union all select 3, 'Daya Tahan (VO2 Max)', 86, 'ml/kg/menit', 'Kapabilitas aerobik', 3
      union all select 3, 'Teknik', 92, 'skor', 'Pola dasar dan jurus', 4
      union all select 3, 'Strategi', 89, 'skor', 'Membaca lawan', 5
      union all select 3, 'Mental', 93, 'skor', 'Fokus dan sportivitas', 6
    ) v on v.periode = case r.periode
      when 'Contoh Triwulan I 2026' then 1
      when 'Contoh Triwulan II 2026' then 2
      when 'Contoh Triwulan III 2026' then 3
    end
    where r.profil_id = p;

    -- Prestasi
    insert into public.raport_prestasi (raport_id, judul, tingkat, peringkat, tanggal, penyelenggara, keterangan, urutan)
    values
      (r1, 'Kejuaraan Pencak Silat Antar Cabang', 'Cabang', 'Peringkat 3', '2026-02-14', 'Pengcab IPSI Yogyakarta', 'Kelas B 55-60 kg', 1),
      (r2, 'Kejuaraan Daerah Pencak Silat', 'Provinsi', 'Peringkat 2', '2026-05-20', 'Pengprov IPSI DI Yogyakarta', 'Kelas B 55-60 kg', 1),
      (r3, 'Kejuaraan Pencak Silat Tingkat Nasional', 'Nasional', 'Juara 1', '2026-09-12', 'PP Tapak Suci', 'Kelas C 60-65 kg', 1);

    -- Kepribadian detail
    insert into public.raport_kepribadian (raport_id, aspek, nilai, keterangan, urutan)
    select r.id, v.aspek, v.nilai, v.keterangan, v.urutan
    from public.raport_atlet r
    join (
      select 1 as periode, 'Disiplin' as aspek, 82::numeric as nilai, 'Hadir tepat waktu hampir setiap latihan' as keterangan, 1 as urutan
      union all select 1, 'Tanggung Jawab', 78, 'Tugas tim selalu diselesaikan', 2
      union all select 1, 'Kerja Sama', 76, 'Baik dalam latihan berpasangan', 3
      union all select 1, 'Sportivitas', 88, 'Menerima hasil pertandingan dengan lapang dada', 4
      union all select 1, 'Kepemimpinan', 70, 'Mulai berani memimpin barisan', 5
      union all select 1, 'Kepercayaan Diri', 74, 'Masih perlu penguatan saat final', 6
      union all select 1, 'Sabar', 79, 'Tekun saat teknik berulang', 7
      union all select 1, 'Rendah Hati', 90, 'Tidak sombong setelah menang', 8
      union all select 1, 'Komunikasi', 75, 'Aktif bertanya kepada pelatih', 9
      union all select 1, 'Ketahanan Mental', 77, 'Bangkit setelah tertinggal', 10
      union all select 1, 'Etika', 91, 'Adab beladiri menjadi contoh', 11
      union all select 1, 'Inisiatif', 72, 'Mulai mengusulkan variasi latihan', 12
      union all select 2, 'Disiplin', 88, 'Consisten tepat waktu', 1
      union all select 2, 'Tanggung Jawab', 85, 'Dipercaya menangani perlengkapan tim', 2
      union all select 2, 'Kerja Sama', 84, 'Membantu rekan yang tertinggal', 3
      union all select 2, 'Sportivitas', 91, 'Mengapresiasi lawan dan wasit', 4
      union all select 2, 'Kepemimpinan', 79, 'Memimpin pemanasan tim', 5
      union all select 2, 'Kepercayaan Diri', 83, 'Lebih tenang menghadapi lawan kuat', 6
      union all select 2, 'Sabar', 84, 'Tetap fokus dalam latihan panjang', 7
      union all select 2, 'Rendah Hati', 92, 'Menerima kritik dengan baik', 8
      union all select 2, 'Komunikasi', 82, 'Berani menyampaikan evaluasi', 9
      union all select 2, 'Ketahanan Mental', 86, 'Tidak menyerah saat skor imbang', 10
      union all select 2, 'Etika', 93, 'Menjaga adab di dalam dan luar gelanggang', 11
      union all select 2, 'Inisiatif', 81, 'Mengusulkan analisis video', 12
      union all select 3, 'Disiplin', 94, 'Teladan bagi anggota lain', 1
      union all select 3, 'Tanggung Jawab', 92, 'Memegang peran kunci tim', 2
      union all select 3, 'Kerja Sama', 90, 'Sinergi tinggi dengan pelatih dan rekan', 3
      union all select 3, 'Sportivitas', 95, 'Menjunjung tinggi fair play', 4
      union all select 3, 'Kepemimpinan', 88, 'Memimpin tim saat pelatih tidak hadir', 5
      union all select 3, 'Kepercayaan Diri', 92, 'Percaya diri tanpa berlebihan', 6
      union all select 3, 'Sabar', 89, 'Sabar menghadapi lawan yang provokatif', 7
      union all select 3, 'Rendah Hati', 94, 'Mengembalikan pujian kepada tim', 8
      union all select 3, 'Komunikasi', 87, 'Komunikasi taktis sangat baik', 9
      union all select 3, 'Ketahanan Mental', 93, 'Stabil di bawah tekanan final', 10
      union all select 3, 'Etika', 96, 'Menjadi rujukan akhlak beladiri', 11
      union all select 3, 'Inisiatif', 90, 'Mengajukan program latihan lanjutan', 12
    ) v on v.periode = case r.periode
      when 'Contoh Triwulan I 2026' then 1
      when 'Contoh Triwulan II 2026' then 2
      when 'Contoh Triwulan III 2026' then 3
    end
    where r.profil_id = p;
  end if;
end $$;

-- -----------------------------------------------------------------------------
-- Rapihkan placeholder gambar lama agar seluruh ilustrasi memakai foto pencak silat lokal
-- -----------------------------------------------------------------------------
update public.media
set file_url = case
  when tipe = 'dokumen' then '/login-silat.jpg'
  else '/prestasi-gelanggang.jpg'
end
where file_url like 'https://placehold.co%';

notify pgrst, 'reload schema';

select
  (select count(*) from public.raport_atlet) as raport,
  (select count(*) from public.raport_pengukuran) as pengukuran,
  (select count(*) from public.raport_performa) as performa,
  (select count(*) from public.raport_prestasi) as prestasi,
  (select count(*) from public.raport_kepribadian) as kepribadian;
