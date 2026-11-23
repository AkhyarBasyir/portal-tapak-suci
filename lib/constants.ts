/** Konstanta bersama agar tidak diduplikasi di banyak file. */
export const ROLES = ['admin', 'pengurus', 'anggota'] as const

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tsmutumuda.vercel.app'

export const CONTACT_EMAIL = 'pimpinanpusattapaksuci@gmail.com'
