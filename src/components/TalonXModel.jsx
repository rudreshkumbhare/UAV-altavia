import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Matches the actual reference photos: rounded nose pod with a payload
// hatch, straight (not swept) wide-chord wing, pusher prop mounted at the
// tail behind a V-tail (two angled fins, no separate horizontal
// stabilizer), small underwing light pods, simple nose skid.
const PAPER = '#e8e6de'
const PAPER_SHADE = '#c7c4b8'
const PAPER_DIM = '#9a9890'
const AMBER = '#ff8c3d'
const LINE = '#2a2f38'
const HATCH_TAN = '#b8935f'
const DECAL_RED = '#c1372c'

function useDecalTexture(text) {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 64
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.font = '700 38px Arial'
    ctx.fillStyle = DECAL_RED
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, canvas.width / 2, canvas.height / 2)
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }, [text])
}

// Straight, mildly tapered wing panel — near-zero sweep, matching the
// reference's broad, almost rectangular wing.
function useWingGeometry(mirror) {
  return useMemo(() => {
    const s = new THREE.Shape()
    const span = 1.5
    const rootChord = 0.42
    const tipChord = 0.28
    const sweep = 0.08
    const dir = mirror ? -1 : 1
    s.moveTo(0, rootChord / 2)
    s.lineTo(dir * span, sweep + tipChord / 2)
    s.lineTo(dir * span, sweep - tipChord / 2)
    s.lineTo(0, -rootChord / 2)
    s.closePath()
    const geo = new THREE.ExtrudeGeometry(s, {
      depth: 0.03,
      bevelEnabled: true,
      bevelThickness: 0.006,
      bevelSize: 0.006,
      bevelSegments: 2,
      curveSegments: 1,
    })
    geo.rotateX(Math.PI / 2)
    geo.translate(0, -0.015, 0)
    return geo
  }, [mirror])
}

// One V-tail panel — swept and angled outward, no separate horizontal
// stabilizer, matching the reference's two-panel tail.
function useVTailGeometry() {
  return useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, 0)
    s.lineTo(0.06, 0)
    s.lineTo(0.24, 0.32)
    s.lineTo(0.15, 0.33)
    s.closePath()
    return new THREE.ExtrudeGeometry(s, { depth: 0.02, bevelEnabled: false, curveSegments: 1 })
  }, [])
}

function Propeller() {
  const ref = useRef()
  useFrame((_, delta) => {
    ref.current.rotation.z += delta * 24
  })
  return (
    <group position={[0, 0, -0.86]}>
      <group ref={ref}>
        {[0, 90, 180, 270].map((deg) => (
          <mesh key={deg} rotation={[0, 0, THREE.MathUtils.degToRad(deg)]}>
            <boxGeometry args={[0.03, 0.24, 0.01]} />
            <meshStandardMaterial color={LINE} roughness={0.4} />
          </mesh>
        ))}
        <mesh>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color={PAPER_DIM} roughness={0.25} metalness={0.4} />
        </mesh>
      </group>
      {/* pusher nacelle cap behind the fuselage taper */}
      <mesh position={[0, 0, 0.08]}>
        <cylinderGeometry args={[0.07, 0.09, 0.14, 16]} />
        <meshStandardMaterial color={PAPER_SHADE} roughness={0.4} />
      </mesh>
    </group>
  )
}

export default function TalonXModel() {
  const decal = useDecalTexture('TALON-X')
  const wingR = useWingGeometry(false)
  const wingL = useWingGeometry(true)
  const vtail = useVTailGeometry()

  return (
    <group scale={1.1} rotation={[0.08, 0.55, 0]}>
      {/* fuselage — rounded nose pod tapering toward the tail nacelle */}
      <mesh position={[0, 0, 0.1]} scale={[0.9, 0.85, 1]}>
        <capsuleGeometry args={[0.11, 0.68, 6, 16]} />
        <meshStandardMaterial color={PAPER} roughness={0.5} />
      </mesh>
      {/* blunt rounded nose cap */}
      <mesh position={[0, 0, 0.53]} scale={[0.9, 0.85, 0.7]}>
        <sphereGeometry args={[0.11, 14, 12]} />
        <meshStandardMaterial color={PAPER_SHADE} roughness={0.4} />
      </mesh>

      {/* payload hatch on top of the nose pod */}
      <mesh position={[0, 0.09, 0.32]} rotation={[-0.25, 0, 0]}>
        <planeGeometry args={[0.12, 0.22]} />
        <meshStandardMaterial color={LINE} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.093, 0.32]} rotation={[-0.25, 0, 0]}>
        <planeGeometry args={[0.09, 0.17]} />
        <meshStandardMaterial color={HATCH_TAN} roughness={0.7} />
      </mesh>

      {/* straight wing, mounted mid-fuselage */}
      <mesh geometry={wingR} position={[0.1, 0.015, 0.06]}>
        <meshStandardMaterial color={PAPER} roughness={0.55} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={wingL} position={[-0.1, 0.015, 0.06]}>
        <meshStandardMaterial color={PAPER} roughness={0.55} side={THREE.DoubleSide} />
      </mesh>
      {/* wing root fairing */}
      <mesh position={[0, 0.015, 0.06]}>
        <boxGeometry args={[0.24, 0.05, 0.42]} />
        <meshStandardMaterial color={PAPER} roughness={0.55} />
      </mesh>
      {/* amber leading-edge trim */}
      <mesh position={[0, 0.033, 0.26]}>
        <boxGeometry args={[2.5, 0.002, 0.03]} />
        <meshStandardMaterial color={AMBER} roughness={0.4} />
      </mesh>

      {/* small underwing light pods, matching the dark ellipses in the
          head-on reference */}
      {[0.9, -0.9].map((x) => (
        <mesh key={`pod-${x}`} position={[x, -0.05, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
          <capsuleGeometry args={[0.018, 0.06, 4, 8]} />
          <meshStandardMaterial color={LINE} roughness={0.5} />
        </mesh>
      ))}

      {/* decals near the wing root, mirrored */}
      <mesh position={[0.42, 0.033, 0.1]} rotation={[-Math.PI / 2, 0, 0.08]}>
        <planeGeometry args={[0.46, 0.12]} />
        <meshBasicMaterial map={decal} transparent />
      </mesh>
      <mesh position={[-0.42, 0.033, 0.1]} rotation={[-Math.PI / 2, 0, Math.PI - 0.08]}>
        <planeGeometry args={[0.46, 0.12]} />
        <meshBasicMaterial map={decal} transparent />
      </mesh>

      {/* V-tail, two panels swept outward, no separate horizontal stabilizer */}
      <mesh geometry={vtail} position={[0.03, 0.02, -0.62]} rotation={[0, Math.PI / 2, -0.55]}>
        <meshStandardMaterial color={PAPER} roughness={0.55} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={vtail} position={[-0.03, 0.02, -0.62]} rotation={[0, Math.PI / 2, Math.PI + 0.55]}>
        <meshStandardMaterial color={PAPER} roughness={0.55} side={THREE.DoubleSide} />
      </mesh>

      {/* pusher prop at the tail */}
      <Propeller />

      {/* thin antenna */}
      <mesh position={[0, 0.14, 0.18]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.004, 0.004, 0.16, 6]} />
        <meshStandardMaterial color={LINE} />
      </mesh>

      {/* single nose wheel/skid */}
      <mesh position={[0, -0.17, 0.4]}>
        <cylinderGeometry args={[0.006, 0.006, 0.1, 8]} />
        <meshStandardMaterial color={LINE} />
      </mesh>
      <mesh position={[0, -0.21, 0.4]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.032, 0.032, 0.018, 14]} />
        <meshStandardMaterial color="#15161a" roughness={0.6} />
      </mesh>
    </group>
  )
}
