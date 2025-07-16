import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { AnimatedIcon } from './AnimatedIcon'

interface SplashScreenProps {
  isLoading: boolean
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ isLoading }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <AnimatedIcon
              Icon={Sparkles}
              color="purple"
              size={80}
              animation="rotate"
              glowIntensity="high"
            />
            
            <motion.h1
              className="mt-8 text-6xl font-orbitron font-bold neon-text neon-text-pink"
              animate={{
                textShadow: [
                  '0 0 20px #ff006e',
                  '0 0 40px #ff006e',
                  '0 0 20px #ff006e'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              PACHINKO
            </motion.h1>
            
            <motion.p
              className="mt-4 text-2xl font-orbitron neon-text neon-text-blue"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              OLLAMA CHAT By YmC
            </motion.p>
            
            <motion.div
              className="mt-8 flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-neon-purple rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeInOut'
                  }}
                />
              ))}
            </motion.div>
            
            <motion.p
              className="mt-4 text-gray-400 font-orbitron text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.7 }}
            >
              Initializing quantum neural networks...
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}