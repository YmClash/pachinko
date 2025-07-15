import type {
  OllamaConfig,
  GenerateRequest,
  ModelsResponse,
} from '@/types/ollama.types'
import { OllamaServiceError } from '@/types/ollama.types'

export class OllamaService {
  private config: OllamaConfig
  private abortController: AbortController | null = null
  private circuitBreakerState: 'closed' | 'open' | 'half-open' = 'closed'
  private failureCount = 0
  private lastFailureTime = 0
  private readonly circuitBreakerThreshold = 5
  private readonly circuitBreakerTimeout = 60000 // 1 minute

  constructor(config: OllamaConfig) {
    this.config = {
      retryAttempts: 3,
      retryDelay: 1000,
      timeout: 120000, // Increased to 2 minutes for slower models
      ...config,
    }
  }

  private async checkCircuitBreaker(): Promise<void> {
    if (this.circuitBreakerState === 'open') {
      const timeSinceLastFailure = Date.now() - this.lastFailureTime
      if (timeSinceLastFailure > this.circuitBreakerTimeout) {
        this.circuitBreakerState = 'half-open'
        this.failureCount = 0
      } else {
        throw new OllamaServiceError(
          'Service temporarily unavailable due to repeated failures',
          'connection'
        )
      }
    }
  }

  private handleSuccess(): void {
    this.failureCount = 0
    if (this.circuitBreakerState === 'half-open') {
      this.circuitBreakerState = 'closed'
    }
  }

  private handleFailure(): void {
    this.failureCount++
    this.lastFailureTime = Date.now()
    
    if (this.failureCount >= this.circuitBreakerThreshold) {
      this.circuitBreakerState = 'open'
    }
  }

  private async retryWithBackoff<T>(
    fn: () => Promise<T>,
    retries = this.config.retryAttempts!
  ): Promise<T> {
    try {
      return await fn()
    } catch (error) {
      if (retries === 0) throw error
      
      await new Promise(resolve => 
        setTimeout(resolve, this.config.retryDelay! * (this.config.retryAttempts! - retries + 1))
      )
      
      return this.retryWithBackoff(fn, retries - 1)
    }
  }

  async *streamChat(
    prompt: string,
    options?: Partial<GenerateRequest>
  ): AsyncGenerator<string, void, undefined> {
    await this.checkCircuitBreaker()

    this.abortController = new AbortController()
    const timeoutId = setTimeout(() => {
      this.abortController?.abort()
    }, this.config.timeout!)
    
    // Add a flag to track if we've received any response
    // let hasReceivedResponse = false

    try {
      const response = await this.retryWithBackoff(async () => {
        // Use direct URL instead of proxy in development
        const baseUrl = this.config.baseUrl.includes('localhost')
          ? this.config.baseUrl
          : this.config.baseUrl

        const requestBody = {
          model: this.config.model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          stream: true,
          ...options,
        }
        
        console.log('Ollama request:', `${baseUrl}/api/chat`, requestBody)
        
        const res = await fetch(`${baseUrl}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
          signal: this.abortController!.signal,
        })

        if (!res.ok) {
          throw new OllamaServiceError(
            `HTTP error! status: ${res.status}`,
            'connection',
            { status: res.status }
          )
        }

        return res
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new OllamaServiceError('No reader available', 'unknown')
      }

      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.trim()) continue

          try {
            const json = JSON.parse(line)
            // Handle chat endpoint response format
            if (json.message && json.message.content) {
              // hasReceivedResponse = true
              yield json.message.content
            }
          } catch (parseError) {
            console.error('Parse error:', parseError, 'Line:', line)
            // Continue processing other lines
          }
        }
      }

      // Process any remaining buffer
      if (buffer.trim()) {
        try {
          const json = JSON.parse(buffer)
          // Handle chat endpoint response format
          if (json.message && json.message.content) {
            // hasReceivedResponse = true
            yield json.message.content
          }
        } catch (parseError) {
          console.error('Final parse error:', parseError)
        }
      }
      
      // If we haven't received any response, it might be a slow model
      // if (!hasReceivedResponse) {
      //   console.warn('No response received from model - it might be initializing')
      // }

      this.handleSuccess()
    } catch (error) {
      this.handleFailure()
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new OllamaServiceError('Request timeout', 'timeout')
      } else if (error instanceof OllamaServiceError) {
        throw error
      } else if (error instanceof Error) {
        throw new OllamaServiceError(
          error.message,
          'unknown',
          error
        )
      } else {
        throw new OllamaServiceError(
          'Unknown error occurred',
          'unknown',
          error
        )
      }
    } finally {
      clearTimeout(timeoutId)
      this.abortController = null
    }
  }

  async getModels(): Promise<ModelsResponse> {
    await this.checkCircuitBreaker()

    try {
      const response = await this.retryWithBackoff(async () => {
        // Use direct URL for Ollama API
        const res = await fetch(`${this.config.baseUrl}/api/tags`, {
          signal: AbortSignal.timeout(this.config.timeout!),
        })

        if (!res.ok) {
          throw new OllamaServiceError(
            `HTTP error! status: ${res.status}`,
            'connection',
            { status: res.status }
          )
        }

        return res
      })

      const data = await response.json()
      this.handleSuccess()
      return data as ModelsResponse
    } catch (error) {
      this.handleFailure()
      
      if (error instanceof OllamaServiceError) {
        throw error
      } else if (error instanceof Error) {
        throw new OllamaServiceError(
          error.message,
          'connection',
          error
        )
      } else {
        throw new OllamaServiceError(
          'Failed to fetch models',
          'unknown',
          error
        )
      }
    }
  }

  async checkConnection(): Promise<boolean> {
    try {
      await this.getModels()
      return true
    } catch {
      return false
    }
  }

  cancelStream(): void {
    this.abortController?.abort()
  }

  updateConfig(config: Partial<OllamaConfig>): void {
    this.config = { ...this.config, ...config }
  }

  getConfig(): OllamaConfig {
    return { ...this.config }
  }

  resetCircuitBreaker(): void {
    this.circuitBreakerState = 'closed'
    this.failureCount = 0
    this.lastFailureTime = 0
  }
}

// Singleton instance
let instance: OllamaService | null = null

export const getOllamaService = (config?: OllamaConfig): OllamaService => {
  if (!instance && config) {
    instance = new OllamaService(config)
  } else if (!instance) {
    throw new Error('OllamaService must be initialized with config first')
  }
  return instance
}

export const initializeOllamaService = (config: OllamaConfig): OllamaService => {
  instance = new OllamaService(config)
  return instance
}