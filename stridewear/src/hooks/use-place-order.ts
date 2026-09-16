import { useMutation } from '@tanstack/react-query'
import { supabase } from '#/lib/supabase'
import { useAuth } from '#/lib/auth'
import type { CartItemWithDetails } from '#/hooks/use-cart'
import type { Address } from '#/hooks/use-addresses'
import type { ShippingMethod } from '#/components/checkout/shipping-step'
import type { Coupon } from '#/hooks/use-coupon'

type PlaceOrderInput = {
  items: CartItemWithDetails[]
  address: Address
  shipping: ShippingMethod
  subtotal: number
  tax: number
  discount: number
  total: number
  coupon: Coupon | null
}

export function usePlaceOrder() {
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (input: PlaceOrderInput): Promise<string> => {
      if (!user) throw new Error('Not authenticated')

      const shippingFee =
        input.shipping.id === 'standard' && input.subtotal >= 100
          ? 0
          : input.shipping.price

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'pending',
          subtotal: input.subtotal,
          tax: input.tax,
          shipping_fee: shippingFee,
          discount: input.discount,
          total: input.total,
          applied_coupon_id: input.coupon?.id ?? null,
          shipping_address: {
            label: input.address.label,
            full_name: input.address.full_name,
            line1: input.address.line1,
            line2: input.address.line2,
            city: input.address.city,
            state: input.address.state,
            postal_code: input.address.postal_code,
            country: input.address.country,
            phone: input.address.phone,
          },
        })
        .select('id')
        .single()

      if (orderError) throw orderError

      const orderItems = input.items.map((item) => {
        const price =
          item.product_variants.price_override ??
          item.product_variants.products.sale_price ??
          item.product_variants.products.base_price

        return {
          order_id: order.id,
          variant_id: item.product_variants.id,
          quantity: item.quantity,
          unit_price: price,
        }
      })

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      return order.id
    },
  })
}
