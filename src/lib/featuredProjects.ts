import type { Project } from '../types/database'

const FEATURED_LIMIT = 3

export function getFeaturedProjects(projects: Project[], max = FEATURED_LIMIT): Project[] {
  const featured = projects.filter(project => project.featured)
  return (featured.length > 0 ? featured : projects).slice(0, max)
}
