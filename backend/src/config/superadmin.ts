export const SUPER_ADMIN_EMAIL = (
  process.env.SUPER_ADMIN_EMAIL || 'fernandoalexisflorarganaraz@gmail.com'
)
  .toLowerCase()
  .trim();

export function esSuperAdmin(email: string): boolean {
  return email.toLowerCase().trim() === SUPER_ADMIN_EMAIL;
}
