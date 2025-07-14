import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, Sparkles } from 'lucide-react'
import { useStore } from '@/store'
import { useOllama } from '@/hooks/useOllama'
import { MessageBubble } from './MessageBubble'
import { MessageInput } from './MessageInput'
import { TypingIndicator } from './TypingIndicator'
import { GlowCard, AnimatedIcon, NeonButton } from '@/components/UI'

export const ChatWindow: React.FC = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [autoScroll, setAutoScroll] = useState(true)
  
  const {
    conversations,
    activeConversationId,
    isConnected,
    createConversation,
  } = useStore()

  const { sendMessage, cancelStream, isStreaming, error, reconnect } = useOllama()

  const activeConversation = conversations.find(c => c.id === activeConversationId)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [activeConversation?.messages, autoScroll])

  // Check if user is scrolling
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100
      setAutoScroll(isAtBottom)
    }
  }

  // Create initial conversation if none exists
  useEffect(() => {
    if (conversations.length === 0) {
      createConversation('Welcome Chat')
    }
  }, [conversations.length, createConversation])

  if (!activeConversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <GlowCard color="purple" intensity="high" animated>
          <div className="text-center">
            <AnimatedIcon Icon={Sparkles} color="purple" size={48} animation="rotate" />
            <h2 className="mt-4 text-2xl font-orbitron neon-text neon-text-purple">
              No conversation selected
            </h2>
            <p className="mt-2 text-gray-400">
              Create a new conversation to start chatting
            </p>
          </div>
        </GlowCard>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-screen pt-16">
      {/* Connection error banner */}
      <AnimatePresence>
        {!isConnected && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-red-500/20 border-b border-red-500/50 overflow-hidden"
          >
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AnimatedIcon Icon={AlertCircle} color="pink" size={20} animation="pulse" />
                <span className="text-sm font-orbitron text-red-400">
                  {error || 'Connection to Ollama lost'}
                </span>
              </div>
              <NeonButton
                onClick={reconnect}
                color="pink"
                size="sm"
                variant="outline"
              >
                Reconnect
              </NeonButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-6"
        style={{
          background: `
            radial-gradient(ellipse at top, rgba(131, 56, 236, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at bottom, rgba(58, 134, 255, 0.1) 0%, transparent 50%)
          `,
        }}
      >
        {/* Welcome message if no messages */}
        {activeConversation.messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <AnimatedIcon Icon={Sparkles} color="purple" size={64} animation="float" />
            <h2 className="mt-6 text-3xl font-orbitron font-bold neon-text neon-text-purple">
              Welcome to Pachinko Chat
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Start a conversation with your AI assistant
            </p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {[
                'Tell me a joke',
                'Explain quantum computing',
                'Write a haiku about coding',
                'What can you help me with?',
              ].map((prompt, index) => (
                <NeonButton
                  key={index}
                  onClick={() => sendMessage(prompt)}
                  color={index % 2 === 0 ? 'blue' : 'purple'}
                  variant="outline"
                  className="text-left"
                  disabled={!isConnected}
                >
                  {prompt}
                </NeonButton>
              ))}
            </div>
          </motion.div>
        )}

        {/* Messages */}
        <AnimatePresence mode="popLayout">
          {activeConversation.messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isLast={index === activeConversation.messages.length - 1}
            />
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {isStreaming && activeConversation.messages[activeConversation.messages.length - 1]?.role === 'user' && (
            <TypingIndicator />
          )}
        </AnimatePresence>

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button */}
      <AnimatePresence>
        {!autoScroll && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={() => {
              setAutoScroll(true)
              messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="absolute bottom-24 right-8 p-3 bg-neon-purple text-white rounded-full shadow-lg"
            style={{
              boxShadow: '0 0 20px #8338ec',
            }}
          >
            ↓
          </motion.button>
        )}
      </AnimatePresence>

      {/* Message input */}
      <MessageInput
        onSendMessage={sendMessage}
        onCancel={cancelStream}
        isStreaming={isStreaming}
        disabled={!isConnected}
      />
    </div>
  )
}