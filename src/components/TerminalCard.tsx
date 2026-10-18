import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { useReducedMotion } from 'framer-motion'

const SCRIPT = `$ whoami
dpx · 物联网应用技术
$ stack
React / TypeScript / C++ / 嵌入式
$ status
● 在读 · 中山`

const TYPE_DELAY = 30
const START_DELAY = 500

export default function TerminalCard() {
  const reduceMotion = useReducedMotion()
  const [text, setText] = useState(() => (reduceMotion ? SCRIPT : ''))
  const cardRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)
  const frame = useRef<number | null>(null)
  const position = useRef({ x: 0, y: 0 })
  const [tiltEnabled, setTiltEnabled] = useState(false)

  useEffect(() => {
    if (reduceMotion) {
      setText(SCRIPT)
      return
    }

    setText('')
    let index = 0
    let interval: number | undefined
    const startTimer = window.setTimeout(() => {
      interval = window.setInterval(() => {
        index += 1
        setText(SCRIPT.slice(0, index))
        if (index >= SCRIPT.length) {
          window.clearInterval(interval)
        }
      }, TYPE_DELAY)
    }, START_DELAY)

    return () => {
      window.clearTimeout(startTimer)
      if (interval) window.clearInterval(interval)
    }
  }, [reduceMotion])

  useEffect(() => {
    const query = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
    )
    const update = () => setTiltEnabled(query.matches)
    update()
    query.addEventListener('change', update)
    return () => {
      query.removeEventListener('change', update)
      if (frame.current !== null) cancelAnimationFrame(frame.current)
    }
  }, [])

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!tiltEnabled) return
    position.current = { x: event.clientX, y: event.clientY }
    if (frame.current !== null) return
    frame.current = requestAnimationFrame(() => {
      frame.current = null
      const card = cardRef.current
      if (!card) return
      const rect = card.getBoundingClientRect()
      const px = (position.current.x - rect.left) / rect.width
      const py = (position.current.y - rect.top) / rect.height
      const rotateY = (px - 0.5) * 12
      const rotateX = (0.5 - py) * 12
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
      if (glareRef.current) {
        glareRef.current.style.background = `radial-gradient(240px circle at ${px * 100}% ${py * 100}%, rgba(255, 255, 255, 0.08), transparent 65%)`
        glareRef.current.style.opacity = '1'
      }
    })
  }

  const handlePointerLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = ''
    if (glareRef.current) glareRef.current.style.opacity = '0'
  }

  const lines = text.split('\n')

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full max-w-[380px] select-none rounded-xl transition-transform duration-200 ease-out will-change-transform"
      aria-hidden="true"
    >
      <div className="overflow-hidden rounded-xl border border-border bg-[#0b0b12]/95 shadow-2xl shadow-black/50 backdrop-blur-md">
        <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
          <span className="ml-2 font-mono text-[10px] text-text-secondary">dpx@portfolio: ~</span>
        </div>
        <pre className="min-h-[210px] whitespace-pre-wrap p-5 font-mono text-xs leading-relaxed">
          {lines.map((line, index) => (
            <span
              key={index}
              className={
                line.startsWith('$')
                  ? 'text-accent'
                  : line.startsWith('●')
                    ? 'text-accent-alt'
                    : 'text-text-secondary'
              }
            >
              {line}
              {index < lines.length - 1 ? '\n' : ''}
            </span>
          ))}
          <span className="terminal-cursor ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 bg-accent align-middle" />
        </pre>
      </div>
      <div
        ref={glareRef}
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-200"
      />
    </div>
  )
}
