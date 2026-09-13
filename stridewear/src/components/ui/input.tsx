import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '#/lib/cn'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'w-full border border-brand-gray-100 bg-white px-4 py-3 text-sm text-brand-black placeholder:text-brand-gray-400 focus:border-brand-black focus:outline-none',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)

Input.displayName = 'Input'
