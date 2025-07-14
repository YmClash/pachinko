import { motion, HTMLMotionProps } from 'framer-motion'
import { ReactNode, forwardRef } from 'react'

type NeonColor = 'pink' | 'blue' | 'purple' | 'green' | 'yellow'

interface GlowCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode
  color?: NeonColor
  intensity?: 'low' | 'medium' | 'high'
  animated?: boolean
  glass?: boolean
}

const colorClasses: Record<NeonColor, string> = {
  pink: 'border-neon-pink/50 shadow-neon-pink',
  blue: 'border-neon-blue/50 shadow-neon-blue',
  purple: 'border-neon-purple/50 shadow-neon-purple',
  green: 'border-neon-green/50 shadow-neon-green',
  yellow: 'border-neon-yellow/50 shadow-neon-yellow',
}

const intensityStyles: Record<string, string> = {
  low: '0 0 10px',
  medium: '0 0 20px',
  high: '0 0 30px',
}

export const GlowCard = forwardRef<HTMLDivElement, GlowCardProps>(
  (
    {
      children,
      color = 'purple',
      intensity = 'medium',
      animated = false,
      glass = true,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const baseClasses = `
      relative rounded-lg border-2 p-6
      ${colorClasses[color]}
      ${glass ? 'backdrop-blur-sm bg-black/20' : 'bg-black/80'}
      transition-all duration-300
    `

    const glowIntensity = intensityStyles[intensity]

    return (
      <motion.div
        ref={ref}
        className={`${baseClasses} ${className}`}
        style={{
          boxShadow: `${glowIntensity} currentColor, inset 0 0 10px rgba(255,255,255,0.1)`,
          ...style,
        }}
        whileHover={animated ? { scale: 1.02 } : {}}
        transition={{ type: 'spring', stiffness: 300 }}
        {...props}
      >
        {children}

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-current rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-current rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-current rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-current rounded-br-lg" />

        {/* Animated glow pulse */}
        {animated && (
          <motion.div
            className="absolute inset-0 rounded-lg pointer-events-none"
            animate={{
              boxShadow: [
                `0 0 ${intensity === 'low' ? '10px' : intensity === 'medium' ? '20px' : '30px'} transparent`,
                `0 0 ${intensity === 'low' ? '20px' : intensity === 'medium' ? '40px' : '60px'} currentColor`,
                `0 0 ${intensity === 'low' ? '10px' : intensity === 'medium' ? '20px' : '30px'} transparent`,
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 rounded-lg pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
        </div>
      </motion.div>
    )
  }
)

GlowCard.displayName = 'GlowCard'