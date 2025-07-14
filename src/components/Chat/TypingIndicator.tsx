import { motion } from 'framer-motion'

export const TypingIndicator: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-3"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-neon-purple/20 border-2 border-neon-purple flex items-center justify-center"
        style={{
          boxShadow: '0 0 20px #8338ec',
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-5 h-5 rounded-full border-2 border-neon-purple border-t-transparent"
        />
      </div>
      
      <div className="bg-neon-purple/10 backdrop-blur-sm border border-neon-purple/30 rounded-lg p-4"
        style={{
          boxShadow: '0 0 20px rgba(131, 56, 236, 0.3)',
        }}
      >
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-neon-purple rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}