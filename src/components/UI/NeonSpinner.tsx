import { motion } from 'framer-motion'

type NeonColor = 'pink' | 'blue' | 'purple' | 'green' | 'yellow'

interface NeonSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: NeonColor
  className?: string
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
}

const colorClasses: Record<NeonColor, string> = {
  pink: 'border-neon-pink',
  blue: 'border-neon-blue',
  purple: 'border-neon-purple',
  green: 'border-neon-green',
  yellow: 'border-neon-yellow',
}

export const NeonSpinner: React.FC<NeonSpinnerProps> = ({
  size = 'md',
  color = 'purple',
  className = '',
}) => {
  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Main spinner */}
      <motion.div
        className={`
          absolute inset-0 
          border-4 border-t-transparent 
          ${colorClasses[color]}
          rounded-full
        `}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          boxShadow: `0 0 20px currentColor, inset 0 0 10px currentColor`,
        }}
      />

      {/* Inner spinner (opposite direction) */}
      <motion.div
        className={`
          absolute inset-2
          border-2 border-b-transparent 
          ${colorClasses[color]}
          rounded-full
          opacity-50
        `}
        animate={{ rotate: -360 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Center glow */}
      <motion.div
        className={`
          absolute inset-0 
          flex items-center justify-center
        `}
      >
        <motion.div
          className={`
            w-1/3 h-1/3 
            ${color === 'pink' ? 'bg-neon-pink' : ''}
            ${color === 'blue' ? 'bg-neon-blue' : ''}
            ${color === 'purple' ? 'bg-neon-purple' : ''}
            ${color === 'green' ? 'bg-neon-green' : ''}
            ${color === 'yellow' ? 'bg-neon-yellow' : ''}
            rounded-full
          `}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            filter: 'blur(4px)',
            boxShadow: `0 0 20px currentColor`,
          }}
        />
      </motion.div>
    </div>
  )
}