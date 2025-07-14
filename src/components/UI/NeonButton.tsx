import { motion, HTMLMotionProps } from 'framer-motion'
import { ReactNode, forwardRef } from 'react'
import { useSound } from '@/hooks/useSound'

type NeonColor = 'pink' | 'blue' | 'purple' | 'green' | 'yellow'

interface NeonButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode
  color?: NeonColor
  size?: 'sm' | 'md' | 'lg'
  variant?: 'solid' | 'outline' | 'ghost'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
}

const colorClasses: Record<NeonColor, string> = {
  pink: 'text-neon-pink border-neon-pink shadow-neon-pink',
  blue: 'text-neon-blue border-neon-blue shadow-neon-blue',
  purple: 'text-neon-purple border-neon-purple shadow-neon-purple',
  green: 'text-neon-green border-neon-green shadow-neon-green',
  yellow: 'text-neon-yellow border-neon-yellow shadow-neon-yellow',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

export const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(
  (
    {
      children,
      color = 'pink',
      size = 'md',
      variant = 'solid',
      disabled = false,
      loading = false,
      fullWidth = false,
      className = '',
      onClick,
      ...props
    },
    ref
  ) => {
    const { play } = useSound()

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && !loading) {
        play('click')
        onClick?.(e)
      }
    }

    const baseClasses = `
      relative font-orbitron font-bold rounded-lg
      transition-all duration-300 
      ${sizeClasses[size]}
      ${fullWidth ? 'w-full' : ''}
      ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    `

    const variantClasses = {
      solid: `
        ${color === 'pink' ? 'bg-neon-pink' : ''}
        ${color === 'blue' ? 'bg-neon-blue' : ''}
        ${color === 'purple' ? 'bg-neon-purple' : ''}
        ${color === 'green' ? 'bg-neon-green' : ''}
        ${color === 'yellow' ? 'bg-neon-yellow' : ''}
        text-black hover:text-white
      `,
      outline: `
        bg-transparent border-2
        ${colorClasses[color]}
        hover:bg-opacity-10
      `,
      ghost: `
        bg-transparent
        ${colorClasses[color]}
        hover:bg-opacity-10
      `,
    }

    return (
      <motion.button
        ref={ref}
        whileHover={!disabled && !loading ? { scale: 1.05 } : {}}
        whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
        onClick={handleClick}
        disabled={disabled || loading}
        className={`
          ${baseClasses}
          ${variantClasses[variant]}
          ${className}
        `}
        style={{
          boxShadow: variant === 'solid' 
            ? `0 0 20px currentColor, inset 0 0 20px rgba(255,255,255,0.2)`
            : variant === 'outline'
            ? `0 0 10px currentColor`
            : undefined,
        }}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            />
          )}
          {children}
        </span>

        {/* Shine effect */}
        {variant === 'solid' && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-30"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
              repeatDelay: 1,
            }}
          />
        )}

        {/* Pulse effect */}
        {!disabled && !loading && (
          <motion.div
            className="absolute inset-0 rounded-lg"
            animate={{
              boxShadow: [
                `0 0 20px transparent`,
                `0 0 40px ${variant === 'solid' ? 'rgba(255,255,255,0.5)' : 'currentColor'}`,
                `0 0 20px transparent`,
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </motion.button>
    )
  }
)

NeonButton.displayName = 'NeonButton'