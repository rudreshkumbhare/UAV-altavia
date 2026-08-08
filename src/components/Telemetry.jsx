export function CoordTag({ label, value, className = '' }) {
  return (
    <div className={`mono-label text-[10px] text-paper-dim flex gap-2 ${className}`}>
      <span className="text-amber/70">{label}</span>
      <span>{value}</span>
    </div>
  )
}

export function SectionEyebrow({ index, label }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="mono-label text-xs text-amber">{index}</span>
      <span className="h-px w-8 bg-line" />
      <span className="mono-label text-xs text-paper-dim">{label}</span>
    </div>
  )
}
