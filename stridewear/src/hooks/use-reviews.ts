import { useQuery } from '@tanstack/react-query'
import { supabase } from '#/lib/supabase'
import type { Tables } from '#/lib/database.types'

type Review = Tables<'reviews'>
type Profile = Tables<'profiles'>

export type ReviewWithProfile = Review & {
  profiles: Pick<Profile, 'full_name'> | null
}

export function useReviews(productId: string) {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, profiles(full_name)')
        .eq('product_id', productId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as ReviewWithProfile[]
    },
    enabled: !!productId,
  })
}
