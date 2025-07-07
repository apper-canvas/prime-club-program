import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Button = forwardRef(({ 
  className, 
  variant = 'default', 
  size = 'default', 
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: 'bg-primary text-white hover:bg-primary/90 shadow-sm hover:shadow-md',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 shadow-sm hover:shadow-md',
    accent: 'bg-accent text-white hover:bg-accent/90 shadow-sm hover:shadow-md',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'hover:bg-gray-100 text-gray-700 hover:text-gray-900',
    success: 'bg-success text-white hover:bg-success/90 shadow-sm hover:shadow-md',
    warning: 'bg-warning text-gray-900 hover:bg-warning/90 shadow-sm hover:shadow-md',
    error: 'bg-error text-white hover:bg-error/90 shadow-sm hover:shadow-md'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    default: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]',
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = 'Button'

export default Button