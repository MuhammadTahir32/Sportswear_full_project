import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '#/lib/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-colors',
          variant === 'primary' &&
            'bg-brand-black text-brand-white hover:bg-brand-black-light disabled:bg-brand-gray-400',
          variant === 'secondary' &&
            'border border-brand-black bg-transparent text-brand-black hover:bg-brand-black hover:text-brand-white',
          variant === 'ghost' &&
            'bg-transparent text-brand-black hover:text-brand-gray-700',
          isLoading && 'cursor-wait opacity-70',
          className,
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? 'Loading...' : children}
      </button>
    )
  },
)

Button.displayName = 'Button'
