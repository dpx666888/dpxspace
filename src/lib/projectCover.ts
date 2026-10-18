interface CoverPalette {
  base: string
  mid: string
  glowA: string
  glowB: string
}

const palettes: CoverPalette[] = [
  {
    base: '#1e1b4b',
    mid: '#312e81',
    glowA: 'rgba(99, 102, 241, 0.55)',
    glowB: 'rgba(34, 211, 238, 0.35)',
  },
  {
    base: '#2a1a4a',
    mid: '#4c1d95',
    glowA: 'rgba(167, 139, 250, 0.5)',
    glowB: 'rgba(45, 212, 191, 0.3)',
  },
  {
    base: '#0f172a',
    mid: '#1e3a8a',
    glowA: 'rgba(59, 130, 246, 0.45)',
    glowB: 'rgba(34, 211, 238, 0.3)',
  },
  {
    base: '#1e1b3a',
    mid: '#581c87',
    glowA: 'rgba(129, 140, 248, 0.5)',
    glowB: 'rgba(232, 121, 249, 0.28)',
  },
  {
    base: '#042f2e',
    mid: '#1e1b4b',
    glowA: 'rgba(45, 212, 191, 0.35)',
    glowB: 'rgba(99, 102, 241, 0.5)',
  },
  {
    base: '#0c1a3a',
    mid: '#312e81',
    glowA: 'rgba(56, 189, 248, 0.4)',
    glowB: 'rgba(139, 92, 246, 0.4)',
  },
]

function hashSlug(slug: string): number {
  let hash = 0
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0
  }
  return hash
}

export function getCoverBackground(slug: string): string {
  const palette = palettes[hashSlug(slug) % palettes.length]
  return [
    `radial-gradient(ellipse 80% 90% at 12% 8%, ${palette.glowA}, transparent 62%)`,
    `radial-gradient(ellipse 70% 80% at 88% 92%, ${palette.glowB}, transparent 65%)`,
    `linear-gradient(135deg, ${palette.base}, ${palette.mid})`,
  ].join(', ')
}
