import {
  createElement,
  useEffect,
  useMemo,
  useRef,
} from 'react'

/* -------------------------------------------------------------------------- */
/*  Built-in presets                                                           */
/* -------------------------------------------------------------------------- */

export const gradientPresets = {
  sunrise: [
    { color: '#B6D3EF', position: 0 },
    { color: '#CAD1D7', position: 0.153 },
    { color: '#D7CFC8', position: 0.252 },
    { color: '#E1CDB9', position: 0.341 },
    { color: '#EAC6A5', position: 0.424 },
    { color: '#EDB185', position: 0.505 },
    { color: '#EF9B62', position: 0.586 },
    { color: '#F18F60', position: 0.669 },
    { color: '#F48D7A', position: 0.758 },
    { color: '#F78A94', position: 0.857 },
    { color: '#F888A0', position: 1 },
  ],
  bubble: [
    { color: '#F5EBD9', position: 0 },
    { color: '#F2D4DB', position: 0.31 },
    { color: '#EBBDDE', position: 0.5 },
    { color: '#CCBAE3', position: 0.65 },
    { color: '#8CBFF0', position: 0.82 },
    { color: '#78B0FF', position: 1 },
  ],
  peach: [
    { color: '#D9F5FA', position: 0 },
    { color: '#FCD9D6', position: 0.31 },
    { color: '#FCBAC9', position: 0.61 },
    { color: '#F0B3F5', position: 1 },
  ],
  tonic: [
    { color: '#E3EDF0', position: 0 },
    { color: '#E8EBB8', position: 0.27 },
    { color: '#F0DEA3', position: 0.43 },
    { color: '#E8B078', position: 0.75 },
    { color: '#F29682', position: 1 },
  ],
  mint: [
    { color: '#DECEE8', position: 0 },
    { color: '#CBBAEE', position: 0.21 },
    { color: '#7DC0FB', position: 0.46 },
    { color: '#00C7A6', position: 1 },
  ],
  spring: [
    { color: '#F7D5C5', position: 0.07 },
    { color: '#46A8C0', position: 0.58 },
    { color: '#43AE7D', position: 1 },
  ],
  twilight: [
    { color: '#E3CCE6', position: 0 },
    { color: '#4E8CD5', position: 0.35 },
    { color: '#6068C2', position: 0.64 },
    { color: '#38364E', position: 1 },
  ],
  bay: [
    { color: '#DBE3D0', position: 0 },
    { color: '#8DB8A7', position: 0.23 },
    { color: '#2D8E9A', position: 0.42 },
    { color: '#076492', position: 0.59 },
    { color: '#154288', position: 0.79 },
    { color: '#262C81', position: 1 },
  ],
  amberHud: [
    { color: '#e8e6de', position: 0 },
    { color: '#ffffff', position: 0.3 },
    { color: '#ff8c3d', position: 0.5 },
    { color: '#ffffff', position: 0.7 },
    { color: '#e8e6de', position: 1 },
  ],
}

export const easingPresets = {
  smooth: 'cubic-bezier(0.45, 0, 0.55, 1)',
  gentle: 'cubic-bezier(0.76, 0, 0.24, 1)',
  snappy: 'cubic-bezier(0.3, 0, 0.2, 1)',
}

const BAND_CORE_RATIO = 0.44

export function buildBandGradient(stops, angle) {
  const sorted = [...stops].sort((a, b) => a.position - b.position)
  const first = sorted[0]?.color ?? 'white'
  const last = sorted[sorted.length - 1]?.color ?? 'white'

  const core = sorted
    .map((stop) => {
      const factor = (stop.position - 0.5) * 2 * BAND_CORE_RATIO
      return `${stop.color} calc(50% + var(--gs-spread-mid) * ${factor.toFixed(4)})`
    })
    .join(', ')

  return [
    `linear-gradient(${angle}deg`,
    `var(--gs-base) calc(50% - var(--gs-spread))`,
    `color-mix(in oklab, var(--gs-base) 42%, ${first}) calc(50% - var(--gs-spread-mid))`,
    core,
    `color-mix(in oklab, var(--gs-base) 42%, ${last}) calc(50% + var(--gs-spread-mid))`,
    `var(--gs-base) calc(50% + var(--gs-spread)))`,
  ].join(', ')
}

function supportsBackgroundClipText() {
  if (typeof window === 'undefined') return true
  if (typeof window.CSS?.supports !== 'function') return false
  return (
    window.CSS.supports('background-clip', 'text') ||
    window.CSS.supports('-webkit-background-clip', 'text')
  )
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

const VIEWPORT_ROOT_MARGIN = '160px'
const SCROLL_IDLE_MS = 120

function observeShimmerActive(el, { pauseOnScroll, pauseWhenOffscreen }, onChange) {
  if (typeof window === 'undefined') return () => {}

  let inViewport = !pauseWhenOffscreen || typeof IntersectionObserver === 'undefined'
  let pageVisible = typeof document === 'undefined' ? true : !document.hidden
  let notScrolling = true
  const compute = () => onChange(inViewport && pageVisible && notScrolling)

  let io
  if (pauseWhenOffscreen && typeof IntersectionObserver !== 'undefined') {
    io = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1]
        if (!entry) return
        inViewport = entry.isIntersecting
        compute()
      },
      { rootMargin: VIEWPORT_ROOT_MARGIN }
    )
    io.observe(el)
  }

  const onVisibility = () => {
    pageVisible = !document.hidden
    compute()
  }
  document.addEventListener('visibilitychange', onVisibility)

  let scrollTimer
  const onScroll = () => {
    notScrolling = false
    compute()
    clearTimeout(scrollTimer)
    scrollTimer = setTimeout(() => {
      notScrolling = true
      compute()
    }, SCROLL_IDLE_MS)
  }
  const scrollOpts = { passive: true, capture: true }
  if (pauseOnScroll) window.addEventListener('scroll', onScroll, scrollOpts)

  compute()

  return () => {
    io?.disconnect()
    document.removeEventListener('visibilitychange', onVisibility)
    if (pauseOnScroll) window.removeEventListener('scroll', onScroll, { capture: true })
    clearTimeout(scrollTimer)
  }
}

const FALLBACK_TEXT_WIDTH_PX = 96
const MAX_SPREAD_PX = 48
const SPREAD_MID_RATIO = 0.72
const BASE_FONT_PX = 14
const DEFAULT_DURATION_SECONDS = 1.45
const DEFAULT_SPREAD = 3
const DEFAULT_ANGLE = 105

function resolveStops(gradient) {
  if (!gradient) return gradientPresets.sunrise
  if (typeof gradient === 'string') return gradientPresets[gradient] ?? gradientPresets.sunrise
  return gradient
}

function finiteOr(value, fallback) {
  return Number.isFinite(value) ? value : fallback
}

function revealNormalText(el) {
  el.style.removeProperty('background-image')
  el.style.removeProperty('-webkit-text-fill-color')
}

export function GradientShimmer({
  children,
  gradient,
  easing = 'smooth',
  duration = DEFAULT_DURATION_SECONDS,
  spread = DEFAULT_SPREAD,
  angle = DEFAULT_ANGLE,
  pauseBetween = 1000,
  baseColor = 'currentColor',
  pauseOnScroll = true,
  pauseWhenOffscreen = true,
  respectReducedMotion = true,
  as = 'span',
  className,
  style,
  ...restProps
}) {
  const ref = useRef(null)
  const safeDuration = Math.max(0.001, finiteOr(duration, DEFAULT_DURATION_SECONDS))
  const safeSpread = Math.max(0, finiteOr(spread, DEFAULT_SPREAD))
  const safeAngle = finiteOr(angle, DEFAULT_ANGLE)
  const stops = useMemo(() => resolveStops(gradient), [gradient])
  const backgroundImage = useMemo(
    () => buildBandGradient(stops, safeAngle),
    [stops, safeAngle]
  )
  const easingValue = easingPresets[easing] ?? easingPresets.smooth

  const textLength = typeof children === 'string' ? children.length : 20
  const initialSpread = Math.min(textLength * safeSpread, MAX_SPREAD_PX)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const measure = () => {
      const textWidth = el.getBoundingClientRect().width || FALLBACK_TEXT_WIDTH_PX
      const fontSize = Number.parseFloat(getComputedStyle(el).fontSize) || BASE_FONT_PX
      const fontScale = fontSize / BASE_FONT_PX
      const spreadPx = Math.min(
        textLength * safeSpread * fontScale,
        MAX_SPREAD_PX * fontScale
      )
      const layerWidth = Math.max(1, textWidth + spreadPx * 2)
      const start = -spreadPx - layerWidth / 2
      const end = textWidth + spreadPx - layerWidth / 2
      const durationMs = safeDuration * 1000
      el.style.setProperty('--gs-spread', `${spreadPx}px`)
      el.style.setProperty('--gs-spread-mid', `${spreadPx * SPREAD_MID_RATIO}px`)
      el.style.backgroundSize = `${layerWidth}px 100%`
      return { start, end, durationMs }
    }

    if (!supportsBackgroundClipText()) {
      revealNormalText(el)
      return
    }

    measure()

    if (respectReducedMotion && prefersReducedMotion()) return
    if (typeof el.animate !== 'function') return

    let anim = null
    let pauseTimer
    let active = true
    let cancelled = false

    const runSweep = () => {
      if (cancelled) return
      const { start, end, durationMs } = measure()
      const next = el.animate(
        [
          { backgroundPosition: `${start}px center` },
          { backgroundPosition: `${end}px center` },
        ],
        { duration: durationMs, easing: easingValue, fill: 'forwards' }
      )
      if (!active) next.pause()
      anim?.cancel()
      anim = next
      next.onfinish = () => {
        pauseTimer = setTimeout(runSweep, Math.max(0, pauseBetween))
      }
    }

    const stopVisibility = observeShimmerActive(
      el,
      { pauseOnScroll, pauseWhenOffscreen },
      (next) => {
        active = next
        if (anim) {
          if (active) anim.play()
          else anim.pause()
        }
      }
    )

    runSweep()

    return () => {
      cancelled = true
      anim?.cancel()
      clearTimeout(pauseTimer)
      stopVisibility()
    }
  }, [
    children,
    textLength,
    safeSpread,
    safeDuration,
    easingValue,
    pauseBetween,
    pauseOnScroll,
    pauseWhenOffscreen,
    respectReducedMotion,
  ])

  const mergedStyle = {
    position: 'relative',
    display: 'inline-block',
    backgroundImage,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    backgroundColor: 'var(--gs-base)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    '--gs-base': baseColor,
    '--gs-spread': `${initialSpread}px`,
    '--gs-spread-mid': `${initialSpread * SPREAD_MID_RATIO}px`,
    ...style,
  }

  return createElement(
    as,
    { ...restProps, ref, className, style: mergedStyle },
    children
  )
}

export default GradientShimmer
