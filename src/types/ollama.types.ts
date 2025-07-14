export interface OllamaConfig {
  baseUrl: string
  model: string
  retryAttempts?: number
  retryDelay?: number
  timeout?: number
}

export interface StreamResponse {
  model: string
  created_at: string
  response: string
  done: boolean
  context?: number[]
  total_duration?: number
  load_duration?: number
  prompt_eval_count?: number
  prompt_eval_duration?: number
  eval_count?: number
  eval_duration?: number
}

export interface GenerateRequest {
  model: string
  prompt: string
  stream?: boolean
  options?: ModelOptions
  system?: string
  template?: string
  context?: number[]
  raw?: boolean
}

export interface ModelOptions {
  num_keep?: number
  seed?: number
  num_predict?: number
  top_k?: number
  top_p?: number
  tfs_z?: number
  typical_p?: number
  repeat_last_n?: number
  temperature?: number
  repeat_penalty?: number
  presence_penalty?: number
  frequency_penalty?: number
  mirostat?: number
  mirostat_tau?: number
  mirostat_eta?: number
  penalize_newline?: boolean
  stop?: string[]
  numa?: boolean
  num_ctx?: number
  num_batch?: number
  num_gqa?: number
  num_gpu?: number
  main_gpu?: number
  low_vram?: boolean
  f16_kv?: boolean
  logits_all?: boolean
  vocab_only?: boolean
  use_mmap?: boolean
  use_mlock?: boolean
  embedding_only?: boolean
  rope_frequency_base?: number
  rope_frequency_scale?: number
  num_thread?: number
}

export interface Model {
  name: string
  modified_at: string
  size: number
  digest: string
  details: ModelDetails
}

export interface ModelDetails {
  format: string
  family: string
  families: string[]
  parameter_size: string
  quantization_level: string
}

export interface ModelsResponse {
  models: Model[]
}

export interface OllamaError {
  error: string
  type: 'connection' | 'timeout' | 'parse' | 'unknown'
  details?: unknown
}

export class OllamaServiceError extends Error {
  constructor(
    message: string,
    public type: OllamaError['type'],
    public details?: unknown
  ) {
    super(message)
    this.name = 'OllamaServiceError'
  }
}