import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useCylinder } from '@react-three/cannon'
import { Mesh } from 'three'

interface PegProps {
  position: [number, number, number]
  color?: string
  radius?: number
  height?: number
}

export const Peg: React.FC<PegProps> = ({ 
  position, 
  color = '#8338ec',
  radius = 0.3,
  height = 1
}) => {
  const meshRef = useRef<Mesh>(null)
  const glowRef = useRef<Mesh>(null)

  const [ref] = useCylinder(() => ({
    type: 'Static',
    position,
    args: [radius, radius, height, 16],
  }))

  // Animate glow effect
  useFrame((state) => {
    if (glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime + position[0] + position[1]) * 0.2 + 1
      glowRef.current.scale.set(pulse, 1, pulse)
    }
  })

  return (
    <group ref={ref as any}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, height, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* Glow effect */}
      <mesh ref={glowRef} scale={[1.3, 1, 1.3]}>
        <cylinderGeometry args={[radius, radius, height, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.2}
          depthWrite={false}
        />
      </mesh>

      {/* Top cap glow */}
      <mesh position={[0, height / 2, 0]}>
        <circleGeometry args={[radius * 1.5]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}