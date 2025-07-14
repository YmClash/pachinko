import type { Conversation } from '@/types/chat.types'

export interface StorageData {
  conversations: Conversation[]
  selectedModel: string
  settings: {
    enableSounds: boolean
    enable3D: boolean
    theme: 'dark' | 'light'
  }
}

export class StorageService {
  private readonly STORAGE_KEY = 'pachinko-ollama-chat'
  private readonly DB_NAME = 'PachinkoOllamaDB'
  private readonly DB_VERSION = 1
  private db: IDBDatabase | null = null

  async initialize(): Promise<void> {
    try {
      this.db = await this.openDatabase()
    } catch (error) {
      console.error('Failed to initialize IndexedDB, falling back to localStorage', error)
    }
  }

  private openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create conversations store
        if (!db.objectStoreNames.contains('conversations')) {
          const conversationStore = db.createObjectStore('conversations', { keyPath: 'id' })
          conversationStore.createIndex('updatedAt', 'updatedAt', { unique: false })
        }

        // Create settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' })
        }
      }
    })
  }

  // Conversations methods
  async saveConversation(conversation: Conversation): Promise<void> {
    if (this.db) {
      try {
        const transaction = this.db.transaction(['conversations'], 'readwrite')
        const store = transaction.objectStore('conversations')
        await this.promisifyRequest(store.put(conversation))
        return
      } catch (error) {
        console.error('IndexedDB save failed, falling back to localStorage', error)
      }
    }

    // Fallback to localStorage
    const data = this.getLocalStorageData()
    const index = data.conversations.findIndex(c => c.id === conversation.id)
    if (index >= 0) {
      data.conversations[index] = conversation
    } else {
      data.conversations.push(conversation)
    }
    this.saveLocalStorageData(data)
  }

  async getConversations(): Promise<Conversation[]> {
    if (this.db) {
      try {
        const transaction = this.db.transaction(['conversations'], 'readonly')
        const store = transaction.objectStore('conversations')
        const conversations = await this.promisifyRequest(store.getAll())
        return conversations.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
      } catch (error) {
        console.error('IndexedDB read failed, falling back to localStorage', error)
      }
    }

    // Fallback to localStorage
    const data = this.getLocalStorageData()
    return data.conversations.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  }

  async deleteConversation(id: string): Promise<void> {
    if (this.db) {
      try {
        const transaction = this.db.transaction(['conversations'], 'readwrite')
        const store = transaction.objectStore('conversations')
        await this.promisifyRequest(store.delete(id))
        return
      } catch (error) {
        console.error('IndexedDB delete failed, falling back to localStorage', error)
      }
    }

    // Fallback to localStorage
    const data = this.getLocalStorageData()
    data.conversations = data.conversations.filter(c => c.id !== id)
    this.saveLocalStorageData(data)
  }

  async clearAllConversations(): Promise<void> {
    if (this.db) {
      try {
        const transaction = this.db.transaction(['conversations'], 'readwrite')
        const store = transaction.objectStore('conversations')
        await this.promisifyRequest(store.clear())
        return
      } catch (error) {
        console.error('IndexedDB clear failed, falling back to localStorage', error)
      }
    }

    // Fallback to localStorage
    const data = this.getLocalStorageData()
    data.conversations = []
    this.saveLocalStorageData(data)
  }

  // Settings methods
  async saveSetting<K extends keyof StorageData>(key: K, value: StorageData[K]): Promise<void> {
    if (this.db) {
      try {
        const transaction = this.db.transaction(['settings'], 'readwrite')
        const store = transaction.objectStore('settings')
        await this.promisifyRequest(store.put({ key, value }))
        return
      } catch (error) {
        console.error('IndexedDB save setting failed, falling back to localStorage', error)
      }
    }

    // Fallback to localStorage
    const data = this.getLocalStorageData()
    data[key] = value
    this.saveLocalStorageData(data)
  }

  async getSetting<K extends keyof StorageData>(key: K): Promise<StorageData[K] | null> {
    if (this.db) {
      try {
        const transaction = this.db.transaction(['settings'], 'readonly')
        const store = transaction.objectStore('settings')
        const result = await this.promisifyRequest(store.get(key))
        return result?.value || null
      } catch (error) {
        console.error('IndexedDB get setting failed, falling back to localStorage', error)
      }
    }

    // Fallback to localStorage
    const data = this.getLocalStorageData()
    return data[key] || null
  }

  // Helper methods
  private promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  private getLocalStorageData(): StorageData {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to parse localStorage data', error)
    }

    return {
      conversations: [],
      selectedModel: import.meta.env.VITE_DEFAULT_MODEL || 'llama2',
      settings: {
        enableSounds: import.meta.env.VITE_ENABLE_SOUNDS === 'true',
        enable3D: import.meta.env.VITE_ENABLE_3D === 'true',
        theme: 'dark',
      },
    }
  }

  private saveLocalStorageData(data: StorageData): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save to localStorage', error)
      // If localStorage is full, try to clear old conversations
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        const limitedData = {
          ...data,
          conversations: data.conversations.slice(0, 10), // Keep only last 10 conversations
        }
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limitedData))
      }
    }
  }

  // Export/Import functionality
  async exportData(): Promise<string> {
    const conversations = await this.getConversations()
    const selectedModel = await this.getSetting('selectedModel')
    const settings = await this.getSetting('settings')

    return JSON.stringify({
      conversations,
      selectedModel,
      settings,
      exportDate: new Date().toISOString(),
      version: '1.0.0',
    }, null, 2)
  }

  async importData(jsonString: string): Promise<void> {
    try {
      const data = JSON.parse(jsonString)
      
      // Validate data structure
      if (!data.conversations || !Array.isArray(data.conversations)) {
        throw new Error('Invalid data format')
      }

      // Clear existing data
      await this.clearAllConversations()

      // Import conversations
      for (const conversation of data.conversations) {
        await this.saveConversation(conversation)
      }

      // Import settings
      if (data.selectedModel) {
        await this.saveSetting('selectedModel', data.selectedModel)
      }
      if (data.settings) {
        await this.saveSetting('settings', data.settings)
      }
    } catch (error) {
      throw new Error(`Failed to import data: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

// Singleton instance
let instance: StorageService | null = null

export const getStorageService = async (): Promise<StorageService> => {
  if (!instance) {
    instance = new StorageService()
    await instance.initialize()
  }
  return instance
}