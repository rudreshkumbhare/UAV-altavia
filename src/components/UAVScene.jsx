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

function UAVBody() {
  const group = useRef()
  const { pointer } = useThreeState()

  useFrame((state, delta) => {
    group.current.rotation.y += delta * 0.25
    // subtle mouse parallax tilt
    const targetX = pointer.current.y * 0.15
    const targetZ = -pointer.current.x * 0.15
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.03
    group.current.rotation.z += (targetZ - group.current.rotation.z) * 0.03
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.08
  })

  const edgeMat = { color: AMBER, transparent: true, opacity: 0.9 }
  const edgeMatDim = { color: PAPER, transparent: true, opacity: 0.35 }

  return (
    <group ref={group} scale={1.35}>
      {/* fuselage */}
      <mesh>
        <capsuleGeometry args={[0.14, 0.9, 4, 8]} />
        <meshBasicMaterial color={PAPER} wireframe transparent opacity={0.5} />
      </mesh>
      {/* main wing */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <boxGeometry args={[2.1, 0.03, 0.32]} />
        <meshBasicMaterial color={AMBER} wireframe transparent opacity={0.85} />
      </mesh>
      {/* tail wing */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.02, -0.62]}>
        <boxGeometry args={[0.7, 0.02, 0.16]} />
        <meshBasicMaterial color={CYAN} wireframe transparent opacity={0.8} />
      </mesh>
      {/* vertical stabilizer */}
      <mesh position={[0, 0.14, -0.62]}>
        <boxGeometry args={[0.02, 0.3, 0.18]} />
        <meshBasicMaterial color={CYAN} wireframe transparent opacity={0.8} />
      </mesh>
      {/* nose cone */}
      <mesh position={[0, 0, 0.55]}>
        <coneGeometry args={[0.13, 0.32, 8]} rotation={[Math.PI / 2, 0, 0]} />
        <meshBasicMaterial color={PAPER} wireframe transparent opacity={0.5} />
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
