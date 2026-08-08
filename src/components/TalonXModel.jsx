import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

// Simple, unmistakable airplane silhouette — fuselage, straight wings,
// horizontal stabilizer, single tail fin. Plain primitives, nothing fancy.
const PAPER = '#e8e6de'
const PAPER_SHADE = '#c7c4b8'
const AMBER = '#ff8c3d'
const LINE = '#2a2f38'

export default function TalonXModel() {
  const group = useRef()

  return (
    <group ref={group} scale={1.1} rotation={[0.1, 0.6, 0]}>
      {/* fuselage */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 1.4, 20]} />
        <meshStandardMaterial color={PAPER} roughness={0.5} />
      </mesh>
      {/* nose cone */}
      <mesh position={[0, 0, 0.7]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.09, 0.3, 20]} />
        <meshStandardMaterial color={PAPER_SHADE} roughness={0.4} />
      </mesh>
      {/* tail cone */}
      <mesh position={[0, 0, -0.7]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.09, 0.25, 20]} />
        <meshStandardMaterial color={PAPER} roughness={0.5} />
      </mesh>

      {/* main wing, straight through the fuselage */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[2.4, 0.04, 0.36]} />
        <meshStandardMaterial color={PAPER} roughness={0.55} />
      </mesh>
      {/* amber wing stripe */}
      <mesh position={[0, 0.023, 0.05]}>
        <boxGeometry args={[2.4, 0.002, 0.06]} />
        <meshStandardMaterial color={AMBER} roughness={0.4} />
      </mesh>

      {/* horizontal tail stabilizer */}
      <mesh position={[0, 0, -0.85]}>
        <boxGeometry args={[0.75, 0.03, 0.22]} />
        <meshStandardMaterial color={PAPER} roughness={0.55} />
      </mesh>

      {/* vertical tail fin */}
      <mesh position={[0, 0.18, -0.85]}>
        <boxGeometry args={[0.03, 0.36, 0.24]} />
        <meshStandardMaterial color={PAPER} roughness={0.55} />
      </mesh>

      {/* nav lights, small touch of life */}
      <mesh position={[1.19, 0, 0.05]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#3fb8af" emissive="#3fb8af" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[-1.19, 0, 0.05]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={0.6} />
      </mesh>
    </group>
  )
}
