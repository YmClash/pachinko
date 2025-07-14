import { useRef, useEffect, useCallback } from 'react'
import { Howl, Howler } from 'howler'
import { useStore } from '@/store'

type SoundName = 'ballDrop' | 'win' | 'message' | 'click' | 'error'

interface SoundConfig {
  src: string[]
  volume?: number
  loop?: boolean
  sprite?: Record<string, [number, number]>
}

const soundConfigs: Record<SoundName, SoundConfig> = {
  ballDrop: {
    src: ['/sounds/ball-drop.mp3'],
    volume: 0.3,
  },
  win: {
    src: ['/sounds/win.mp3'],
    volume: 0.5,
  },
  message: {
    src: ['/sounds/message.mp3'],
    volume: 0.4,
  },
  click: {
    src: ['/sounds/click.mp3'],
    volume: 0.2,
  },
  error: {
    src: ['/sounds/error.mp3'],
    volume: 0.3,
  },
}

export const useSound = () => {
  const enableSounds = useStore((state) => state.enableSounds)
  const soundsRef = useRef<Record<SoundName, Howl>>({} as Record<SoundName, Howl>)
  const loadedRef = useRef(false)

  // Initialize sounds
  useEffect(() => {
    if (!loadedRef.current && enableSounds) {
      Object.entries(soundConfigs).forEach(([name, config]) => {
        soundsRef.current[name as SoundName] = new Howl({
          ...config,
          preload: true,
          html5: true,
          onloaderror: (_, error) => {
            console.warn(`Failed to load sound ${name}:`, error)
          },
        })
      })
      loadedRef.current = true
    }

    // Update global volume based on enable state
    Howler.volume(enableSounds ? 1 : 0)

    return () => {
      // Don't unload sounds, keep them cached
      Howler.volume(1)
    }
  }, [enableSounds])

  const play = useCallback((name: SoundName, options?: { volume?: number; rate?: number }) => {
    if (!enableSounds || !soundsRef.current[name]) return

    try {
      const sound = soundsRef.current[name]
      
      if (options?.volume !== undefined) {
        sound.volume(options.volume)
      }
      
      if (options?.rate !== undefined) {
        sound.rate(options.rate)
      }
      
      sound.play()
    } catch (error) {
      console.warn(`Failed to play sound ${name}:`, error)
    }
  }, [enableSounds])

  const stop = useCallback((name: SoundName) => {
    if (soundsRef.current[name]) {
      soundsRef.current[name].stop()
    }
  }, [])

  const stopAll = useCallback(() => {
    Object.values(soundsRef.current).forEach(sound => sound.stop())
  }, [])

  const playSequence = useCallback(async (
    sounds: Array<{ name: SoundName; delay?: number; options?: { volume?: number; rate?: number } }>
  ) => {
    if (!enableSounds) return

    for (const { name, delay = 0, options } of sounds) {
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay))
      }
      play(name, options)
    }
  }, [enableSounds, play])

  const playRandomPitch = useCallback((name: SoundName, minRate = 0.8, maxRate = 1.2) => {
    const rate = Math.random() * (maxRate - minRate) + minRate
    play(name, { rate })
  }, [play])

  return {
    play,
    stop,
    stopAll,
    playSequence,
    playRandomPitch,
    isEnabled: enableSounds,
  }
}