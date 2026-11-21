export type Role = 'admin' | 'pengurus' | 'anggota'

export interface Profile {
  id: string
  email: string | null
  full_name: string
  role: Role
  jabatan: string | null
  telepon: string | null
  avatar_url: string | null
  created_at: string
}
