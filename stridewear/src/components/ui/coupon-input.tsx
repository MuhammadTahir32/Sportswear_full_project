import { useState } from 'react'
import { useValidateCoupon } from '#/hooks/use-coupon'
import { formatPrice } from '#/lib/cart-utils'

type CouponInputProps = {
  subtotal: number
  onApply: (discount: number, couponId: string, code: string) => void
  onRemove: () => void
  appliedCoupon?: { code: string; discount: number } | null
}

export function CouponInput({
  subtotal,
  onApply,
  onRemove,
  appliedCoupon,
}: CouponInputProps) {
  const [code, setCode] = useState('')
  const validateCoupon = useValidateCoupon()

  function handleApply() {
    validateCoupon.mutate(
      { code, subtotal },
      {
        onSuccess: (result) => {
          if (result.valid && result.coupon && result.discount !== undefined) {
            onApply(result.discount, result.coupon.id, result.coupon.code)
            setCode('')
          }
        },
      },
    )
  }

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between rounded-lg bg-green-50 px-4 py-2">
        <div>
          <span className="text-sm font-semibold text-green-700">
            {appliedCoupon.code}
          </span>
          <span className="ml-2 text-sm text-green-600">
            −{formatPrice(appliedCoupon.discount)}
          </span>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs font-semibold uppercase tracking-wider text-brand-gray-400 hover:text-brand-black"
        >
          Remove
        </button>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Coupon code"
        className="flex-1 rounded-lg border border-brand-gray-100 px-3 py-2 text-sm text-brand-black placeholder:text-brand-gray-400 focus:border-brand-lime focus:outline-none"
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleApply()
        }}
      />
      <button
        type="button"
        onClick={handleApply}
        disabled={!code.trim() || validateCoupon.isPending}
        className="rounded-lg bg-brand-black px-4 py-2 text-xs font-bold uppercase tracking-widest text-brand-white transition-colors hover:bg-brand-black-light disabled:opacity-50"
      >
        {validateCoupon.isPending ? '...' : 'Apply'}
      </button>
      {validateCoupon.isError && (
        <p className="mt-1 text-xs text-red-500">
          {(validateCoupon.error as Error)?.message || 'Invalid coupon'}
        </p>
      )}
      {validateCoupon.data && !validateCoupon.data.valid && (
        <p className="mt-1 text-xs text-red-500">{validateCoupon.data.error}</p>
      )}
    </div>
  )
}
