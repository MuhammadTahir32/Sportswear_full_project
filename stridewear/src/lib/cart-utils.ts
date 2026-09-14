import type { CartItemWithDetails } from '#/hooks/use-cart'

const TAX_RATE = 0.08 // 8% tax
const FREE_SHIPPING_THRESHOLD = 100
const SHIPPING_COST = 9.99

export type CartCalculation = {
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
}

export function calculateCart(
  items: CartItemWithDetails[],
  couponDiscount: number = 0,
): CartCalculation {
  const subtotal = items.reduce((sum, item) => {
    const price = item.product_variants.price_override
      ?? item.product_variants.products.sale_price
      ?? item.product_variants.products.base_price
    return sum + price * item.quantity
  }, 0)

  const tax = subtotal * TAX_RATE
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const discount = Math.min(couponDiscount, subtotal)
  const total = subtotal + tax + shipping - discount

  return {
    subtotal,
    tax,
    shipping,
    discount,
    total,
  }
}

export function formatPrice(cents: number): string {
  return `$${cents.toFixed(2)}`
}
