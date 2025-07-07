import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  className, 
  variant = 'default',
  size = 'default',
  children,
  ...props 
}, ref) => {
const variants = {
    default: 'bg-gray-100 text-gray-700 border border-gray-300',
    primary: 'bg-blue-600 text-white border border-blue-600',
    secondary: 'bg-gray-600 text-white border border-gray-600',
    accent: 'bg-blue-100 text-blue-800 border border-blue-200',
    success: 'bg-green-100 text-green-800 border border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    error: 'bg-red-100 text-red-800 border border-red-200',
    high: 'bg-red-100 text-red-800 border border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
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
        'inline-flex items-center rounded-md font-medium transition-colors',
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