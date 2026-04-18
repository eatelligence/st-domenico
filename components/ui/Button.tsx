import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold'
  size?: 'sm' | 'md' | 'lg'
  href?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center font-bebas tracking-widest transition-all duration-300 relative overflow-hidden group'

    const variants = {
      primary:
        'bg-terracotta text-cream hover:bg-gold hover:text-charcoal shadow-warm hover:shadow-gold',
      secondary:
        'bg-deep-green text-cream hover:bg-deep-green-light',
      outline:
        'border border-cream/40 text-cream hover:bg-cream/10 hover:border-cream',
      ghost:
        'text-charcoal hover:text-terracotta',
      gold:
        'bg-gold text-charcoal hover:bg-gold-light shadow-gold',
    }

    const sizes = {
      sm: 'text-sm px-5 py-2.5',
      md: 'text-base px-7 py-3.5',
      lg: 'text-lg px-10 py-4',
    }

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
