import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(false)
  const [variant, setVariant] = useState('default') // 'default' | 'hover' | 'drag'

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { damping: 28, stiffness: 320, mass: 0.4 })
  const ringY = useSpring(y, { damping: 28, stiffness: 320, mass: 0.4 })

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    if (!isFinePointer) return

    setEnabled(true)
    document.body.classList.add('custom-cursor-active')

    const onMove = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)

      const target = e.target.closest?.('a, button, input, textarea, [data-cursor]')
      if (!target) {
        setVariant('default')
        return
      }
      setVariant(target.getAttribute('data-cursor') || 'hover')
    }
    const onLeaveWindow = () => setVisible(false)

    window.addEventListener('pointermove', onMove)
    document.documentElement.addEventListener('mouseleave', onLeaveWindow)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeaveWindow)
      document.body.classList.remove('custom-cursor-active')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!enabled) return null

  const isHover = variant === 'hover'
  const isDrag = variant === 'drag'
  const active = isHover || isDrag
  const accent = isDrag ? '#3fb8af' : '#ff8c3d'

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none"
      style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        animate={{ width: active ? 52 : 30, height: active ? 52 : 30, borderColor: accent }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="relative rounded-full flex items-center justify-center"
        style={{ borderWidth: 1, borderStyle: 'solid' }}
      >
        <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-px h-1.5" style={{ background: accent, opacity: 0.7 }} />
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-px h-1.5" style={{ background: accent, opacity: 0.7 }} />
        <span className="absolute -left-1 top-1/2 -translate-y-1/2 h-px w-1.5" style={{ background: accent, opacity: 0.7 }} />
        <span className="absolute -right-1 top-1/2 -translate-y-1/2 h-px w-1.5" style={{ background: accent, opacity: 0.7 }} />

        <AnimatePresence>
          {isDrag && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mono-label text-[8px]"
              style={{ color: accent }}
            >
              DRAG
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.span
        animate={{ scale: active ? 0 : 1 }}
        transition={{ duration: 0.15 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-amber"
      />
    </motion.div>
  )
}
