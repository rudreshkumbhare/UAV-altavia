import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Palette pulled directly from index.css tokens — kept as literal hex since
// Three.js materials can't read CSS custom properties. If the site palette
// changes, these three lines are the only place that needs updating.
const PAPER = '#e8e6de'
const PAPER_DIM = '#9a9890'
const AMBER = '#ff8c3d'
const LINE = '#2a2f38'
const DECAL_RED = '#c1372c' // matches the reference photo's livery, not the site accent

// Builds a small canvas texture reading "TALON-X" to stand in for the
// decal on the wing/fuselage in the reference photo. Fully procedural —
// no external image asset needed.
function useDecalTexture(text) {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 64
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.font = '700 40px Arial'
    ctx.fillStyle = DECAL_RED
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, canvas.width / 2, canvas.height / 2)
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }, [text])
}

function Propeller() {
  const ref = useRef()
  useFrame((_, delta) => {
    ref.current.rotation.z += delta * 22
  })
  return (
    <group ref={ref} position={[0, 0, 0.62]}>
      {[0, 90, 180, 270].map((deg) => (
        <mesh key={deg} rotation={[0, 0, THREE.MathUtils.degToRad(deg)]}>
          <boxGeometry args={[0.035, 0.26, 0.01]} />
          <meshStandardMaterial color={LINE} roughness={0.4} />
        </mesh>
      ))}
      <mesh>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color={PAPER_DIM} roughness={0.3} metalness={0.3} />
      </mesh>
    </group>
  )
}

export default function TalonXModel() {
  const decal = useDecalTexture('TALON-X')

  return (
    <group scale={1.05} rotation={[0.06, 0.5, 0]}>
      {/* fuselage pod */}
      <mesh position={[0, 0, 0.15]}>
        <capsuleGeometry args={[0.11, 0.62, 4, 12]} />
        <meshStandardMaterial color={PAPER} roughness={0.55} />
      </mesh>
      {/* nose cone */}
      <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.1, 0.22, 12]} />
        <meshStandardMaterial color={PAPER} roughness={0.5} />
      </mesh>
      <Propeller />

      {/* main wing */}
      <mesh position={[0, 0.02, 0.08]}>
        <boxGeometry args={[2.5, 0.035, 0.4]} />
        <meshStandardMaterial color={PAPER} roughness={0.6} />
      </mesh>
      {/* wing accent trim, on-brand amber rather than a literal decal copy */}
      <mesh position={[0, 0.039, 0.08]}>
        <boxGeometry args={[2.5, 0.002, 0.05]} />
        <meshStandardMaterial color={AMBER} roughness={0.4} />
      </mesh>

      {/* wing decals, mirrored left/right */}
      <mesh position={[0.75, 0.021, 0.08]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.5, 0.13]} />
        <meshBasicMaterial map={decal} transparent />
      </mesh>
      <mesh position={[-0.75, 0.021, 0.08]} rotation={[-Math.PI / 2, 0, Math.PI]}>
        <planeGeometry args={[0.5, 0.13]} />
        <meshBasicMaterial map={decal} transparent />
      </mesh>

      {/* twin tail booms */}
      {[0.55, -0.55].map((x) => (
        <mesh key={x} position={[x, 0, -0.55]}>
          <boxGeometry args={[0.055, 0.09, 1.0]} />
          <meshStandardMaterial color={PAPER} roughness={0.6} />
        </mesh>
      ))}

      {/* horizontal stabilizer joining the booms */}
      <mesh position={[0, 0.05, -1.02]}>
        <boxGeometry args={[1.3, 0.03, 0.24]} />
        <meshStandardMaterial color={PAPER} roughness={0.6} />
      </mesh>

      {/* twin vertical fins */}
      {[0.55, -0.55].map((x) => (
        <mesh key={`fin-${x}`} position={[x, 0.2, -1.0]}>
          <boxGeometry args={[0.03, 0.32, 0.22]} />
          <meshStandardMaterial color={PAPER} roughness={0.6} />
        </mesh>
      ))}

      {/* tricycle landing gear — small, mostly implied */}
      <mesh position={[0, -0.18, 0.35]}>
        <cylinderGeometry args={[0.005, 0.005, 0.14, 6]} />
        <meshStandardMaterial color={LINE} />
      </mesh>
      <mesh position={[0, -0.25, 0.35]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial color={LINE} />
      </mesh>
      {[0.28, -0.28].map((x) => (
        <group key={`gear-${x}`} position={[x, -0.16, -0.05]}>
          <mesh>
            <cylinderGeometry args={[0.005, 0.005, 0.12, 6]} />
            <meshStandardMaterial color={LINE} />
          </mesh>
          <mesh position={[0, -0.06, 0]}>
            <sphereGeometry args={[0.038, 8, 8]} />
            <meshStandardMaterial color={LINE} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
