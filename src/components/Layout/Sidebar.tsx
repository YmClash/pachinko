import { motion, AnimatePresence } from 'framer-motion'
import { Plus, MessageSquare, Trash2, Download, Upload } from 'lucide-react'
import { useStore } from '@/store'
import { NeonButton, GlowCard, AnimatedIcon } from '@/components/UI'
import { getStorageService } from '@/services/storage.service'

export const Sidebar: React.FC = () => {
  const {
    isSidebarOpen,
    conversations,
    activeConversationId,
    createConversation,
    deleteConversation,
    setActiveConversation,
  } = useStore()

  const handleExport = async () => {
    try {
      const storage = await getStorageService()
      const data = await storage.exportData()
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `pachinko-chat-export-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  const handleImport = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        const text = await file.text()
        const storage = await getStorageService()
        await storage.importData(text)
        window.location.reload() // Reload to refresh the data
      } catch (error) {
        console.error('Import failed:', error)
      }
    }
    input.click()
  }

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed left-0 top-16 bottom-0 w-72 bg-black/90 backdrop-blur-md border-r border-neon-purple/30 z-40 overflow-hidden"
        >
          <div className="p-4 h-full flex flex-col">
            {/* New conversation button */}
            <NeonButton
              onClick={() => createConversation()}
              color="green"
              variant="solid"
              fullWidth
              className="mb-4"
            >
              <Plus size={20} />
              New Conversation
            </NeonButton>

            {/* Conversations list */}
            <div className="flex-1 overflow-y-auto space-y-2 mb-4">
              {conversations.map((conversation) => (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <GlowCard
                    color={activeConversationId === conversation.id ? 'purple' : 'blue'}
                    intensity={activeConversationId === conversation.id ? 'medium' : 'low'}
                    animated={activeConversationId === conversation.id}
                    className="p-3 cursor-pointer group"
                    onClick={() => setActiveConversation(conversation.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <AnimatedIcon
                          Icon={MessageSquare}
                          color={activeConversationId === conversation.id ? 'purple' : 'blue'}
                          size={16}
                          animation="none"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-orbitron text-sm truncate">
                            {conversation.title}
                          </h3>
                          <p className="text-xs text-gray-400 truncate">
                            {conversation.messages.length} messages
                          </p>
                        </div>
                      </div>
                      <NeonButton
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteConversation(conversation.id)
                        }}
                        color="pink"
                        size="sm"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </NeonButton>
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </div>

            {/* Import/Export buttons */}
            <div className="space-y-2 border-t border-neon-purple/30 pt-4">
              <NeonButton
                onClick={handleExport}
                color="blue"
                variant="outline"
                size="sm"
                fullWidth
              >
                <Download size={16} />
                Export Conversations
              </NeonButton>
              <NeonButton
                onClick={handleImport}
                color="purple"
                variant="outline"
                size="sm"
                fullWidth
              >
                <Upload size={16} />
                Import Conversations
              </NeonButton>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}