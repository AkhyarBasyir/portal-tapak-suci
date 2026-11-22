-- Grant hak akses service_role agar Route Handler admin bisa menulis
-- tabel profiles, anggota, dan tabel lainnya lewat Supabase Admin API.
-- service_role tetap melewati RLS; grant ini hanya menambah hak di level database.

grant usage on schema public to service_role;
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
grant execute on all functions in schema public to service_role;

-- Pastikan tabel baru yang dibuat migration berikutnya juga bisa diakses.
alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant all on sequences to service_role;
alter default privileges in schema public grant execute on functions to service_role;
