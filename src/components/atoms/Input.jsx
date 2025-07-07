import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

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
        'flex h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
        error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
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