import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Input = forwardRef(({ 
  className, 
  type = 'text', 
  error,
  ...props 
}, ref) => {
  return (
    <input
type={type}
      className={cn(
        'flex h-12 w-full rounded-xl border-4 border-memphis-blue bg-gradient-surface px-4 py-2 text-sm font-bold placeholder:text-memphis-pink focus:outline-none focus:shadow-neon focus:border-memphis-pink disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 transform focus:rotate-1',
        error && 'border-memphis-pink focus:shadow-[0_0_20px_rgba(255,45,146,0.5)]',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Input.displayName = 'Input'

export default Input