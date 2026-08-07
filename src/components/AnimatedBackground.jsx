import { useEffect, useRef } from 'react'

// Fixed, full-viewport canvas that sits behind all page content.
// Draws a slowly drifting grid, an occasional radar-style sweep, faint
// upward-drifting particles, and rare "contact" blips at grid intersections.
// Everything is intentionally subtle — this is atmosphere, not decoration
// that competes with foreground content.
export default function AnimatedBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const CELL = 52
    let width = 0
    let height = 0
    let dpr = 1
    let particles = []
    let blips = []
    let rafId = null
    const start = performance.now()

    function initParticles() {
      const count = Math.min(50, Math.floor((width * height) / 30000))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.3 + 0.4,
        speed: Math.random() * 0.14 + 0.03,
        drift: (Math.random() - 0.5) * 0.08,
        alpha: Math.random() * 0.3 + 0.08,
      }))

      const cols = Math.ceil(width / CELL) + 2
      const rows = Math.ceil(height / CELL) + 2
      blips = Array.from({ length: 6 }, () => ({
        col: Math.floor(Math.random() * cols),
        row: Math.floor(Math.random() * rows),
        phase: Math.random() * Math.PI * 2,
        speedMul: 0.4 + Math.random() * 0.6,
      }))
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      initParticles()
    }

    function drawSweep(t) {
      if (!ctx.createConicGradient) return
      const cx = width * 0.84
      const cy = height * 0.16
      const radius = Math.max(width, height) * 0.95
      const angle = (t * 0.00016) % (Math.PI * 2)
      const grad = ctx.createConicGradient(angle, cx, cy)
      grad.addColorStop(0, 'rgba(255,140,61,0.10)')
      grad.addColorStop(0.05, 'rgba(255,140,61,0.025)')
      grad.addColorStop(0.1, 'rgba(255,140,61,0)')
      grad.addColorStop(1, 'rgba(255,140,61,0)')
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.fillStyle = grad
      ctx.fill()
    }

    function drawGrid(t) {
      const offsetX = (t * 0.006) % CELL
      const offsetY = (t * 0.004) % CELL

      ctx.strokeStyle = 'rgba(232,230,222,0.05)'
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let x = -CELL + offsetX; x < width + CELL; x += CELL) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
      }
      for (let y = -CELL + offsetY; y < height + CELL; y += CELL) {
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
      }
      ctx.stroke()

      blips.forEach((b) => {
        const bx = b.col * CELL + offsetX - CELL
        const by = b.row * CELL + offsetY - CELL
        const pulse = (Math.sin(t * 0.0007 * b.speedMul + b.phase) + 1) / 2
        if (pulse < 0.6) return
        const a = (pulse - 0.6) / 0.4
        ctx.beginPath()
        ctx.arc(bx, by, 2.2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,140,61,${a * 0.55})`
        ctx.fill()
        ctx.beginPath()
        ctx.arc(bx, by, 5 + a * 5, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(255,140,61,${a * 0.25})`
        ctx.lineWidth = 1
        ctx.stroke()
      })
    }

    function drawParticles() {
      particles.forEach((p) => {
        p.y -= p.speed
        p.x += p.drift
        if (p.y < -10) {
          p.y = height + 10
          p.x = Math.random() * width
        }
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(232,230,222,${p.alpha})`
        ctx.fill()
      })
    }

    function frame(now) {
      const t = now - start
      ctx.clearRect(0, 0, width, height)
      drawSweep(t)
      drawGrid(t)
      drawParticles()
      rafId = requestAnimationFrame(frame)
    }

    resize()
    window.addEventListener('resize', resize)

    if (reduceMotion) {
      ctx.clearRect(0, 0, width, height)
      drawGrid(0)
    } else {
      rafId = requestAnimationFrame(frame)
    }

    return () => {
      window.removeEventListener('resize', resize)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  )
}
