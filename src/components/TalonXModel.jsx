import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Rebuilt to match the swept flying-wing CAD reference: single fuselage,
// one continuous swept wing (no twin booms), single rear-mounted vertical
// fin, no external prop, and a small payload hatch detail on the belly.
const PAPER = '#e8e6de'
const PAPER_SHADE = '#c7c4b8'
const PAPER_DIM = '#9a9890'
const AMBER = '#ff8c3d'
const LINE = '#2a2f38'
const HATCH_TAN = '#b8935f' // the payload/equipment glimpse visible through the belly hatch

function useDecalTexture(text) {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 64
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.font = '700 34px Arial'
    ctx.fillStyle = '#3a3a38'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, canvas.width / 2, canvas.height / 2)
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }, [text])
}

// Single continuous swept wing panel — straight-cut tip, swept leading
// edge, mild taper. Built as one mirrored pair from a shared shape so the
// sweep reads as one wing crossing the fuselage, not two separate stubs.
function useWingGeometry(mirror) {
  return useMemo(() => {
    const s = new THREE.Shape()
    const span = 1.55
    const rootChord = 0.34
    const tipChord = 0.2
    const sweep = 0.5
    const dir = mirror ? -1 : 1
    s.moveTo(0, rootChord / 2)
    s.lineTo(dir * span, sweep + tipChord / 2)
    s.lineTo(dir * span, sweep - tipChord / 2 + 0.02)
    s.lineTo(0, -rootChord / 2)
    s.closePath()
    const geo = new THREE.ExtrudeGeometry(s, {
      depth: 0.026,
      bevelEnabled: true,
      bevelThickness: 0.005,
      bevelSize: 0.005,
      bevelSegments: 2,
      curveSegments: 1,
    })
    geo.rotateX(Math.PI / 2)
    geo.translate(0, -0.013, 0)
    return geo
  }, [mirror])
}

// Single swept vertical fin at the tail, matching the reference's single
// fin (no twin-boom tail configuration here).
function useFinGeometry() {
  return useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, 0)
    s.lineTo(0.05, 0)
    s.lineTo(0.28, 0.34)
    s.lineTo(0.2, 0.36)
    s.closePath()
    const geo = new THREE.ExtrudeGeometry(s, { depth: 0.02, bevelEnabled: false, curveSegments: 1 })
    geo.translate(0, 0, -0.01)
    return geo
  }, [])
}

function NavLight({ position, color }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const pulse = Math.max(0, Math.sin(t * 2.4))
    ref.current.material.emissiveIntensity = 0.3 + pulse * 1.4
  })
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.018, 8, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
    </mesh>
  )
}

export default function TalonXModel() {
  const decal = useDecalTexture('TALON-X')
  const wingR = useWingGeometry(false)
  const wingL = useWingGeometry(true)
  const fin = useFinGeometry()

  return (
    <group scale={1.15} rotation={[0.08, 0.55, 0]}>
      {/* fuselage — elongated, blunt rounded nose, tapering toward the tail */}
      <mesh position={[0, 0, 0.05]} scale={[0.92, 0.85, 1]}>
        <capsuleGeometry args={[0.1, 0.72, 6, 16]} />
        <meshStandardMaterial color={PAPER} roughness={0.5} />
      </mesh>
      {/* blunt nose cap */}
      <mesh position={[0, 0, 0.44]} scale={[0.92, 0.85, 0.65]}>
        <sphereGeometry args={[0.1, 14, 12]} />
        <meshStandardMaterial color={PAPER_SHADE} roughness={0.4} />
      </mesh>

      {/* single continuous swept wing */}
      <mesh geometry={wingR} position={[0.09, 0.01, -0.02]}>
        <meshStandardMaterial color={PAPER} roughness={0.55} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={wingL} position={[-0.09, 0.01, -0.02]}>
        <meshStandardMaterial color={PAPER} roughness={0.55} side={THREE.DoubleSide} />
      </mesh>
      {/* wing root fairing where it crosses the fuselage */}
      <mesh position={[0, 0.01, -0.02]}>
        <boxGeometry args={[0.2, 0.045, 0.34]} />
        <meshStandardMaterial color={PAPER} roughness={0.55} />
      </mesh>
      {/* wing fold seam line, visible in the reference as a subtle panel split */}
      <mesh position={[0.42, 0.024, 0.16]} rotation={[0, 0.32, 0]}>
        <boxGeometry args={[0.5, 0.002, 0.006]} />
        <meshStandardMaterial color={LINE} />
      </mesh>
      <mesh position={[-0.42, 0.024, 0.16]} rotation={[0, -0.32, 0]}>
        <boxGeometry args={[0.5, 0.002, 0.006]} />
        <meshStandardMaterial color={LINE} />
      </mesh>
      {/* amber wingtip trim, on-brand rather than a literal decal copy */}
      {[1.55, -1.55].map((x) => (
        <mesh key={`tip-${x}`} position={[x * 0.985, 0.013, 0.44]}>
          <boxGeometry args={[0.03, 0.03, 0.16]} />
          <meshStandardMaterial color={AMBER} roughness={0.4} />
        </mesh>
      ))}

      {/* decal near the wing root, mirrored */}
      <mesh position={[0.34, 0.024, 0.02]} rotation={[-Math.PI / 2, 0, 0.5]}>
        <planeGeometry args={[0.34, 0.09]} />
        <meshBasicMaterial map={decal} transparent />
      </mesh>
      <mesh position={[-0.34, 0.024, 0.02]} rotation={[-Math.PI / 2, 0, Math.PI - 0.5]}>
        <planeGeometry args={[0.34, 0.09]} />
        <meshBasicMaterial map={decal} transparent />
      </mesh>

      {/* single swept tail fin, centerline mounted */}
      <mesh geometry={fin} position={[0, 0.06, -0.62]} rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial color={PAPER} roughness={0.55} side={THREE.DoubleSide} />
      </mesh>

      {/* belly payload hatch — recessed panel with an equipment glimpse,
          matching the open access bay in the reference */}
      <mesh position={[0, -0.095, 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.14, 0.32]} />
        <meshStandardMaterial color={LINE} roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.093, 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, 0.24]} />
        <meshStandardMaterial color={HATCH_TAN} roughness={0.7} />
      </mesh>
      {/* two thin internal rails visible through the hatch, echoing the
          reference's exposed rail structure */}
      {[0.03, -0.03].map((x) => (
        <mesh key={`rail-${x}`} position={[x, -0.091, 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.012, 0.26]} />
          <meshStandardMaterial color={PAPER_DIM} roughness={0.3} metalness={0.4} />
        </mesh>
      ))}

      {/* single tail skid, no external prop — matches the reference's clean underside */}
      <mesh position={[0, -0.14, -0.5]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.1, 6]} />
        <meshStandardMaterial color={LINE} />
      </mesh>
      <mesh position={[0, -0.185, -0.47]}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <meshStandardMaterial color={LINE} />
      </mesh>

      {/* small nav lights for a bit of life without altering the silhouette */}
      <NavLight position={[1.53, 0.015, 0.42]} color="#3fb8af" />
      <NavLight position={[-1.53, 0.015, 0.42]} color={AMBER} />
    </group>
  )
}
