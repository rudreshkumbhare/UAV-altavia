import { useRef, useState, Suspense, lazy } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Box } from 'lucide-react'

const TalonXModel = lazy(() => import('./TalonXModel'))

// Craft ids that currently have a 3D model available. Everything else in
// Portfolio.jsx falls through to the "coming soon" panel below.
const MODELS_AVAILABLE = ['talon']

function RotatingRig({ rotationRef, isDraggingRef }) {
  const group = useRef()

  useFrame((_, delta) => {
    if (!isDraggingRef.current) {
      // slow idle spin when nobody's touching it
      rotationRef.current.y += delta * 0.18
    }
    // smooth toward the target rotation every frame — feels responsive
    // while dragging, but never snaps or jitters
    group.current.rotation.y += (rotationRef.current.y - group.current.rotation.y) * 0.2
    group.current.rotation.x += (rotationRef.current.x - group.current.rotation.x) * 0.2
  })

  return (
    <group ref={group}>
      <Suspense fallback={null}>
        <TalonXModel />
      </Suspense>
    </group>
  )
}

function ComingSoonPanel({ label }) {
  return (
    <div className="hud-frame h-full min-h-[260px] border border-line bg-graphite/60 flex flex-col items-center justify-center gap-4 text-center px-6">
      <Box className="w-7 h-7 text-paper-dim" strokeWidth={1.5} />
      <div>
        <div className="mono-label text-xs text-paper-dim mb-1">3D Model</div>
        <div className="mono-label text-[10px] text-amber">Coming Soon — {label}</div>
      </div>
    </div>
  )
}

export default function DroneViewport({ craftId, craftName }) {
  const rotationRef = useRef({ x: 0, y: 0.5 })
  const isDraggingRef = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false) // drives the data-cursor attribute
  const wrapperRef = useRef()

  if (!MODELS_AVAILABLE.includes(craftId)) {
    return <ComingSoonPanel label={craftName} />
  }

  const handlePointerDown = (e) => {
    isDraggingRef.current = true
    setDragging(true)
    lastPos.current = { x: e.clientX, y: e.clientY }
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
  }

  const handlePointerMove = (e) => {
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    lastPos.current = { x: e.clientX, y: e.clientY }
    rotationRef.current.y += dx * 0.008
    rotationRef.current.x = Math.max(
      -0.5,
      Math.min(0.5, rotationRef.current.x + dy * 0.008)
    )
  }

  const handlePointerUp = () => {
    isDraggingRef.current = false
    setDragging(false)
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', handlePointerUp)
  }

  return (
    <div
      ref={wrapperRef}
      onPointerDown={handlePointerDown}
      data-cursor={dragging ? 'drag' : 'hover'}
      className="hud-frame h-full min-h-[260px] border border-line bg-graphite/60 relative overflow-hidden touch-none select-none"
    >
      <div className="absolute top-3 left-4 z-10 mono-label text-[10px] text-paper-dim pointer-events-none">
        Drag to rotate
      </div>
      <Canvas
        camera={{ position: [0, 0.3, 3.4], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 4, 2]} intensity={1.1} color="#ff8c3d" />
        <directionalLight position={[-3, 1, -2]} intensity={0.5} color="#3fb8af" />
        <RotatingRig rotationRef={rotationRef} isDraggingRef={isDraggingRef} />
      </Canvas>
    </div>
  )
}
