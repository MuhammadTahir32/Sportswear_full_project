import { formatPrice } from '#/lib/cart-utils'

export type ShippingMethod = {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: string
}

const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    description: 'Reliable delivery straight to your door',
    price: 0,
    estimatedDays: '5-7 business days',
  },
  {
    id: 'express',
    name: 'Express Shipping',
    description: 'Get your gear faster with priority handling',
    price: 14.99,
    estimatedDays: '2-3 business days',
  },
  {
    id: 'overnight',
    name: 'Overnight Shipping',
    description: 'Next-day delivery for urgent orders',
    price: 24.99,
    estimatedDays: 'Next business day',
  },
]

type ShippingStepProps = {
  selectedShipping: ShippingMethod | null
  onSelect: (method: ShippingMethod) => void
  subtotal: number
}

export function ShippingStep({
  selectedShipping,
  onSelect,
  subtotal,
}: ShippingStepProps) {
  const freeShippingThreshold = 100
  const isStandardFree = subtotal >= freeShippingThreshold

  function getDisplayPrice(method: ShippingMethod): string {
    if (method.id === 'standard' && isStandardFree) {
      return 'Free'
    }
    return formatPrice(method.price)
  }

  return (
    <div>
      <h2 className="font-display text-2xl uppercase text-brand-black">
        Shipping Method
      </h2>
      <p className="mt-1 text-sm text-brand-gray-400">
        Choose how you want your order delivered
      </p>

      {!isStandardFree && (
        <p className="mt-3 rounded-sm bg-brand-gray-50 px-4 py-2.5 text-xs text-brand-gray-700">
          Add {formatPrice(freeShippingThreshold - subtotal)} more for{' '}
          <span className="font-semibold text-brand-black">
            free standard shipping
          </span>
        </p>
      )}

      <div className="mt-6 space-y-3">
        {SHIPPING_METHODS.map((method) => {
          const isSelected = selectedShipping?.id === method.id

          return (
            <button
              key={method.id}
              onClick={() => onSelect(method)}
              className={`w-full cursor-pointer rounded-sm border p-5 text-left transition-colors ${
                isSelected
                  ? 'border-brand-black bg-brand-gray-50'
                  : 'border-brand-gray-100 bg-white hover:border-brand-gray-400'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 h-4 w-4 flex-shrink-0 rounded-full border-2 ${
                      isSelected
                        ? 'border-brand-black'
                        : 'border-brand-gray-400'
                    }`}
                  >
                    {isSelected && (
                      <div className="mx-auto mt-0.5 h-2 w-2 rounded-full bg-brand-black" />
                    )}
                  </div>
                  <div>
                    <span className="font-display text-sm uppercase text-brand-black">
                      {method.name}
                    </span>
                    <p className="mt-0.5 text-xs text-brand-gray-400">
                      {method.description}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-brand-gray-700">
                      {method.estimatedDays}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-sm font-bold ${
                    (method.id === 'standard' && isStandardFree)
                      ? 'text-green-600'
                      : 'text-brand-black'
                  }`}
                >
                  {getDisplayPrice(method)}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
