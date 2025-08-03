export function formatCnpj(raw: string): string {
  return raw?.replace(/[^\d]/g, '')
}
