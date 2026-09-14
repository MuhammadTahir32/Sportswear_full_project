import { useEffect } from 'react'
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

type GuestCartItem = {
  variantId: string
  quantity: number
}

const CART_STORAGE_KEY = 'stridewear_cart'

function getGuestCart(): GuestCartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function setGuestCart(items: GuestCartItem[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
}

export function useCart() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Merge guest cart into DB on login
  useEffect(() => {
    if (!user) return

    const guestCart = getGuestCart()
    if (guestCart.length === 0) return

    async function merge() {
      for (const item of guestCart) {
        const { data: existing } = await supabase
          .from('cart_items')
          .select('id, quantity')
          .eq('user_id', user!.id)
          .eq('variant_id', item.variantId)
          .single()

        if (existing) {
          await supabase
            .from('cart_items')
            .update({ quantity: existing.quantity + item.quantity })
            .eq('id', existing.id)
        } else {
          await supabase
            .from('cart_items')
            .insert({ user_id: user!.id, variant_id: item.variantId, quantity: item.quantity })
        }
      }

      localStorage.removeItem(CART_STORAGE_KEY)
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    }

    merge()
  }, [user, queryClient])

  const { data: items, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async (): Promise<CartItemWithDetails[]> => {
      if (!user) {
        // Guest: read from localStorage and fetch variant details
        const guestCart = getGuestCart()
        if (guestCart.length === 0) return []

        const variantIds = guestCart.map((i) => i.variantId)
        const { data: variants, error } = await supabase
          .from('product_variants')
          .select(`
            id, size, color, stock_qty, price_override,
            products(name, slug, base_price, sale_price, product_images(storage_path))
          `)
          .in('id', variantIds)

        if (error) throw error

        return guestCart.map((gc, i) => ({
          id: `guest-${i}`,
          quantity: gc.quantity,
          updated_at: new Date().toISOString(),
          user_id: '',
          variant_id: gc.variantId,
          product_variants: variants.find((v) => v.id === gc.variantId) as CartItemWithDetails['product_variants'],
        })).filter((item) => item.product_variants)
      }

      // Logged-in: read from DB
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
  })

  const addItem = useMutation({
    mutationFn: async ({ variantId, quantity = 1 }: { variantId: string; quantity?: number }) => {
      if (!user) {
        // Guest: save to localStorage
        const guestCart = getGuestCart()
        const existing = guestCart.find((i) => i.variantId === variantId)
        if (existing) {
          existing.quantity += quantity
        } else {
          guestCart.push({ variantId, quantity })
        }
        setGuestCart(guestCart)
        return
      }

      // Logged-in: save to DB
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
      if (!user) {
        // Guest: update localStorage
        const guestCart = getGuestCart()
        if (quantity <= 0) {
          const idx = guestCart.findIndex((i) => `guest-${guestCart.indexOf(i)}` === itemId || i.variantId === itemId.replace('guest-', ''))
          if (idx !== -1) guestCart.splice(idx, 1)
        } else {
          const item = guestCart.find((i) => `guest-${guestCart.indexOf(i)}` === itemId || i.variantId === itemId.replace('guest-', ''))
          if (item) item.quantity = quantity
        }
        setGuestCart(guestCart)
        return
      }

      // Logged-in: update DB
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
      if (!user) {
        // Guest: remove from localStorage
        const guestCart = getGuestCart()
        const idx = guestCart.findIndex((i) => `guest-${guestCart.indexOf(i)}` === itemId || i.variantId === itemId.replace('guest-', ''))
        if (idx !== -1) guestCart.splice(idx, 1)
        setGuestCart(guestCart)
        return
      }

      // Logged-in: remove from DB
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
      if (!user) {
        localStorage.removeItem(CART_STORAGE_KEY)
        return
      }
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
