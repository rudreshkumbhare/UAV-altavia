import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Palette pulled directly from index.css tokens — kept as literal hex since
// Three.js materials can't read CSS custom properties. If the site palette
// changes, these lines are the only place that needs updating.
const PAPER = '#e8e6de'
const PAPER_SHADE = '#c7c4b8'
const PAPER_DIM = '#9a9890'
const AMBER = '#ff8c3d'
const LINE = '#2a2f38'
const DECAL_RED = '#c1372c' // matches the reference photo's livery, not the site accent

// Small canvas texture reading "TALON-X", standing in for the wing decal
// in the reference photo. Fully procedural, no external image asset.
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

// Tapered wing panel — straight leading edge, swept/tapered trailing edge,
// built as an extruded shape instead of a plain box so the silhouette
// actually reads as an aerofoil rather than a slab.
function useWingGeometry(mirror = false) {
  return useMemo(() => {
    const s = new THREE.Shape()
    const span = 1.28
    const rootChord = 0.4
    const tipChord = 0.16
    const sweep = 0.22
    const dir = mirror ? -1 : 1
    s.moveTo(0, rootChord / 2)
    s.lineTo(dir * span, sweep + tipChord / 2)
    s.lineTo(dir * span, sweep - tipChord / 2)
    s.lineTo(0, -rootChord / 2)
    s.closePath()
    const geo = new THREE.ExtrudeGeometry(s, { depth: 0.028, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 2, curveSegments: 1 })
    geo.rotateX(Math.PI / 2)
    geo.translate(0, -0.014, 0)
    return geo
  }, [mirror])
}

function Propeller() {
  const ref = useRef()
  useFrame((_, delta) => {
    ref.current.rotation.z += delta * 24
  })
  return (
    <group position={[0, 0, 0.63]}>
      <group ref={ref}>
        {[0, 90, 180, 270].map((deg) => (
          <mesh key={deg} rotation={[THREE.MathUtils.degToRad(8), 0, THREE.MathUtils.degToRad(deg)]}>
            <boxGeometry args={[0.032, 0.27, 0.012]} />
            <meshStandardMaterial color={LINE} roughness={0.4} />
          </mesh>
        ))}
        <mesh>
          <sphereGeometry args={[0.048, 12, 12]} />
          <meshStandardMaterial color={PAPER_DIM} roughness={0.25} metalness={0.4} />
        </mesh>
      </group>
      {/* spinner cone in front of the hub */}
      <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.05, 0.09, 12]} />
        <meshStandardMaterial color={PAPER_SHADE} roughness={0.3} metalness={0.35} />
      </mesh>
      {/* nacelle ring the prop sits in front of */}
      <mesh position={[0, 0, -0.03]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.1, 0.014, 10, 24]} />
        <meshStandardMaterial color={LINE} roughness={0.5} />
      </mesh>
    </group>
  )
}

function Wheel() {
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.038, 0.038, 0.02, 14]} />
        <meshStandardMaterial color="#15161a" roughness={0.6} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.014, 0.014, 0.022, 10]} />
        <meshStandardMaterial color={PAPER_DIM} roughness={0.3} metalness={0.5} />
      </mesh>
    </group>
  )
}

export default function TalonXModel() {
  const decal = useDecalTexture('TALON-X')
  const wingR = useWingGeometry(false)
  const wingL = useWingGeometry(true)

  return (
    <group scale={1.05} rotation={[0.06, 0.5, 0]}>
      {/* fuselage pod, slightly tapered nose-to-tail via non-uniform scale */}
      <mesh position={[0, 0, 0.12]} scale={[1, 0.92, 1]}>
        <capsuleGeometry args={[0.1, 0.58, 6, 16]} />
        <meshStandardMaterial color={PAPER} roughness={0.5} />
      </mesh>
      {/* canopy bump */}
      <mesh position={[0, 0.09, 0.22]} scale={[0.75, 0.5, 1]}>
        <sphereGeometry args={[0.075, 12, 10]} />
        <meshStandardMaterial color={PAPER_SHADE} roughness={0.3} metalness={0.15} />
      </mesh>
      {/* belly sensor turret */}
      <mesh position={[0, -0.12, 0.18]}>
        <sphereGeometry args={[0.045, 12, 10]} />
        <meshStandardMaterial color={LINE} roughness={0.35} metalness={0.3} />
      </mesh>
      {/* nose cone */}
      <mesh position={[0, 0, 0.47]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.095, 0.2, 14]} />
        <meshStandardMaterial color={PAPER} roughness={0.5} />
      </mesh>
      {/* fine antenna mast */}
      <mesh position={[0, 0.16, -0.05]}>
        <cylinderGeometry args={[0.004, 0.004, 0.14, 6]} />
        <meshStandardMaterial color={LINE} />
      </mesh>
      <Propeller />

      {/* tapered main wing, mirrored panels */}
      <mesh geometry={wingR} position={[0.09, 0.02, 0.08]}>
        <meshStandardMaterial color={PAPER} roughness={0.55} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={wingL} position={[-0.09, 0.02, 0.08]}>
        <meshStandardMaterial color={PAPER} roughness={0.55} side={THREE.DoubleSide} />
      </mesh>
      {/* wing root fairing */}
      <mesh position={[0, 0.02, 0.08]}>
        <boxGeometry args={[0.22, 0.05, 0.4]} />
        <meshStandardMaterial color={PAPER} roughness={0.55} />
      </mesh>
      {/* amber leading-edge trim, on-brand rather than a literal decal copy */}
      <mesh position={[0, 0.037, -0.04]}>
        <boxGeometry args={[2.5, 0.002, 0.03]} />
        <meshStandardMaterial color={AMBER} roughness={0.4} />
      </mesh>
      {/* winglets */}
      {[1.28, -1.28].map((x) => (
        <mesh key={`wl-${x}`} position={[x * 0.985, 0.13, 0.28]} rotation={[0, 0, x > 0 ? -0.12 : 0.12]}>
          <boxGeometry args={[0.02, 0.16, 0.1]} />
          <meshStandardMaterial color={PAPER} roughness={0.55} />
        </mesh>
      ))}

      {/* wing decals, mirrored left/right */}
      <mesh position={[0.72, 0.037, 0.11]} rotation={[-Math.PI / 2, 0, 0.06]}>
        <planeGeometry args={[0.48, 0.13]} />
        <meshBasicMaterial map={decal} transparent />
      </mesh>
      <mesh position={[-0.72, 0.037, 0.11]} rotation={[-Math.PI / 2, 0, Math.PI - 0.06]}>
        <planeGeometry args={[0.48, 0.13]} />
        <meshBasicMaterial map={decal} transparent />
      </mesh>

      {/* twin tail booms, slightly tapered via scale toward the rear */}
      {[0.55, -0.55].map((x) => (
        <mesh key={x} position={[x, 0, -0.55]} scale={[1, 1, 1]}>
          <boxGeometry args={[0.05, 0.085, 1.0]} />
          <meshStandardMaterial color={PAPER} roughness={0.6} />
        </mesh>
      ))}
      {/* thin amber stripe along each boom */}
      {[0.55, -0.55].map((x) => (
        <mesh key={`stripe-${x}`} position={[x, 0.043, -0.55]}>
          <boxGeometry args={[0.052, 0.003, 1.0]} />
          <meshStandardMaterial color={AMBER} roughness={0.4} />
        </mesh>
      ))}

      {/* horizontal stabilizer joining the booms */}
      <mesh position={[0, 0.05, -1.02]}>
        <boxGeometry args={[1.3, 0.028, 0.22]} />
        <meshStandardMaterial color={PAPER} roughness={0.6} />
      </mesh>

      {/* twin vertical fins with small rudder step */}
      {[0.55, -0.55].map((x) => (
        <group key={`fin-${x}`} position={[x, 0.2, -1.0]}>
          <mesh>
            <boxGeometry args={[0.028, 0.32, 0.2]} />
            <meshStandardMaterial color={PAPER} roughness={0.6} />
          </mesh>
          <mesh position={[0, -0.02, -0.11]}>
            <boxGeometry args={[0.03, 0.26, 0.02]} />
            <meshStandardMaterial color={PAPER_SHADE} roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* tricycle landing gear with proper wheels */}
      <group position={[0, -0.19, 0.32]}>
        <mesh>
          <cylinderGeometry args={[0.006, 0.006, 0.16, 8]} />
          <meshStandardMaterial color={LINE} />
        </mesh>
        <group position={[0, -0.08, 0]}>
          <Wheel />
        </group>
      </group>
      {[0.26, -0.26].map((x) => (
        <group key={`gear-${x}`} position={[x, -0.17, -0.02]}>
          <mesh rotation={[0, 0, x > 0 ? -0.15 : 0.15]}>
            <cylinderGeometry args={[0.007, 0.007, 0.14, 8]} />
            <meshStandardMaterial color={LINE} />
          </mesh>
          <group position={[0, -0.07, 0]}>
            <Wheel />
          </group>
        </group>
      ))}
    </group>
  )
}
