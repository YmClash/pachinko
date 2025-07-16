import { motion } from 'framer-motion'
import { Cpu, Loader2 } from 'lucide-react'
import { AnimatedIcon } from '@/components/UI'

// interface ModelLoadingIndicatorProps {
//   message?: string
// }

export const ModelLoadingIndicator: React.FC<ModelLoadingIndicatorProps> = ({ 
  message = 'Model is initializing... This might take a moment for the first response.' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-3"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-neon-blue/20 border-2 border-neon-blue flex items-center justify-center"
        style={{
          boxShadow: '0 0 20px #3a86ff',
        }}
      >
        <AnimatedIcon Icon={Cpu} color="blue" size={20} animation="pulse" />
      </div>
      
      <div className="bg-neon-blue/10 backdrop-blur-sm border border-neon-blue/30 rounded-lg p-4"
        style={{
          boxShadow: '0 0 20px rgba(58, 134, 255, 0.3)',
        }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className="w-5 h-5 text-neon-blue" />
          </motion.div>
          <p className="text-sm font-orbitron text-gray-300">
            {message}
          </p>
        </div>
        <motion.div 
          className="mt-2 h-1 bg-neon-blue/20 rounded-full overflow-hidden"
        >
          <motion.div
            className="h-full bg-neon-blue"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{ width: '50%' }}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}