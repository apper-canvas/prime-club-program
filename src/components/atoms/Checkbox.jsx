import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Checkbox = forwardRef(({ 
  className, 
  checked,
  onChange,
  ...props 
}, ref) => {
  return (
    <div className="relative">
      <input
        type="checkbox"
        className={cn(
          'peer h-5 w-5 rounded-full border-2 border-gray-300 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 checkbox-custom appearance-none cursor-pointer',
          'checked:bg-primary checked:border-primary',
          'hover:border-primary/50 hover:scale-110',
          className
        )}
        checked={checked}
        onChange={onChange}
        ref={ref}
        {...props}
      />
      {checked && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  )
})

Checkbox.displayName = 'Checkbox'

export default Checkbox