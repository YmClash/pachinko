import { useState, useCallback, useEffect, useRef } from 'react'
import { useStore } from '@/store'
import { 
  initializeOllamaService,
  OllamaService 
} from '@/services/ollama.service'
import { OllamaServiceError } from '@/types/ollama.types'
import type { Message } from '@/types/chat.types'

interface UseOllamaReturn {
  sendMessage: (content: string) => Promise<void>
  cancelStream: () => void
  isStreaming: boolean
  error: string | null
  reconnect: () => Promise<void>
}

export const useOllama = (): UseOllamaReturn => {
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const ollamaRef = useRef<OllamaService | null>(null)
  
  const {
    activeConversationId,
    selectedModel,
    addMessage,
    updateMessage,
    setConnectionStatus,
    setAvailableModels,
    incrementMessageCount,
  } = useStore()

  // Initialize Ollama service
  useEffect(() => {
    if (!ollamaRef.current) {
      try {
        ollamaRef.current = initializeOllamaService({
          baseUrl: import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434',
          model: selectedModel,
        })
        checkConnection()
      } catch (err) {
        console.error('Failed to initialize Ollama service:', err)
        setError('Failed to initialize Ollama service')
      }
    }
  }, [])

  // Update model when it changes
  useEffect(() => {
    if (ollamaRef.current) {
      ollamaRef.current.updateConfig({ model: selectedModel })
    }
  }, [selectedModel])

  const checkConnection = useCallback(async () => {
    if (!ollamaRef.current) return

    try {
      const models = await ollamaRef.current.getModels()
      setAvailableModels(models.models.map(m => m.name))
      setConnectionStatus(true)
      setError(null)
    } catch (err) {
      console.error('Connection check failed:', err)
      setConnectionStatus(false)
      setError('Cannot connect to Ollama. Make sure Ollama is running.')
    }
  }, [setAvailableModels, setConnectionStatus])

  const sendMessage = useCallback(async (content: string) => {
    if (!activeConversationId || !ollamaRef.current) {
      setError('No active conversation or Ollama service not initialized')
      return
    }

    setIsStreaming(true)
    setError(null)

    // Add user message
    const userMessage: Omit<Message, 'id'> = {
      role: 'user',
      content,
      timestamp: new Date(),
    }
    addMessage(activeConversationId, userMessage)
    incrementMessageCount()

    // Add empty assistant message
    const assistantMessage: Omit<Message, 'id'> = {
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    }
    
    // Store the assistant message and get its ID from the store
    addMessage(activeConversationId, assistantMessage)
    
    // Get the last message (the one we just added) to get its ID
    const conversation = useStore.getState().conversations.find(c => c.id === activeConversationId)
    const assistantMessageId = conversation?.messages[conversation.messages.length - 1]?.id
    
    if (!assistantMessageId) {
      setError('Failed to create assistant message')
      return
    }

    try {
      let fullResponse = ''
      let lastUpdateTime = Date.now()
      const updateInterval = 50 // Update UI every 50ms to avoid too many re-renders

      for await (const chunk of ollamaRef.current.streamChat(content)) {
        fullResponse += chunk
        
        // Throttle updates to avoid performance issues
        const now = Date.now()
        if (now - lastUpdateTime > updateInterval) {
          updateMessage(activeConversationId, assistantMessageId, fullResponse)
          lastUpdateTime = now
        }
      }

      // Final update with complete response
      updateMessage(activeConversationId, assistantMessageId, fullResponse)
      incrementMessageCount()
      
      // Play success sound if enabled
      if (useStore.getState().enableSounds) {
        // Sound will be implemented in Phase 7
      }
    } catch (err) {
      console.error('Streaming error:', err)
      
      let errorMessage = 'An error occurred while generating response'
      if (err instanceof OllamaServiceError) {
        switch (err.type) {
          case 'connection':
            errorMessage = 'Connection lost. Please check if Ollama is running.'
            break
          case 'timeout':
            errorMessage = 'Request timed out. The model might be too slow or overloaded.'
            break
          case 'parse':
            errorMessage = 'Failed to parse response from Ollama.'
            break
        }
      }
      
      updateMessage(activeConversationId, assistantMessageId, `Error: ${errorMessage}`)
      setError(errorMessage)
      setConnectionStatus(false)
    } finally {
      setIsStreaming(false)
    }
  }, [
    activeConversationId, 
    addMessage, 
    updateMessage, 
    incrementMessageCount,
    setConnectionStatus
  ])

  const cancelStream = useCallback(() => {
    if (ollamaRef.current) {
      ollamaRef.current.cancelStream()
      setIsStreaming(false)
    }
  }, [])

  const reconnect = useCallback(async () => {
    setError(null)
    if (ollamaRef.current) {
      ollamaRef.current.resetCircuitBreaker()
    }
    await checkConnection()
  }, [checkConnection])

  return {
    sendMessage,
    cancelStream,
    isStreaming,
    error,
    reconnect,
  }
}