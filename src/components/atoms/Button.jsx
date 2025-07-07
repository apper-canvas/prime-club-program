import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = 'default', 
  size = 'default', 
  children, 
  ...props 
}, ref) => {
const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-600',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 border border-gray-600',
    accent: 'bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-200',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white',
    ghost: 'hover:bg-gray-100 text-gray-700 hover:text-gray-900 border border-transparent',
    success: 'bg-green-600 text-white hover:bg-green-700 border border-green-600',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700 border border-yellow-600',
    error: 'bg-red-600 text-white hover:bg-red-700 border border-red-600'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    default: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
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