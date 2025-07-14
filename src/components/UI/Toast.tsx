import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AnimatedIcon } from './AnimatedIcon'
import { NeonButton } from './NeonButton'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastMessage {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastProps {
  toast: ToastMessage
  onClose: (id: string) => void
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    color: 'green' as const,
    title: 'Success'
  },
  error: {
    icon: AlertCircle,
    color: 'pink' as const,
    title: 'Error'
  },
  info: {
    icon: Info,
    color: 'blue' as const,
    title: 'Info'
  }
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const config = toastConfig[toast.type]
  
  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => {
        onClose(toast.id)
      }, toast.duration)
      return () => clearTimeout(timer)
    }
  }, [toast.id, toast.duration, onClose])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      className={`
        relative min-w-[300px] max-w-md p-4 rounded-lg
        bg-black/90 backdrop-blur-md
        border-2 border-${config.color}/50
      `}
      style={{
        boxShadow: `0 0 20px var(--neon-${config.color})`
      }}
    >
      <div className="flex items-start gap-3">
        <AnimatedIcon
          Icon={config.icon}
          color={config.color}
          size={24}
          animation="pulse"
        />
        
        <div className="flex-1">
          <h3 className={`font-orbitron font-bold text-neon-${config.color}`}>
            {toast.title || config.title}
          </h3>
          {toast.message && (
            <p className="mt-1 text-sm text-gray-300">
              {toast.message}
            </p>
          )}
        </div>
        
        <NeonButton
          onClick={() => onClose(toast.id)}
          color={config.color}
          size="sm"
          variant="ghost"
          className="ml-2"
        >
          <X size={16} />
        </NeonButton>
      </div>
      
      {/* Progress bar for timed toasts */}
      {toast.duration && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-current"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: toast.duration / 1000, ease: 'linear' }}
        />
      )}
    </motion.div>
  )
}

interface ToastContainerProps {
  toasts: ToastMessage[]
  onClose: (id: string) => void
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      <AnimatePresence mode="sync">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Toast hook
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const showToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`
    const newToast: ToastMessage = {
      ...toast,
      id,
      duration: toast.duration ?? 5000
    }
    setToasts(prev => [...prev, newToast])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return {
    toasts,
    showToast,
    removeToast
  }
}