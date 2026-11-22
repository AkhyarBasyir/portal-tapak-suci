-- Samakan fungsi pengaman peran dengan schema.sql terbaru.
--Versi lama menolak semua perubahan role yang dilakukan tanpa session user
--(termasuk Route Handler admin dengan service_role), sehingga menu Pengguna
--gagal saat mengubah peran admin/pengurus/anggota.

create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- auth.uid() kosong untuk akses server/Admin API; pembatasan tetap ada
  -- pada RLS profiles_update (hanya admin) dan pengecekan peran di API.
  if new.role is distinct from old.role and auth.uid() is not null and not public.is_admin() then
    raise exception 'Hanya admin yang dapat mengubah peran pengguna';
  end if;
  return new;
end;
$$;
