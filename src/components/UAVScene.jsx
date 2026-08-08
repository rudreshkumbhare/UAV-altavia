import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

const AMBER = '#ff6b3d'
const CYAN = '#4fd6c4'
const PAPER = '#ece8df'

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

// --- Quadcopter geometry, built as flat 2D outlines given a little
// extruded depth, matched loosely against a real folding-arm consumer
// drone: tapered fuselage, front camera gimbal, four diagonal arms with
// motor housings and spinning twin-blade props. Kept in the same thin
// wireframe-over-faint-fill language as the rest of the HUD.

function buildBodyShape() {
  const s = new THREE.Shape()
  s.moveTo(0, 0.62) // nose tip
  s.lineTo(0.19, 0.4)
  s.lineTo(0.23, 0.08)
  s.lineTo(0.19, -0.24)
  s.lineTo(0.12, -0.46)
  s.lineTo(-0.12, -0.46)
  s.lineTo(-0.19, -0.24)
  s.lineTo(-0.23, 0.08)
  s.lineTo(-0.19, 0.4)
  s.closePath()
  return s
}

function buildGimbalShape() {
  const s = new THREE.Shape()
  s.moveTo(0, 0.09)
  s.lineTo(0.075, 0.02)
  s.lineTo(0.06, -0.09)
  s.lineTo(-0.06, -0.09)
  s.lineTo(-0.075, 0.02)
  s.closePath()
  return s
}

function buildArmShape(length) {
  const wNear = 0.09
  const wFar = 0.05
  const s = new THREE.Shape()
  s.moveTo(0, wNear / 2)
  s.lineTo(length * 0.82, wFar / 2)
  s.lineTo(length, wFar / 2)
  s.lineTo(length, -wFar / 2)
  s.lineTo(length * 0.82, -wFar / 2)
  s.lineTo(0, -wNear / 2)
  s.closePath()
  return s
}

function buildBladeShape() {
  const s = new THREE.Shape()
  s.moveTo(0.03, 0)
  s.quadraticCurveTo(0.2, 0.028, 0.4, 0)
  s.quadraticCurveTo(0.2, -0.028, 0.03, 0)
  s.closePath()
  return s
}

// front-right, front-left, back-left, back-right — a standard X layout
const ARMS = [
  { angle: 38, side: 1 },
  { angle: 142, side: -1 },
  { angle: 218, side: 1 },
  { angle: 322, side: -1 },
]
const ARM_LENGTH = 0.72

function edgesFrom(geometry, threshold = 15) {
  return new THREE.EdgesGeometry(geometry, threshold)
}

function Propeller({ spinDir, opacity }) {
  const ref = useRef()
  const bladeGeo = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(buildBladeShape(), { depth: 0.008, bevelEnabled: false, curveSegments: 6 })
    return geo
  }, [])
  const bladeEdges = useMemo(() => edgesFrom(bladeGeo, 12), [bladeGeo])

  useFrame((_, delta) => {
    ref.current.rotation.z += spinDir * delta * 4.2
  })

  return (
    <group ref={ref}>
      {[0, Math.PI].map((rot, i) => (
        <group key={i} rotation={[0, 0, rot]}>
          <mesh geometry={bladeGeo}>
            <meshBasicMaterial color={PAPER} transparent opacity={0.06} side={THREE.DoubleSide} />
          </mesh>
          <lineSegments geometry={bladeEdges}>
            <lineBasicMaterial color={PAPER} transparent opacity={opacity} />
          </lineSegments>
        </group>
      ))}
    </group>
  )
}

function Arm({ angle, side, index }) {
  const armGeo = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(buildArmShape(ARM_LENGTH), { depth: 0.03, bevelEnabled: false, curveSegments: 1 })
    return geo
  }, [])
  const armEdges = useMemo(() => edgesFrom(armGeo, 20), [armGeo])

  const motorGeo = useMemo(() => new THREE.CylinderGeometry(0.07, 0.075, 0.09, 12), [])
  const motorEdges = useMemo(() => edgesFrom(motorGeo, 25), [motorGeo])

  return (
    <group rotation={[0, 0, (angle * Math.PI) / 180]}>
      <mesh geometry={armGeo} position={[0, 0, 0.015]}>
        <meshBasicMaterial color={AMBER} transparent opacity={0.06} side={THREE.DoubleSide} />
      </mesh>
      <lineSegments geometry={armEdges} position={[0, 0, 0.015]}>
        <lineBasicMaterial color={AMBER} transparent opacity={0.75} />
      </lineSegments>

      <group position={[ARM_LENGTH, 0, 0.03]}>
        <mesh geometry={motorGeo} rotation={[Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color={AMBER} transparent opacity={0.1} side={THREE.DoubleSide} />
        </mesh>
        <lineSegments geometry={motorEdges} rotation={[Math.PI / 2, 0, 0]}>
          <lineBasicMaterial color={AMBER} transparent opacity={0.85} />
        </lineSegments>

        <mesh position={[0, 0, 0.05]}>
          <sphereGeometry args={[0.026, 8, 8]} />
          <meshBasicMaterial color={side > 0 ? CYAN : AMBER} />
        </mesh>

        <group position={[0, 0, 0.07]}>
          <Propeller spinDir={index % 2 === 0 ? 1 : -1} opacity={0.55} />
        </group>
      </group>
    </group>
  )
}

function UAVBody({ interaction }) {
  const group = useRef()
  const { pointer } = useThreeState()

  const bodyGeo = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(buildBodyShape(), { depth: 0.09, bevelEnabled: false, curveSegments: 1 })
    return geo
  }, [])
  const bodyEdges = useMemo(() => edgesFrom(bodyGeo, 20), [bodyGeo])

  const gimbalGeo = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(buildGimbalShape(), { depth: 0.05, bevelEnabled: false, curveSegments: 1 })
    return geo
  }, [])
  const gimbalEdges = useMemo(() => edgesFrom(gimbalGeo, 20), [gimbalGeo])

  useFrame((state, delta) => {
    const dragging = interaction?.current.dragging

    if (dragging) {
      group.current.rotation.y += interaction.current.deltaX
      group.current.rotation.x += interaction.current.deltaY
      interaction.current.deltaX = 0
      interaction.current.deltaY = 0
    } else {
      group.current.rotation.y += delta * 0.3
      const targetX = pointer.current.y * 0.2 + 0.35
      const targetZ = -pointer.current.x * 0.15
      group.current.rotation.x += (targetX - group.current.rotation.x) * 0.03
      group.current.rotation.z += (targetZ - group.current.rotation.z) * 0.03
    }

    group.current.rotation.x = THREE.MathUtils.clamp(group.current.rotation.x, -1.3, 1.4)
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.08
  })

  return (
    <group ref={group} scale={1.42} rotation={[0.35, 0, 0]}>
      <mesh geometry={bodyGeo}>
        <meshBasicMaterial color={AMBER} transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>
      <lineSegments geometry={bodyEdges}>
        <lineBasicMaterial color={AMBER} transparent opacity={0.95} />
      </lineSegments>

      {/* front camera gimbal, hanging just below/ahead of the nose */}
      <group position={[0, 0.42, -0.035]}>
        <mesh geometry={gimbalGeo}>
          <meshBasicMaterial color={CYAN} transparent opacity={0.12} side={THREE.DoubleSide} />
        </mesh>
        <lineSegments geometry={gimbalEdges}>
          <lineBasicMaterial color={CYAN} transparent opacity={0.9} />
        </lineSegments>
      </group>

      {/* center spine line for extra definition */}
      <Line points={[[0, 0.62, 0.045], [0, -0.46, 0.045]]} color={PAPER} transparent opacity={0.4} lineWidth={1} />

      {ARMS.map((a, i) => (
        <Arm key={i} angle={a.angle} side={a.side} index={i} />
      ))}
    </group>
  )
}

// tiny shared pointer state without extra deps
function useThreeState() {
  const pointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const setFromClient = (clientX, clientY) => {
      pointer.current.x = (clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (clientY / window.innerHeight) * 2 - 1
    }

    const onPointerMove = (e) => setFromClient(e.clientX, e.clientY)
    // touch devices don't fire pointermove while idle, so mirror it from touchmove
    const onTouchMove = (e) => {
      if (e.touches?.[0]) setFromClient(e.touches[0].clientX, e.touches[0].clientY)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  return { pointer }
}

export default function UAVScene() {
  // dragging is mouse/trackpad only — deliberately ignores touch pointers so this
  // never fights with page scroll on mobile, where the canvas sits full-bleed
  const interaction = useRef({ dragging: false, lastX: 0, lastY: 0, deltaX: 0, deltaY: 0 })

  useEffect(() => {
    const clearDrag = () => {
      interaction.current.dragging = false
    }
    window.addEventListener('pointerup', clearDrag)
    window.addEventListener('pointercancel', clearDrag)
    return () => {
      window.removeEventListener('pointerup', clearDrag)
      window.removeEventListener('pointercancel', clearDrag)
    }
  }, [])

  const handlePointerDown = (e) => {
    if (e.pointerType !== 'mouse') return
    interaction.current.dragging = true
    interaction.current.lastX = e.clientX
    interaction.current.lastY = e.clientY
    // keep receiving move events even if the cursor leaves the canvas mid-drag
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }

  const handlePointerMove = (e) => {
    if (!interaction.current.dragging) return
    const dx = e.clientX - interaction.current.lastX
    const dy = e.clientY - interaction.current.lastY
    interaction.current.lastX = e.clientX
    interaction.current.lastY = e.clientY
    interaction.current.deltaX += dx * 0.008
    interaction.current.deltaY += dy * 0.008
  }

  const handlePointerUp = (e) => {
    interaction.current.dragging = false
    e.currentTarget?.releasePointerCapture?.(e.pointerId)
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 4.2], fov: 40 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ position: 'absolute', inset: 0 }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <group>
        <AltimeterRing radius={1.75} speed={0.06} color={AMBER} segments={5} opacity={0.4} />
        <AltimeterRing radius={1.95} speed={-0.03} color={CYAN} segments={8} opacity={0.25} />
        <TickMarks radius={1.55} count={48} color={PAPER} />
        <UAVBody interaction={interaction} />
      </group>
    </Canvas>
  )
}
