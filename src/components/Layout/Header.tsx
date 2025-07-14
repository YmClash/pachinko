import { motion } from 'framer-motion'
import { Menu, Settings, Zap } from 'lucide-react'
import { useStore } from '@/store'
import { AnimatedIcon, NeonButton } from '@/components/UI'

export const Header: React.FC = () => {
  const { toggleSidebar, toggleSettings, isConnected } = useStore()

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-neon-purple/30"
      style={{
        boxShadow: '0 0 20px rgba(131, 56, 236, 0.3)',
      }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <NeonButton
            onClick={toggleSidebar}
            color="purple"
            size="sm"
            variant="ghost"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </NeonButton>

          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-orbitron font-bold neon-text neon-text-pink glitch-effect" data-text="PACHINKO">
              PACHINKO
            </h1>
            <span className="text-sm font-orbitron neon-text neon-text-blue">
              OLLAMA
            </span>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Connection status */}
          <div className="flex items-center gap-2">
            <AnimatedIcon
              Icon={Zap}
              color={isConnected ? 'green' : 'pink'}
              size={20}
              animation={isConnected ? 'pulse' : 'none'}
              glowIntensity={isConnected ? 'high' : 'low'}
            />
            <span className={`text-sm font-orbitron ${isConnected ? 'text-neon-green' : 'text-neon-pink'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          {/* Settings button */}
          <NeonButton
            onClick={toggleSettings}
            color="blue"
            size="sm"
            variant="outline"
            aria-label="Open settings"
          >
            <Settings size={20} />
          </NeonButton>
        </div>
      </div>

      {/* Animated border */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ width: '200%' }}
      />
    </motion.header>
  )
}