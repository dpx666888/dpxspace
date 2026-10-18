import { useRef } from 'react'
import useScrollProgress from '../hooks/useScrollProgress'

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useScrollProgress(({ progress }) => {
    if (barRef.current) {
      barRef.current.style.transform = `scaleX(${progress})`
    }
  })

  return (
    <div
      ref={barRef}
      data-scroll-progress="true"
      aria-hidden="true"
      className="pointer-events-none fixed left-0 right-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-accent via-accent-light to-accent-alt"
      style={{ transform: 'scaleX(0)' }}
    />
  )
}
