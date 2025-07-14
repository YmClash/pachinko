import { motion, AnimatePresence } from 'framer-motion'
import { X, Volume2, Sparkles, Moon } from 'lucide-react'
import { useStore } from '@/store'
import { NeonButton, GlowCard, AnimatedIcon } from '@/components/UI'

export const SettingsPanel: React.FC = () => {
  const {
    isSettingsOpen,
    toggleSettings,
    enableSounds,
    enable3D,
    selectedModel,
    availableModels,
    toggleSounds,
    toggle3D,
    setSelectedModel,
    clearAllData,
  } = useStore()

  return (
    <AnimatePresence>
      {isSettingsOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={toggleSettings}
          />

          {/* Settings panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <GlowCard color="purple" intensity="high" glass>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-orbitron font-bold neon-text neon-text-purple">
                  Settings
                </h2>
                <NeonButton
                  onClick={toggleSettings}
                  color="pink"
                  size="sm"
                  variant="ghost"
                >
                  <X size={20} />
                </NeonButton>
              </div>

              <div className="space-y-6">
                {/* Model selection */}
                <div>
                  <label className="block text-sm font-orbitron text-neon-blue mb-2">
                    AI Model
                  </label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full px-4 py-2 bg-black/50 border-2 border-neon-purple/50 rounded-lg font-orbitron text-white outline-none focus:border-neon-purple focus:shadow-neon-purple transition-all"
                    style={{
                      boxShadow: '0 0 10px rgba(131, 56, 236, 0.3)',
                    }}
                  >
                    {availableModels.length > 0 ? (
                      availableModels.map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))
                    ) : (
                      <option value={selectedModel}>{selectedModel}</option>
                    )}
                  </select>
                </div>

                {/* Sound toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AnimatedIcon
                      Icon={Volume2}
                      color="green"
                      size={24}
                      animation="pulse"
                    />
                    <span className="font-orbitron text-white">Sound Effects</span>
                  </div>
                  <NeonButton
                    onClick={toggleSounds}
                    color={enableSounds ? 'green' : 'pink'}
                    size="sm"
                    variant="outline"
                  >
                    {enableSounds ? 'ON' : 'OFF'}
                  </NeonButton>
                </div>

                {/* 3D effects toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AnimatedIcon
                      Icon={Sparkles}
                      color="blue"
                      size={24}
                      animation="rotate"
                    />
                    <span className="font-orbitron text-white">3D Effects</span>
                  </div>
                  <NeonButton
                    onClick={toggle3D}
                    color={enable3D ? 'blue' : 'pink'}
                    size="sm"
                    variant="outline"
                  >
                    {enable3D ? 'ON' : 'OFF'}
                  </NeonButton>
                </div>

                {/* Theme (placeholder for future) */}
                <div className="flex items-center justify-between opacity-50">
                  <div className="flex items-center gap-3">
                    <AnimatedIcon
                      Icon={Moon}
                      color="purple"
                      size={24}
                      animation="float"
                    />
                    <span className="font-orbitron text-white">Dark Theme</span>
                  </div>
                  <NeonButton
                    color="purple"
                    size="sm"
                    variant="outline"
                    disabled
                  >
                    ALWAYS ON
                  </NeonButton>
                </div>

                {/* Clear data */}
                <div className="pt-4 border-t border-neon-purple/30">
                  <NeonButton
                    onClick={() => {
                      if (confirm('Are you sure you want to clear all conversations?')) {
                        clearAllData()
                        toggleSettings()
                      }
                    }}
                    color="pink"
                    variant="outline"
                    fullWidth
                  >
                    Clear All Data
                  </NeonButton>
                </div>
              </div>
            </GlowCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}