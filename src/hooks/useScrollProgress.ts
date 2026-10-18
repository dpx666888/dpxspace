import { useEffect, useRef } from 'react'

interface ScrollState {
  scrollY: number
  progress: number
}

export default function useScrollProgress(onChange: (state: ScrollState) => void) {
  const callbackRef = useRef(onChange)
  callbackRef.current = onChange

  useEffect(() => {
    let frame: number | null = null

    const update = () => {
      frame = null
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      callbackRef.current({ scrollY: window.scrollY, progress })
    }

    const onScroll = () => {
      if (frame !== null) return
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [])
}
