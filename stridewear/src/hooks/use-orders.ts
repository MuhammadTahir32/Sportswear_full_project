import { useQuery } from '@tanstack/react-query'
import { supabase } from '#/lib/supabase'
import { useAuth } from '#/lib/auth'
import type { Tables } from '#/lib/database.types'

type Order = Tables<'orders'>

export type OrderWithItems = Order & {
  order_items: {
    id: string
    quantity: number
    unit_price: number
    product_variants: {
      id: string
      size: string
      color: string
      products: {
        name: string
        slug: string
        product_images: {
          storage_path: string
        }[]
      }
    }
  }[]
  order_status_history: {
    id: string
    status: string
    changed_at: string
  }[]
}

export function useOrders() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async (): Promise<OrderWithItems[]> => {
      if (!user) return []

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            id, quantity, unit_price,
            product_variants(
              id, size, color,
              products(name, slug, product_images(storage_path))
            )
          ),
          order_status_history(id, status, changed_at)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as OrderWithItems[]
    },
    enabled: !!user,
  })
}

export function useOrder(orderId: string | null) {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async (): Promise<OrderWithItems | null> => {
      if (!user || !orderId) return null

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            id, quantity, unit_price,
            product_variants(
              id, size, color,
              products(name, slug, product_images(storage_path))
            )
          ),
          order_status_history(id, status, changed_at)
        `)
        .eq('id', orderId)
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) throw error
      return data as OrderWithItems
    },
    enabled: !!user && !!orderId,
  })
}
