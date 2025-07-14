import { motion } from 'framer-motion'
import { User, Bot, Copy, Check, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { Message } from '@/types/chat.types'
import { AnimatedIcon, NeonButton } from '@/components/UI'
import { useSound } from '@/hooks/useSound'

interface MessageBubbleProps {
  message: Message
  isLast?: boolean
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isLast }) => {
  const [isCopied, setIsCopied] = useState(false)
  const { play } = useSound()
  const isUser = message.role === 'user'
  const isError = !!message.error

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setIsCopied(true)
      play('click')
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 25,
        delay: isLast ? 0.1 : 0
      }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className={`
          flex-shrink-0 w-10 h-10 rounded-full 
          flex items-center justify-center
          ${isUser ? 'bg-neon-blue/20' : 'bg-neon-purple/20'}
          border-2 ${isUser ? 'border-neon-blue' : 'border-neon-purple'}
        `}
        style={{
          boxShadow: `0 0 20px ${isUser ? '#3a86ff' : '#8338ec'}`,
        }}
      >
        <AnimatedIcon
          Icon={isUser ? User : Bot}
          color={isUser ? 'blue' : 'purple'}
          size={20}
          animation="none"
          glowIntensity="medium"
        />
      </motion.div>

      {/* Message content */}
      <motion.div
        className={`
          relative max-w-[70%] rounded-lg p-4
          ${isUser ? 'bg-neon-blue/10' : 'bg-neon-purple/10'}
          ${isError ? 'bg-red-500/10' : ''}
          backdrop-blur-sm
          border ${isUser ? 'border-neon-blue/30' : 'border-neon-purple/30'}
          ${isError ? 'border-red-500/30' : ''}
        `}
        style={{
          boxShadow: isError 
            ? '0 0 20px rgba(239, 68, 68, 0.3)'
            : `0 0 20px ${isUser ? 'rgba(58, 134, 255, 0.3)' : 'rgba(131, 56, 236, 0.3)'}`,
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 400 }}
      >
        {/* Error indicator */}
        {isError && (
          <div className="flex items-center gap-2 mb-2 text-red-500">
            <AlertCircle size={16} />
            <span className="text-sm font-orbitron">Error</span>
          </div>
        )}

        {/* Message text */}
        <div className="text-white font-sans whitespace-pre-wrap break-words">
          {message.isStreaming ? (
            <>
              {message.content}
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="inline-block w-2 h-4 ml-1 bg-current"
              />
            </>
          ) : (
            message.content
          )}
        </div>

        {/* Copy button */}
        {!message.isStreaming && message.content && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute top-2 right-2"
          >
            <NeonButton
              onClick={handleCopy}
              color={isUser ? 'blue' : 'purple'}
              size="sm"
              variant="ghost"
              className="opacity-0 hover:opacity-100 transition-opacity"
            >
              {isCopied ? <Check size={16} /> : <Copy size={16} />}
            </NeonButton>
          </motion.div>
        )}

        {/* Timestamp */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.3 }}
          className="text-xs text-gray-400 mt-2 font-orbitron"
        >
          {new Date(message.timestamp).toLocaleTimeString()}
        </motion.div>

        {/* Glow effect for streaming messages */}
        {message.isStreaming && (
          <motion.div
            className="absolute inset-0 rounded-lg pointer-events-none"
            animate={{
              boxShadow: [
                '0 0 20px transparent',
                `0 0 40px ${isUser ? '#3a86ff' : '#8338ec'}`,
                '0 0 20px transparent',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </motion.div>
    </motion.div>
  )
}