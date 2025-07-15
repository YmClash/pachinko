import { useEffect, useState } from 'react'
import './styles/neon-theme.css'
import './styles/animations.css'
import { Header, Sidebar, SettingsPanel } from '@/components/Layout'
import { ChatWindow } from '@/components/Chat'
/*import { PachinkoBackground } from '@/components/Pachinko'*/
import { SplashScreen } from '@/components/UI/SplashScreen'
import { ToastContainer, useToast } from '@/components/UI/Toast'
import { useStore } from '@/store'
import { initializeOllamaService } from '@/services/ollama.service'

function App() {
  const { loadFromStorage, isSidebarOpen, /*enable3D,*/ selectedModel } = useStore()
  const [isLoading, setIsLoading] = useState(true)
  const { toasts, showToast, removeToast } = useToast()

  // Initialize app
  useEffect(() => {
    const initApp = async () => {
      try {
        // Initialize Ollama service
        initializeOllamaService({
          baseUrl: import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434',
          model: selectedModel,
        })

        // Load data from storage
        await loadFromStorage()

        // Simulate loading time for splash screen
        setTimeout(() => {
          setIsLoading(false)
          showToast({
            type: 'success',
            title: 'Welcome to Pachinko Chat!',
            message: 'System initialized successfully',
            duration: 3000
          })
        }, 2000)
      } catch (error) {
        console.error('Failed to initialize app:', error)
        setIsLoading(false)
        showToast({
          type: 'error',
          title: 'Initialization Error',
          message: 'Failed to initialize some components',
          duration: 5000
        })
      }
    }

    initApp()
  }, [])

  return (
    <>
      <SplashScreen isLoading={isLoading} />
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Pachinko 3D Background */}
      {/* Temporarily disabled - enable3D && <PachinkoBackground intensity={0.7} /> */}

      {/* Main Layout */}
      <div className="relative z-10">
        <Header />
        <Sidebar />
        
        <main className={`transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-0'}`}>
          <ChatWindow />
        </main>

        <SettingsPanel />
      </div>

      {/* Background gradient overlay */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, rgba(255, 0, 110, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(58, 134, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 50% 100%, rgba(131, 56, 236, 0.1) 0%, transparent 50%)
          `,
          zIndex: 0,
        }}
      />
    </div>
    </>
  )
}

export default App