import { useState, useRef, KeyboardEvent } from 'react'
import { Send, Loader, StopCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { NeonButton, NeonInput, AnimatedIcon } from '@/components/UI'
import { useSound } from '@/hooks/useSound'

interface MessageInputProps {
  onSendMessage: (message: string) => void
  onCancel?: () => void
  isStreaming?: boolean
  disabled?: boolean
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onCancel,
  isStreaming = false,
  disabled = false,
}) => {
  const [message, setMessage] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { play } = useSound()

  const handleSubmit = () => {
    if (message.trim() && !disabled && !isStreaming) {
      play('message')
      onSendMessage(message.trim())
      setMessage('')
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleCancel = () => {
    if (isStreaming && onCancel) {
      play('click')
      onCancel()
    }
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative p-4 bg-black/80 backdrop-blur-md border-t border-neon-purple/30"
      style={{
        boxShadow: '0 -10px 30px rgba(131, 56, 236, 0.2)',
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end gap-3">
          {/* Input field wrapper */}
          <div className="flex-1 relative">
            <NeonInput
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isStreaming ? "AI is thinking..." : "Type your message..."}
              disabled={disabled || isStreaming}
              color="purple"
              size="lg"
              className="pr-12"
              fullWidth
            />

            {/* Character count */}
            {message.length > 0 && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                className="absolute right-3 bottom-3 text-xs text-gray-400 font-orbitron"
              >
                {message.length}
              </motion.span>
            )}
          </div>

          {/* Send/Cancel button */}
          {isStreaming ? (
            <NeonButton
              onClick={handleCancel}
              color="pink"
              size="lg"
              variant="solid"
              className="flex-shrink-0"
            >
              <StopCircle size={20} />
              Stop
            </NeonButton>
          ) : (
            <NeonButton
              onClick={handleSubmit}
              disabled={!message.trim() || disabled}
              color="green"
              size="lg"
              variant="solid"
              className="flex-shrink-0"
            >
              {disabled ? (
                <AnimatedIcon Icon={Loader} color="green" size={20} animation="rotate" />
              ) : (
                <Send size={20} />
              )}
              Send
            </NeonButton>
          )}
        </div>

        {/* Typing hints */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isFocused ? 1 : 0 }}
          className="mt-2 text-xs text-gray-400 font-orbitron"
        >
          Press <span className="text-neon-purple">Enter</span> to send
        </motion.div>

        {/* Animated border */}
        {isFocused && (
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%', transformOrigin: 'left' }}
          />
        )}
      </div>
    </motion.div>
  )
}