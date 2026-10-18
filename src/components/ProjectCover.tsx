import { getCoverBackground } from '../lib/projectCover'

export const COVER_ASPECT = 'aspect-[16/9]'

interface ProjectCoverProps {
  slug: string
  title: string
  techStack?: string[]
  coverImage?: string | null
  index?: number
  aspect?: string
  className?: string
}

export default function ProjectCover({
  slug,
  title,
  techStack = [],
  coverImage,
  index = 0,
  aspect = COVER_ASPECT,
  className = '',
}: ProjectCoverProps) {
  return (
    <div className={`relative overflow-hidden ${aspect} ${className}`}>
      {coverImage ? (
        <img
          src={coverImage}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: getCoverBackground(slug) }}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-noise" />
          <span className="absolute bottom-2 right-4 select-none font-mono text-5xl font-bold tracking-tight text-white/10 md:text-6xl">
            {String(index + 1).padStart(2, '0')}
          </span>
          {techStack.length > 0 && (
            <div className="absolute bottom-3 left-4 flex max-w-[75%] flex-wrap gap-1.5">
              {techStack.slice(0, 3).map(tech => (
                <span
                  key={tech}
                  className="rounded-full bg-black/20 px-2 py-0.5 font-mono text-[10px] text-white/60 backdrop-blur-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>
      )}
    </div>
  )
}
