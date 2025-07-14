import { useEffect, useRef, useState } from 'react'
import { useStore } from '@/store'

interface PachinkoAnimationOptions {
  ballCount?: number
  speed?: number
  colors?: string[]
}

interface Ball {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
}

export const usePachinkoAnimation = (options: PachinkoAnimationOptions = {}) => {
  const { ballCount = 50, speed = 1, colors = ['#ff006e', '#3a86ff', '#8338ec', '#06ffa5'] } = options
  
  const [balls, setBalls] = useState<Ball[]>([])
  const animationRef = useRef<number>()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const messageCount = useStore((state) => state.messageCount)
  const enable3D = useStore((state) => state.enable3D)
  
  // Add new ball when message count increases
  useEffect(() => {
    if (messageCount > balls.length && enable3D) {
      const newBall: Ball = {
        id: `ball-${Date.now()}`,
        x: Math.random() * (window.innerWidth - 50) + 25,
        y: -50,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 10,
      }
      setBalls(prev => [...prev, newBall].slice(-ballCount))
    }
  }, [messageCount, ballCount, colors, enable3D])
  
  // Animation loop
  useEffect(() => {
    if (!enable3D || !canvasRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      setBalls(prevBalls => {
        return prevBalls.map(ball => {
          // Update position
          let newX = ball.x + ball.vx * speed
          let newY = ball.y + ball.vy * speed
          let newVx = ball.vx
          let newVy = ball.vy + 0.1 // Gravity
          
          // Bounce off walls
          if (newX <= ball.size || newX >= canvas.width - ball.size) {
            newVx = -newVx * 0.8 // Energy loss
            newX = newX <= ball.size ? ball.size : canvas.width - ball.size
          }
          
          // Bounce off pegs (simplified)
          const pegSpacing = 80
          const pegRadius = 15
          for (let row = 0; row < 8; row++) {
            for (let col = 0; col < Math.floor(canvas.width / pegSpacing); col++) {
              const pegX = col * pegSpacing + (row % 2) * (pegSpacing / 2) + pegSpacing / 2
              const pegY = row * pegSpacing + 100
              
              const dist = Math.hypot(newX - pegX, newY - pegY)
              if (dist < ball.size + pegRadius) {
                // Simple bounce calculation
                const angle = Math.atan2(newY - pegY, newX - pegX)
                newVx = Math.cos(angle) * 2
                newVy = Math.sin(angle) * 2
              }
            }
          }
          
          // Draw ball with glow effect
          ctx.shadowBlur = 20
          ctx.shadowColor = ball.color
          ctx.fillStyle = ball.color
          ctx.beginPath()
          ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2)
          ctx.fill()
          
          // Remove balls that fall off screen
          if (newY > canvas.height + ball.size) {
            return null
          }
          
          return {
            ...ball,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
          }
        }).filter(Boolean) as Ball[]
      })
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    // Resize canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    
    animate()
    
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [enable3D, speed])
  
  const triggerBallDrop = (count: number = 1) => {
    const newBalls: Ball[] = []
    for (let i = 0; i < count; i++) {
      newBalls.push({
        id: `ball-${Date.now()}-${i}`,
        x: Math.random() * (window.innerWidth - 50) + 25,
        y: -50 - i * 20,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 10,
      })
    }
    setBalls(prev => [...prev, ...newBalls].slice(-ballCount))
  }
  
  const clearBalls = () => {
    setBalls([])
  }
  
  return {
    canvasRef,
    balls,
    triggerBallDrop,
    clearBalls,
  }
}