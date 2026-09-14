import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '#/lib/supabase'
import { useAuth } from '#/lib/auth'
import type { Tables } from '#/lib/database.types'

type CartItem = Tables<'cart_items'>

export type CartItemWithDetails = CartItem & {
  product_variants: {
    id: string
    size: string
    color: string
    stock_qty: number
    price_override: number | null
    products: {
      name: string
      slug: string
      base_price: number
      sale_price: number | null
      product_images: {
        storage_path: string
      }[]
    }
  }
}

export function useCart() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: items, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      if (!user) return []

      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product_variants(
            id, size, color, stock_qty, price_override,
            products(name, slug, base_price, sale_price, product_images(storage_path))
          )
        `)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

      if (error) throw error
      return data as CartItemWithDetails[]
    },
    enabled: !!user,
  })

  const addItem = useMutation({
    mutationFn: async ({ variantId, quantity = 1 }: { variantId: string; quantity?: number }) => {
      if (!user) throw new Error('Must be logged in')

      const { data: existing } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('variant_id', variantId)
        .single()

      if (existing) {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('cart_items')
          .insert({ user_id: user.id, variant_id: variantId, quantity })
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  const updateQuantity = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      if (quantity <= 0) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', itemId)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', itemId)
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  const removeItem = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  const clearCart = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Must be logged in')
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  const itemCount = items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0

  return {
    items: items ?? [],
    isLoading,
    itemCount,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  }
}
