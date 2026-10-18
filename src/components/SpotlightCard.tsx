import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
} from 'react'

export const CARD_SHELL =
  'group relative overflow-hidden rounded-xl border border-border bg-bg-secondary transition-all hover:-translate-y-1 hover:border-accent/50'

type SpotlightSize = 'sm' | 'md' | 'lg'

const SIZE_MAP: Record<SpotlightSize, string> = {
  sm: '240px',
  md: '360px',
  lg: '560px',
}

interface SpotlightCardProps {
  children: ReactNode
  className?: string
  size?: SpotlightSize
}

export default function SpotlightCard({ children, className = '', size = 'md' }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const frame = useRef<number | null>(null)
  const position = useRef({ x: 0, y: 0 })
  const [enabled, setEnabled] = useState(false)
  const [focusVisible, setFocusVisible] = useState(false)

  useEffect(() => {
    const query = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
    )
    const update = () => setEnabled(query.matches)
    update()
    query.addEventListener('change', update)
    return () => {
      query.removeEventListener('change', update)
      if (frame.current !== null) cancelAnimationFrame(frame.current)
    }
  }, [])

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!enabled) return
    position.current = { x: event.clientX, y: event.clientY }
    if (frame.current !== null) return
    frame.current = requestAnimationFrame(() => {
      frame.current = null
      const element = ref.current
      if (!element) return
      const rect = element.getBoundingClientRect()
      element.style.setProperty('--mx', `${position.current.x - rect.left}px`)
      element.style.setProperty('--my', `${position.current.y - rect.top}px`)
    })
  }

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setFocusVisible(false)
    }
  }

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      onFocusCapture={event => {
        if ((event.target as HTMLElement).matches(':focus-visible')) setFocusVisible(true)
      }}
      onBlurCapture={handleBlur}
      data-spotlight-card="true"
      className={`${CARD_SHELL} ${
        focusVisible ? 'ring-2 ring-accent/70 ring-offset-2 ring-offset-bg-primary' : ''
      } ${className}`}
      style={{ '--spotlight-size': SIZE_MAP[size] } as CSSProperties}
    >
      {enabled && (
        <>
          <div
            data-spotlight="glow"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                'radial-gradient(circle var(--spotlight-size) at var(--mx, 50%) var(--my, 50%), rgba(99, 102, 241, 0.14), transparent 65%)',
            }}
            aria-hidden="true"
          />
          <div
            data-spotlight="border"
            className={`pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300 ${
              focusVisible ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
            }`}
            style={{
              background:
                'radial-gradient(circle calc(var(--spotlight-size) * 0.7) at var(--mx, 50%) var(--my, 50%), rgba(129, 140, 248, 0.55), transparent 60%)',
              padding: '1px',
              WebkitMask:
                'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
            aria-hidden="true"
          />
        </>
      )}
      <div className="relative h-full">{children}</div>
    </div>
  )
}
