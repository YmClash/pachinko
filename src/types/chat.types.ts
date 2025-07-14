export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  isStreaming?: boolean
  error?: string
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  model?: string
}

export interface ChatState {
  conversations: Conversation[]
  activeConversationId: string | null
  isConnected: boolean
  selectedModel: string
  availableModels: string[]
}