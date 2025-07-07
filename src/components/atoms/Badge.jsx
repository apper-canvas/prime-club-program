import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Badge = forwardRef(({ 
  className, 
  variant = 'default',
  size = 'default',
  children,
  ...props 
}, ref) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/20 text-warning',
    error: 'bg-error/10 text-error',
    high: 'bg-accent/10 text-accent border border-accent/20',
    medium: 'bg-warning/20 text-warning border border-warning/30',
    low: 'bg-gray-100 text-gray-600 border border-gray-200'
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    default: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base'
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium transition-all duration-200 priority-pill',
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  )
})

Badge.displayName = 'Badge'

export default Badge