import { motion } from 'framer-motion'
import { forwardRef, InputHTMLAttributes, useState } from 'react'
import { LucideIcon } from 'lucide-react'

type NeonColor = 'pink' | 'blue' | 'purple' | 'green' | 'yellow'

interface NeonInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  color?: NeonColor
  size?: 'sm' | 'md' | 'lg'
  icon?: LucideIcon
  error?: string
  fullWidth?: boolean
}

const colorClasses: Record<NeonColor, string> = {
  pink: 'border-neon-pink/50 focus:border-neon-pink focus:shadow-neon-pink text-neon-pink',
  blue: 'border-neon-blue/50 focus:border-neon-blue focus:shadow-neon-blue text-neon-blue',
  purple: 'border-neon-purple/50 focus:border-neon-purple focus:shadow-neon-purple text-neon-purple',
  green: 'border-neon-green/50 focus:border-neon-green focus:shadow-neon-green text-neon-green',
  yellow: 'border-neon-yellow/50 focus:border-neon-yellow focus:shadow-neon-yellow text-neon-yellow',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-5 py-3 text-lg',
}

export const NeonInput = forwardRef<HTMLInputElement, NeonInputProps>(
  (
    {
      color = 'purple',
      size = 'md',
      icon: Icon,
      error,
      fullWidth = false,
      className = '',
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false)

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      onBlur?.(e)
    }

    return (
      <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
        {Icon && (
          <div 
            className={`
              absolute left-3 top-1/2 -translate-y-1/2 
              ${colorClasses[color].split(' ')[4]} 
              transition-all duration-300
              ${isFocused ? 'opacity-100' : 'opacity-50'}
            `}
            style={{
              filter: isFocused ? 'drop-shadow(0 0 10px currentColor)' : undefined,
            }}
          >
            <Icon size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} />
          </div>
        )}

        <input
          ref={ref}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`
            ${sizeClasses[size]}
            ${Icon ? 'pl-10' : ''}
            ${colorClasses[color]}
            ${error ? 'border-red-500' : ''}
            bg-black/50 backdrop-blur-sm
            border-2 rounded-lg
            outline-none
            font-orbitron
            placeholder-gray-500
            transition-all duration-300
            w-full
            ${className}
          `}
          style={{
            boxShadow: isFocused 
              ? `0 0 20px currentColor, inset 0 0 10px rgba(255,255,255,0.1)`
              : error 
              ? '0 0 10px #ef4444'
              : undefined,
            transform: isFocused ? 'scale(1.02)' : 'scale(1)',
          }}
          {...props}
        />

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-500 font-orbitron"
          >
            {error}
          </motion.p>
        )}

        {/* Animated border gradient */}
        {isFocused && (
          <motion.div
            className="absolute inset-0 rounded-lg pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-current to-transparent opacity-20" />
          </motion.div>
        )}
      </div>
    )
  }
)

NeonInput.displayName = 'NeonInput'