import { useMutation } from '@tanstack/react-query'
import { supabase } from '#/lib/supabase'

export type Coupon = {
  id: string
  code: string
  discount_type: string
  discount_value: number
}

type ValidateResult = {
  valid: boolean
  coupon?: Coupon
  discount?: number
  error?: string
}

export function useValidateCoupon() {
  return useMutation({
    mutationFn: async ({
      code,
      subtotal,
    }: {
      code: string
      subtotal: number
    }): Promise<ValidateResult> => {
      const trimmed = code.trim().toUpperCase()
      if (!trimmed) return { valid: false, error: 'Enter a coupon code' }

      const { data: coupon, error } = await supabase
        .from('coupons')
        .select('id, code, discount_type, discount_value')
        .eq('code', trimmed)
        .eq('active', true)
        .or('expires_at.is.null,expires_at.gt.now()')
        .single()

      if (error || !coupon) {
        return { valid: false, error: 'Invalid coupon code' }
      }

      let discount: number
      if (coupon.discount_type === 'percent') {
        discount = (subtotal * coupon.discount_value) / 100
      } else {
        discount = Math.min(coupon.discount_value, subtotal)
      }

      return { valid: true, coupon, discount }
    },
  })
}
