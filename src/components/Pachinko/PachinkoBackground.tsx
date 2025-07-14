import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/cannon'
import { Environment } from '@react-three/drei'
import { useEffect, useState, Suspense } from 'react'
import { Ball } from './Ball'
import { Peg } from './Peg'
import { ParticleSystem } from './ParticleSystem'
import { useStore } from '@/store'
import { useSound } from '@/hooks/useSound'

interface PachinkoBackgroundProps {
  intensity?: number
}

export const PachinkoBackground: React.FC<PachinkoBackgroundProps> = ({ intensity = 1 }) => {
  const [balls, setBalls] = useState<Array<{ id: string; position: [number, number, number]; color: string }>>([])
  const messageCount = useStore((state) => state.messageCount)
  const enable3D = useStore((state) => state.enable3D)
  const { play } = useSound()

  const neonColors = ['#ff006e', '#3a86ff', '#8338ec', '#06ffa5', '#ffbe0b']

  // Add new ball when message count increases
  useEffect(() => {
    if (messageCount > balls.length && enable3D) {
      const newBall = {
        id: `ball-${Date.now()}-${Math.random()}`,
        position: [(Math.random() - 0.5) * 8, 15, 0] as [number, number, number],
        color: neonColors[Math.floor(Math.random() * neonColors.length)]
      }
      setBalls(prev => [...prev, newBall].slice(-20)) // Keep max 20 balls
      play('message', { volume: 0.3 })
    }
  }, [messageCount, enable3D])

  // Generate peg positions
  const pegPositions: Array<[number, number, number]> = []
  for (let row = 0; row < 10; row++) {
    const numPegs = 6 - Math.floor(row / 3)
    for (let col = 0; col < numPegs; col++) {
      const x = (col - (numPegs - 1) / 2) * 2 + (row % 2) * 1
      const y = 8 - row * 1.5
      pegPositions.push([x, y, 0])
    }
  }

  // Remove balls that fall too far
  useEffect(() => {
    const interval = setInterval(() => {
      setBalls(prev => prev.filter(ball => ball.position[1] > -20))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!enable3D) return null

  return (
    <div className="fixed inset-0 -z-10" style={{ opacity: intensity }}>
      <Canvas
        camera={{ position: [0, 0, 20], fov: 60 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#ff006e" />
          <pointLight position={[-10, 10, 10]} intensity={1} color="#3a86ff" />
          <pointLight position={[0, -10, 10]} intensity={0.5} color="#8338ec" />
          
          {/* Environment for reflections */}
          <Environment preset="city" />

          {/* Physics world */}
          <Physics gravity={[0, -9.81, 0]} defaultContactMaterial={{ restitution: 0.6 }}>
            {/* Pegs */}
            {pegPositions.map((pos, i) => (
              <Peg key={i} position={pos} />
            ))}

            {/* Balls */}
            {balls.map((ball) => (
              <Ball
                key={ball.id}
                position={ball.position}
                color={ball.color}
                onCollision={() => {
                  // Trigger particle effect or other visual feedback
                }}
              />
            ))}

            {/* Invisible walls */}
            <mesh position={[-12, 0, 0]} rotation={[0, 0, Math.PI / 8]}>
              <planeGeometry args={[1, 40]} />
              <meshBasicMaterial visible={false} />
            </mesh>
            <mesh position={[12, 0, 0]} rotation={[0, 0, -Math.PI / 8]}>
              <planeGeometry args={[1, 40]} />
              <meshBasicMaterial visible={false} />
            </mesh>

            {/* Collection bins at bottom */}
            {[-6, -3, 0, 3, 6].map((x, i) => (
              <mesh key={i} position={[x, -12, 0]} rotation={[0, 0, 0]}>
                <boxGeometry args={[2, 0.5, 4]} />
                <meshStandardMaterial 
                  color={neonColors[i]} 
                  emissive={neonColors[i]}
                  emissiveIntensity={0.5}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            ))}
          </Physics>

          {/* Particle system */}
          <ParticleSystem count={500} />
        </Suspense>
      </Canvas>
    </div>
  )
}