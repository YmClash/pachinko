import { motion, HTMLMotionProps } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { forwardRef } from 'react'

type NeonColor = 'pink' | 'blue' | 'purple' | 'green' | 'yellow'

interface AnimatedIconProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  Icon: LucideIcon
  color?: NeonColor
  size?: number
  animation?: 'pulse' | 'rotate' | 'bounce' | 'float' | 'none'
  glowIntensity?: 'low' | 'medium' | 'high'
}

const colorClasses: Record<NeonColor, string> = {
  pink: 'text-neon-pink',
  blue: 'text-neon-blue',
  purple: 'text-neon-purple',
  green: 'text-neon-green',
  yellow: 'text-neon-yellow',
}

const animations = {
  pulse: {
    scale: [1, 1.2, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  rotate: {
    rotate: 360,
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
  bounce: {
    y: [0, -10, 0],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  float: {
    y: [0, -10, 0],
    x: [-5, 5, -5],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  none: {},
}

const glowIntensities = {
  low: 'drop-shadow(0 0 5px currentColor)',
  medium: 'drop-shadow(0 0 10px currentColor)',
  high: 'drop-shadow(0 0 20px currentColor)',
}

export const AnimatedIcon = forwardRef<HTMLDivElement, AnimatedIconProps>(
  (
    {
      Icon,
      color = 'purple',
      size = 24,
      animation = 'pulse',
      glowIntensity = 'medium',
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        className={`inline-flex ${colorClasses[color]} ${className}`}
        animate={animations[animation]}
        style={{
          filter: glowIntensity !== 'low' ? glowIntensities[glowIntensity] : undefined,
          ...style,
        }}
        {...props}
      >
        <Icon size={size} strokeWidth={2} />
      </motion.div>
    )
  }
)

AnimatedIcon.displayName = 'AnimatedIcon'