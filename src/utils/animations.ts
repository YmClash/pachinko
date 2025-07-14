import { Variants } from 'framer-motion'

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
}

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3, ease: 'easeOut' }
  }
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

export const glitchAnimation = {
  animate: {
    textShadow: [
      '0 0 10px #ff006e',
      '2px 2px 10px #3a86ff',
      '-2px -2px 10px #8338ec',
      '0 0 10px #ff006e'
    ],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatDelay: 5
    }
  }
}

export const pulseNeon = {
  animate: {
    opacity: [0.5, 1, 0.5],
    scale: [0.98, 1.02, 0.98],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}

export const slideIn = (direction: 'left' | 'right' | 'up' | 'down') => {
  const initial = {
    left: { x: -100, opacity: 0 },
    right: { x: 100, opacity: 0 },
    up: { y: 100, opacity: 0 },
    down: { y: -100, opacity: 0 }
  }

  return {
    hidden: initial[direction],
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  }
}