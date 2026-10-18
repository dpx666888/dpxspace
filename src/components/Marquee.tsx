interface MarqueeProps {
  items: string[]
  className?: string
}

export default function Marquee({ items, className = '' }: MarqueeProps) {
  if (items.length === 0) return null

  const repeatCount = items.length >= 6 ? 1 : Math.ceil(6 / items.length)
  const sequence = Array.from({ length: repeatCount }, () => items).flat()

  return (
    <div className={`marquee ${className}`}>
      <div className="marquee-track">
        {[0, 1].map(copy => (
          <div
            key={copy}
            className="flex shrink-0 items-center gap-3 pr-3"
            aria-hidden={copy === 1}
          >
            {sequence.map((item, index) => (
              <span
                key={`${copy}-${index}-${item}`}
                className="whitespace-nowrap rounded-full border border-border bg-bg-secondary px-4 py-2 text-sm text-text-primary"
              >
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
