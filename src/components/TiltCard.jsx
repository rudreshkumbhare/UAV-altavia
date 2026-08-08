import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

// Wraps card content with a subtle mouse-reactive 3D tilt and a soft
// spotlight glare that tracks the pointer. Falls back to a flat, static
// card automatically on touch devices (no pointermove there).
export default function TiltCard({ children, className = '', maxTilt = 7, glare = true }) {
  const ref = useRef(null)
  const [hovered, setHovered] = useState(false)

  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)
  const springX = useSpring(x, { stiffness: 220, damping: 22, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 220, damping: 22, mass: 0.4 })

  const rotateX = useTransform(springY, [0, 1], [maxTilt, -maxTilt])
  const rotateY = useTransform(springX, [0, 1], [-maxTilt, maxTilt])
  const glareBg = useTransform([springX, springY], ([gx, gy]) =>
    `radial-gradient(240px circle at ${gx * 100}% ${gy * 100}%, rgba(255,107,61,0.2), transparent 70%)`
  )

  function handleMove(e) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width)
    y.set((e.clientY - rect.top) / rect.height)
  }

  function handleLeave() {
    setHovered(false)
    x.set(0.5)
    y.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={`relative will-change-transform ${className}`}
    >
      {children}
      {glare && (
        <motion.div
          aria-hidden
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          className="pointer-events-none absolute inset-0"
          style={{ background: glareBg }}
        />
      )}
    </motion.div>
  )
}
