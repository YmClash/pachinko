import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points } from 'three'
import * as THREE from 'three'

interface ParticleSystemProps {
  count?: number
  color?: string
  size?: number
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  count = 1000,
  color = '#ff006e',
  size = 0.05
}) => {
  const pointsRef = useRef<Points>(null)
  
  // Generate random positions for particles
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      // Position
      pos[i * 3] = (Math.random() - 0.5) * 20     // x
      pos[i * 3 + 1] = Math.random() * 20 - 5    // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5 // z
      
      // Velocity
      vel[i * 3] = (Math.random() - 0.5) * 0.02     // vx
      vel[i * 3 + 1] = -Math.random() * 0.05 - 0.02 // vy (falling)
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02 // vz
    }
    
    return [pos, vel]
  }, [count])

  // Animate particles
  useFrame((state) => {
    if (!pointsRef.current) return
    
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
    
    for (let i = 0; i < count; i++) {
      // Update position based on velocity
      positions[i * 3] += velocities[i * 3]
      positions[i * 3 + 1] += velocities[i * 3 + 1]
      positions[i * 3 + 2] += velocities[i * 3 + 2]
      
      // Reset particle if it falls below threshold
      if (positions[i * 3 + 1] < -10) {
        positions[i * 3] = (Math.random() - 0.5) * 20
        positions[i * 3 + 1] = 15
        positions[i * 3 + 2] = (Math.random() - 0.5) * 5
      }
      
      // Add some wiggle
      positions[i * 3] += Math.sin(state.clock.elapsedTime + i) * 0.001
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true
    
    // Rotate the entire system slowly
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}