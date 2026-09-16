import { useQuery } from '@tanstack/react-query'
import { supabase } from '#/lib/supabase'
import { useAuth } from '#/lib/auth'
import type { Tables } from '#/lib/database.types'

type Order = Tables<'orders'>

export type AdminOrderWithDetails = Order & {
  profiles: {
    full_name: string | null
  } | null
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

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

interface UseAdminOrdersOptions {
  status?: OrderStatus | 'all'
  search?: string
  sortBy?: 'created_at' | 'total' | 'status'
  sortDirection?: 'asc' | 'desc'
}

export function useAdminOrders(options: UseAdminOrdersOptions = {}) {
  const { user, profile } = useAuth()
  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin'

  const {
    status = 'all',
    search = '',
    sortBy = 'created_at',
    sortDirection = 'desc',
  } = options

  return useQuery({
    queryKey: ['admin-orders', { status, search, sortBy, sortDirection }],
    queryFn: async (): Promise<AdminOrderWithDetails[]> => {
      if (!user || !isAdmin) return []

      let query = supabase
        .from('orders')
        .select(`
          *,
          profiles(full_name),
          order_items(
            id, quantity, unit_price,
            product_variants(
              id, size, color,
              products(name, slug, product_images(storage_path))
            )
          ),
          order_status_history(id, status, changed_at)
        `)
        .neq('user_id', user.id)

      if (status !== 'all') {
        query = query.eq('status', status)
      }

      if (search) {
        query = query.or(`id.ilike.%${search}%,user_id.ilike.%${search}%`)
      }

      query = query.order(sortBy, { ascending: sortDirection === 'asc' })

      const { data, error } = await query

      if (error) throw error
      return data as AdminOrderWithDetails[]
    },
    enabled: !!user && isAdmin,
  })
}

export function useAdminOrder(orderId: string | null) {
  const { user, profile } = useAuth()
  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin'

  return useQuery({
    queryKey: ['admin-order', orderId],
    queryFn: async (): Promise<AdminOrderWithDetails | null> => {
      if (!user || !isAdmin || !orderId) return null

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles(full_name),
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
        .maybeSingle()

      if (error) throw error
      return data as AdminOrderWithDetails
    },
    enabled: !!user && isAdmin && !!orderId,
  })
}
