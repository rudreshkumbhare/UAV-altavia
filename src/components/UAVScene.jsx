import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

const AMBER = '#ff8c3d'
const CYAN = '#3fb8af'
const PAPER = '#e8e6de'

function AltimeterRing({ radius, speed, color, segments = 4, opacity = 0.5 }) {
  const ref = useRef()
  useFrame((_, delta) => {
    ref.current.rotation.z += speed * delta
  })
  const points = useMemo(() => {
    const pts = []
    const gapCount = segments
    const arcLen = (Math.PI * 2) / gapCount
    for (let g = 0; g < gapCount; g++) {
      const start = g * arcLen
      const end = start + arcLen * 0.75
      for (let i = 0; i <= 24; i++) {
        const t = start + ((end - start) * i) / 24
        pts.push([Math.cos(t) * radius, Math.sin(t) * radius, 0])
      }
      pts.push([NaN, NaN, NaN])
    }
    return pts
  }, [radius, segments])

  // split into separate line segments at NaN breaks
  const segmentsArr = []
  let current = []
  points.forEach((p) => {
    if (Number.isNaN(p[0])) {
      if (current.length) segmentsArr.push(current)
      current = []
    } else {
      current.push(p)
    }
  })
  if (current.length) segmentsArr.push(current)

  return (
    <group ref={ref}>
      {segmentsArr.map((seg, i) => (
        <Line key={i} points={seg} color={color} transparent opacity={opacity} lineWidth={1} />
      ))}
    </group>
  )
}

function TickMarks({ radius, count, color }) {
  const marks = useMemo(() => {
    const arr = []
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const x1 = Math.cos(angle) * radius
      const y1 = Math.sin(angle) * radius
      const x2 = Math.cos(angle) * (radius - 0.08)
      const y2 = Math.sin(angle) * (radius - 0.08)
      arr.push([[x1, y1, 0], [x2, y2, 0]])
    }
    return arr
  }, [radius, count])

  return (
    <group>
      {marks.map((m, i) => (
        <Line key={i} points={m} color={color} transparent opacity={0.35} lineWidth={1} />
      ))}
    </group>
  )
}

// Flat delta-wing UAV silhouette, drawn as a 2D shape then given slight depth.
// Reads clearly as an aircraft outline from any angle instead of abstract boxes.
function buildDeltaShape() {
  const s = new THREE.Shape()
  s.moveTo(0, 1.1) // nose tip
  s.lineTo(0.16, 0.55)
  s.lineTo(0.95, -0.55) // right wingtip
  s.lineTo(0.62, -0.55)
  s.lineTo(0.5, -0.35)
  s.lineTo(0.16, -0.35)
  s.lineTo(0.16, -0.9) // right tail fin base
  s.lineTo(0.05, -0.55)
  s.lineTo(0, -0.62)
  s.lineTo(-0.05, -0.55)
  s.lineTo(-0.16, -0.9) // left tail fin base
  s.lineTo(-0.16, -0.35)
  s.lineTo(-0.5, -0.35)
  s.lineTo(-0.62, -0.55)
  s.lineTo(-0.95, -0.55) // left wingtip
  s.lineTo(-0.16, 0.55)
  s.closePath()
  return s
}

function UAVBody() {
  const group = useRef()
  const { pointer } = useThreeState()

  const geometry = useMemo(() => {
    const shape = buildDeltaShape()
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.05,
      bevelEnabled: false,
      curveSegments: 1,
    })
  }, [])

  const edges = useMemo(() => new THREE.EdgesGeometry(geometry, 20), [geometry])

  useFrame((state, delta) => {
    group.current.rotation.y += delta * 0.3
    const targetX = pointer.current.y * 0.2 + 0.35
    const targetZ = -pointer.current.x * 0.15
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.03
    group.current.rotation.z += (targetZ - group.current.rotation.z) * 0.03
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.08
  })

  return (
    <group ref={group} scale={1.15} rotation={[0.35, 0, 0]}>
      <mesh geometry={geometry}>
        <meshBasicMaterial color={AMBER} transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={AMBER} transparent opacity={0.95} />
      </lineSegments>
      {/* center spine line for extra definition */}
      <Line points={[[0, 1.1, 0.025], [0, -0.62, 0.025]]} color={PAPER} transparent opacity={0.5} lineWidth={1} />
      {/* small nav-light points at wingtips */}
      <mesh position={[0.95, -0.55, 0.025]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial color={CYAN} />
      </mesh>
      <mesh position={[-0.95, -0.55, 0.025]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial color={CYAN} />
      </mesh>
    </group>
  )
}

// tiny shared pointer state without extra deps
function useThreeState() {
  const pointer = useRef({ x: 0, y: 0 })
  useMemo(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('pointermove', (e) => {
        pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
        pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
      })
    }
  }, [])
  return { pointer }
}

export default function UAVScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.2], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <group>
        <AltimeterRing radius={1.9} speed={0.06} color={AMBER} segments={5} opacity={0.4} />
        <AltimeterRing radius={2.15} speed={-0.03} color={CYAN} segments={8} opacity={0.25} />
        <TickMarks radius={1.65} count={48} color={PAPER} />
        <UAVBody />
      </group>
    </Canvas>
  )
}
