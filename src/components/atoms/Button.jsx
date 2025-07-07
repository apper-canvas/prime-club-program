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
    default: 'bg-gradient-primary text-white hover:bg-memphis-pink shadow-memphis hover:shadow-neon border-2 border-memphis-yellow',
    secondary: 'bg-gradient-success text-black hover:bg-memphis-blue shadow-memphis hover:shadow-neon border-2 border-memphis-pink',
    accent: 'bg-gradient-accent text-black hover:bg-memphis-green shadow-memphis hover:shadow-neon border-2 border-memphis-blue',
    outline: 'border-4 border-memphis-pink text-memphis-pink hover:bg-memphis-pink hover:text-white shadow-memphis',
    ghost: 'hover:bg-memphis-yellow text-memphis-blue hover:text-black border-2 border-transparent hover:border-memphis-blue',
    success: 'bg-memphis-green text-black hover:bg-gradient-success shadow-memphis hover:shadow-neon border-2 border-memphis-blue',
    warning: 'bg-memphis-yellow text-black hover:bg-gradient-accent shadow-memphis hover:shadow-neon border-2 border-memphis-pink',
    error: 'bg-memphis-pink text-white hover:bg-gradient-primary shadow-memphis hover:shadow-neon border-2 border-memphis-yellow'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    default: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  return (
<button
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-black transition-all duration-200 focus:outline-none focus:shadow-neon disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.05] hover:rotate-1 active:scale-[0.95] active:rotate-0 transform',
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