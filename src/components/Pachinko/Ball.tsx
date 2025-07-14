import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useSphere } from '@react-three/cannon'
import { Mesh, Vector3 } from 'three'
import { useSound } from '@/hooks/useSound'

interface BallProps {
  position: [number, number, number]
  color?: string
  radius?: number
  onCollision?: () => void
}

export const Ball: React.FC<BallProps> = ({ 
  position, 
  color = '#ff006e',
  radius = 0.3,
  onCollision 
}) => {
  const meshRef = useRef<Mesh>(null)
  const { play } = useSound()
  const velocityRef = useRef(new Vector3())
  const lastCollisionTime = useRef(0)

  const [, api] = useSphere(() => ({
    mass: 1,
    position,
    args: [radius],
    material: {
      friction: 0.4,
      restitution: 0.8,
    },
    onCollide: () => {
      const now = Date.now()
      // Debounce collisions to avoid too many sounds
      if (now - lastCollisionTime.current > 100) {
        const impactVelocity = velocityRef.current.length()
        if (impactVelocity > 1) {
          play('ballDrop', { 
            volume: Math.min(impactVelocity / 10, 0.5),
            rate: 0.8 + Math.random() * 0.4 
          })
          onCollision?.()
        }
        lastCollisionTime.current = now
      }
    },
  }))

  // Subscribe to velocity changes
  useEffect(() => {
    const unsubscribe = api.velocity.subscribe((v) => {
      velocityRef.current.set(v[0], v[1], v[2])
    })
    return unsubscribe
  }, [api.velocity])

  // Add some visual effects
  useFrame((state) => {
    if (meshRef.current) {
      // Subtle rotation based on velocity
      meshRef.current.rotation.x += velocityRef.current.x * 0.01
      meshRef.current.rotation.y += velocityRef.current.y * 0.01
      
      // Pulsing glow effect
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1
      meshRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <mesh ref={meshRef as any} castShadow receiveShadow>
      <sphereGeometry args={[radius, 32, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
        envMapIntensity={1}
      />
      {/* Inner glow */}
      <mesh scale={[1.1, 1.1, 1.1]}>
        <sphereGeometry args={[radius, 32, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.1}
          depthWrite={false}
        />
      </mesh>
    </mesh>
  )
}