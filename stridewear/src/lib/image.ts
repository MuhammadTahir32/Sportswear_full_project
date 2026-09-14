const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

export function getImageUrl(storagePath: string): string {
  return `${supabaseUrl}/storage/v1/object/public/${storagePath}`
}
