/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OLLAMA_URL: string
  readonly VITE_DEFAULT_MODEL: string
  readonly VITE_ENABLE_SOUNDS: string
  readonly VITE_ENABLE_3D: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}