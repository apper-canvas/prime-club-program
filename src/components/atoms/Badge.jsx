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
    default: 'bg-gradient-surface text-gray-800 border-2 border-memphis-blue',
    primary: 'bg-gradient-primary text-white border-2 border-memphis-yellow',
    secondary: 'bg-gradient-success text-black border-2 border-memphis-pink',
    accent: 'bg-gradient-accent text-black border-2 border-memphis-blue',
    success: 'bg-memphis-green text-black border-2 border-memphis-blue',
    warning: 'bg-memphis-yellow text-black border-2 border-memphis-pink',
    error: 'bg-memphis-pink text-white border-2 border-memphis-yellow',
    high: 'bg-memphis-pink text-white border-2 border-memphis-yellow shadow-neon',
    medium: 'bg-memphis-yellow text-black border-2 border-memphis-blue',
    low: 'bg-gradient-surface text-gray-600 border-2 border-memphis-green'
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    default: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base'
  }

  return (
<span
      className={cn(
        'inline-flex items-center rounded-xl font-black transition-all duration-200 priority-pill transform hover:rotate-3 hover:scale-110',
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