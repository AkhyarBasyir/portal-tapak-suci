-- =============================================================================
-- PENGUATAN KEAMANAN (belum dijalankan di Supabase live)
-- Jalankan manual di Supabase Dashboard -> SQL Editor -> New query -> Run.
-- Aman dijalankan berulang (menggunakan if exists / drop-create).
-- =============================================================================

-- 1) Cegah anggota memindahkan baris penerima ke program lain (eskalasi akses).
create or replace function public.jaga_penerima_program()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'UPDATE'
     and (new.program_id is distinct from old.program_id
          or new.profil_id is distinct from old.profil_id) then
    raise exception 'program_id dan profil_id tidak boleh diubah';
  end if;
  return new;
end;
$$;

drop trigger if exists jaga_penerima_program on public.program_khusus_penerima;
create trigger jaga_penerima_program
before update on public.program_khusus_penerima
for each row execute function public.jaga_penerima_program();

-- 2) Anggota hanya melihat profilnya sendiri; pengurus melihat profil anggota;
--    admin tetap melihat semua.
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select to authenticated
  using (
    id = auth.uid()
    or public.is_admin()
    or (public.is_pengurus() and role = 'anggota')
  );

-- 3) Resolver username->email tidak lagi bisa dipanggil publik.
--    Login sekarang memakai /api/auth/resolve-email (service role).
grant execute on function public.email_for_login(text) to service_role;
revoke execute on function public.email_for_login(text) from anon;
revoke execute on function public.current_role() from anon;
revoke execute on function public.is_admin() from anon;
revoke execute on function public.is_pengurus() from anon;

-- 4) Username unik secara case-insensitive + hindari error multi-row.
create unique index if not exists profiles_username_lower_key
  on public.profiles (lower(username))
  where username is not null;

create or replace function public.email_for_login(identifier text)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select case
    when identifier like '%@%' then identifier
    else (
      select email from public.profiles
      where lower(username) = lower(identifier)
      limit 1
    )
  end;
$$;

-- 5) Upload media: pengurus bisa menambah, tapi hanya pemilik yang bisa
--    mengubah/menghapus objek (tidak bisa menimpa file orang lain).
drop policy if exists media_storage_write on storage.objects;
drop policy if exists media_storage_insert on storage.objects;
drop policy if exists media_storage_update on storage.objects;
drop policy if exists media_storage_delete on storage.objects;

create policy media_storage_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and public.is_pengurus());

create policy media_storage_update on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and owner = auth.uid())
  with check (bucket_id = 'media' and owner = auth.uid());

create policy media_storage_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and owner = auth.uid());

-- 6) Peran profil hanya bisa diubah admin (atau API service_role portal).
--    Menutup celah pengurus/anggota menaikkan peran lewat Supabase client langsung.
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

-- 7) Iuran: anggota hanya melihat tagihannya sendiri; pengurus/admin tetap melihat semua.
--    Tautan memakai email yang sama di profiles dan anggota (sama seperti saat admin
--    membuat akun dari menu Pengguna).
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
