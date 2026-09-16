import { formatPrice } from '#/lib/cart-utils'
import { getImageUrl } from '#/lib/image'
import type { CartItemWithDetails } from '#/hooks/use-cart'
import type { Address } from '#/hooks/use-addresses'
import type { ShippingMethod } from '#/components/checkout/shipping-step'

type ReviewStepProps = {
  items: CartItemWithDetails[]
  address: Address
  shipping: ShippingMethod
  subtotal: number
  tax: number
  shippingCost: number
  discount: number
  total: number
}

export function ReviewStep({
  items,
  address,
  shipping,
  subtotal,
  tax,
  shippingCost,
  discount,
  total,
}: ReviewStepProps) {
  return (
    <div>
      <h2 className="font-display text-2xl uppercase text-brand-black">
        Review Order
      </h2>
      <p className="mt-1 text-sm text-brand-gray-400">
        Verify your details before placing the order
      </p>

      <div className="mt-6 space-y-6">
        <div className="rounded-sm border border-brand-gray-100 bg-white p-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand-gray-400">
            Shipping Address
          </h3>
          <div className="mt-2">
            <p className="text-sm font-semibold text-brand-black">
              {address.full_name}
            </p>
            <p className="text-sm text-brand-gray-700">
              {address.line1}
              {address.line2 ? `, ${address.line2}` : ''}
            </p>
            <p className="text-sm text-brand-gray-700">
              {address.city}, {address.state} {address.postal_code}
            </p>
            <p className="text-sm text-brand-gray-700">{address.country}</p>
            <p className="mt-1 text-sm text-brand-gray-400">{address.phone}</p>
          </div>
        </div>

        <div className="rounded-sm border border-brand-gray-100 bg-white p-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand-gray-400">
            Shipping Method
          </h3>
          <div className="mt-2 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-brand-black">
                {shipping.name}
              </p>
              <p className="text-xs text-brand-gray-400">
                {shipping.estimatedDays}
              </p>
            </div>
            <span className="text-sm font-bold text-brand-black">
              {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
            </span>
          </div>
        </div>

        <div className="rounded-sm border border-brand-gray-100 bg-white p-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand-gray-400">
            Order Items
          </h3>
          <div className="mt-3 space-y-3">
            {items.map((item) => {
              const price =
                item.product_variants.price_override ??
                item.product_variants.products.sale_price ??
                item.product_variants.products.base_price
              const image =
                item.product_variants.products.product_images[0]

              return (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative h-14 w-14 flex-shrink-0 bg-brand-gray-50">
                    {image && (
                      <img
                        src={getImageUrl(image.storage_path)}
                        alt={item.product_variants.products.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center bg-brand-black text-[10px] font-bold text-brand-white">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-brand-black">
                      {item.product_variants.products.name}
                    </p>
                    <p className="text-xs text-brand-gray-400">
                      {item.product_variants.color} /{' '}
                      {item.product_variants.size}
                    </p>
                  </div>
                  <p className="text-xs font-semibold text-brand-black">
                    {formatPrice(price * item.quantity)}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-sm border border-brand-gray-100 bg-white p-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand-gray-400">
            Payment
          </h3>
          <div className="mt-2 flex items-center gap-2">
            <span className="rounded-sm bg-brand-gray-50 px-2 py-1 text-xs font-semibold text-brand-black">
              COD
            </span>
            <span className="text-sm text-brand-gray-700">
              Cash on Delivery
            </span>
          </div>
        </div>

        <div className="space-y-2 rounded-sm border border-brand-gray-100 bg-white p-5">
          <div className="flex justify-between text-sm">
            <span className="text-brand-gray-400">Subtotal</span>
            <span className="text-brand-black">{formatPrice(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-brand-gray-400">Discount</span>
              <span className="text-green-600">-{formatPrice(discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-brand-gray-400">Tax (8%)</span>
            <span className="text-brand-black">{formatPrice(tax)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-brand-gray-400">Shipping</span>
            <span className="text-brand-black">
              {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
            </span>
          </div>
          <div className="flex justify-between border-t border-brand-gray-100 pt-2 text-sm font-bold">
            <span className="uppercase text-brand-black">Total</span>
            <span className="text-brand-black">{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
