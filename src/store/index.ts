import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { Message, Conversation, ChatState } from '@/types/chat.types'
import { getStorageService } from '@/services/storage.service'

interface AppState extends ChatState {
  // UI State
  isSidebarOpen: boolean
  isSettingsOpen: boolean
  messageCount: number
  
  // Settings
  enableSounds: boolean
  enable3D: boolean
  theme: 'dark' | 'light'
  
  // Actions
  addMessage: (conversationId: string, message: Omit<Message, 'id'>) => void
  updateMessage: (conversationId: string, messageId: string, content: string) => void
  deleteMessage: (conversationId: string, messageId: string) => void
  
  createConversation: (title?: string) => string
  deleteConversation: (id: string) => void
  setActiveConversation: (id: string | null) => void
  updateConversationTitle: (id: string, title: string) => void
  
  setSelectedModel: (model: string) => void
  setAvailableModels: (models: string[]) => void
  setConnectionStatus: (isConnected: boolean) => void
  
  toggleSidebar: () => void
  toggleSettings: () => void
  toggleSounds: () => void
  toggle3D: () => void
  setTheme: (theme: 'dark' | 'light') => void
  
  incrementMessageCount: () => void
  
  // Persistence
  loadFromStorage: () => Promise<void>
  clearAllData: () => Promise<void>
}

const createInitialConversation = (): Conversation => ({
  id: `conv-${Date.now()}`,
  title: 'New Conversation',
  messages: [],
  createdAt: new Date(),
  updatedAt: new Date(),
})

export const useStore = create<AppState>()(
  devtools(
    persist(
      immer((set) => ({
        // Initial state
        conversations: [],
        activeConversationId: null,
        isConnected: false,
        selectedModel: import.meta.env.VITE_DEFAULT_MODEL || 'llama2',
        availableModels: [],
        
        isSidebarOpen: true,
        isSettingsOpen: false,
        messageCount: 0,
        
        enableSounds: import.meta.env.VITE_ENABLE_SOUNDS === 'true',
        enable3D: import.meta.env.VITE_ENABLE_3D === 'true',
        theme: 'dark',
        
        // Actions
        addMessage: (conversationId, message) =>
          set((state) => {
            const conversation = state.conversations.find((c: Conversation) => c.id === conversationId)
            if (!conversation) return
            
            const newMessage: Message = {
              ...message,
              id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            }
            
            conversation.messages.push(newMessage)
            conversation.updatedAt = new Date()
            
            // Auto-save to storage
            getStorageService().then(storage => 
              storage.saveConversation(conversation)
            ).catch(console.error)
          }),
          
        updateMessage: (conversationId, messageId, content) =>
          set((state) => {
            const conversation = state.conversations.find((c: Conversation) => c.id === conversationId)
            if (!conversation) return
            
            const message = conversation.messages.find((m: Message) => m.id === messageId)
            if (!message) return
            
            message.content = content
            message.isStreaming = false
            conversation.updatedAt = new Date()
            
            // Auto-save to storage
            getStorageService().then(storage => 
              storage.saveConversation(conversation)
            ).catch(console.error)
          }),
          
        deleteMessage: (conversationId, messageId) =>
          set((state) => {
            const conversation = state.conversations.find((c: Conversation) => c.id === conversationId)
            if (!conversation) return
            
            conversation.messages = conversation.messages.filter((m: Message) => m.id !== messageId)
            conversation.updatedAt = new Date()
            
            // Auto-save to storage
            getStorageService().then(storage => 
              storage.saveConversation(conversation)
            ).catch(console.error)
          }),
          
        createConversation: (title) => {
          const newConversation = createInitialConversation()
          if (title) newConversation.title = title
          
          set((state) => {
            state.conversations.push(newConversation)
            state.activeConversationId = newConversation.id
          })
          
          // Auto-save to storage
          getStorageService().then(storage => 
            storage.saveConversation(newConversation)
          ).catch(console.error)
          
          return newConversation.id
        },
        
        deleteConversation: (id) =>
          set((state) => {
            state.conversations = state.conversations.filter((c: Conversation) => c.id !== id)
            if (state.activeConversationId === id) {
              state.activeConversationId = state.conversations[0]?.id || null
            }
            
            // Auto-delete from storage
            getStorageService().then(storage => 
              storage.deleteConversation(id)
            ).catch(console.error)
          }),
          
        setActiveConversation: (id) =>
          set((state) => {
            state.activeConversationId = id
          }),
          
        updateConversationTitle: (id, title) =>
          set((state) => {
            const conversation = state.conversations.find((c: Conversation) => c.id === id)
            if (!conversation) return
            
            conversation.title = title
            conversation.updatedAt = new Date()
            
            // Auto-save to storage
            getStorageService().then(storage => 
              storage.saveConversation(conversation)
            ).catch(console.error)
          }),
          
        setSelectedModel: (model) =>
          set((state) => {
            state.selectedModel = model
            
            // Save to storage
            getStorageService().then(storage => 
              storage.saveSetting('selectedModel', model)
            ).catch(console.error)
          }),
          
        setAvailableModels: (models) =>
          set((state) => {
            state.availableModels = models
          }),
          
        setConnectionStatus: (isConnected) =>
          set((state) => {
            state.isConnected = isConnected
          }),
          
        toggleSidebar: () =>
          set((state) => {
            state.isSidebarOpen = !state.isSidebarOpen
          }),
          
        toggleSettings: () =>
          set((state) => {
            state.isSettingsOpen = !state.isSettingsOpen
          }),
          
        toggleSounds: () =>
          set((state) => {
            state.enableSounds = !state.enableSounds
            
            // Save to storage
            getStorageService().then(storage => 
              storage.saveSetting('settings', {
                enableSounds: state.enableSounds,
                enable3D: state.enable3D,
                theme: state.theme,
              })
            ).catch(console.error)
          }),
          
        toggle3D: () =>
          set((state) => {
            state.enable3D = !state.enable3D
            
            // Save to storage
            getStorageService().then(storage => 
              storage.saveSetting('settings', {
                enableSounds: state.enableSounds,
                enable3D: state.enable3D,
                theme: state.theme,
              })
            ).catch(console.error)
          }),
          
        setTheme: (theme) =>
          set((state) => {
            state.theme = theme
            
            // Save to storage
            getStorageService().then(storage => 
              storage.saveSetting('settings', {
                enableSounds: state.enableSounds,
                enable3D: state.enable3D,
                theme: state.theme,
              })
            ).catch(console.error)
          }),
          
        incrementMessageCount: () =>
          set((state) => {
            state.messageCount += 1
          }),
          
        loadFromStorage: async () => {
          try {
            const storage = await getStorageService()
            const conversations = await storage.getConversations()
            const selectedModel = await storage.getSetting('selectedModel')
            const settings = await storage.getSetting('settings')
            
            set((state) => {
              state.conversations = conversations
              if (selectedModel) state.selectedModel = selectedModel
              if (settings) {
                state.enableSounds = settings.enableSounds
                state.enable3D = settings.enable3D
                state.theme = settings.theme
              }
              
              // Set active conversation to the most recent one
              if (conversations.length > 0 && !state.activeConversationId) {
                state.activeConversationId = conversations[0].id
              }
            })
          } catch (error) {
            console.error('Failed to load from storage:', error)
          }
        },
        
        clearAllData: async () => {
          try {
            const storage = await getStorageService()
            await storage.clearAllConversations()
            
            set((state) => {
              state.conversations = []
              state.activeConversationId = null
              state.messageCount = 0
            })
          } catch (error) {
            console.error('Failed to clear data:', error)
          }
        },
      })),
      {
        name: 'pachinko-ollama-store',
        partialize: (state) => ({
          selectedModel: state.selectedModel,
          enableSounds: state.enableSounds,
          enable3D: state.enable3D,
          theme: state.theme,
          isSidebarOpen: state.isSidebarOpen,
        }),
      }
    ),
    {
      name: 'PachinkoOllamaStore',
    }
  )
)