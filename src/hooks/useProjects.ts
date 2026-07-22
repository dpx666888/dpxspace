import { useQuery } from '@tanstack/react-query'
import { getProjects, getProjectBySlug, getProjectTimeline } from '../services/projects.service'

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  })
}

export function useProject(slug: string | undefined) {
  return useQuery({
    queryKey: ['project', slug],
    queryFn: () => getProjectBySlug(slug!),
    enabled: !!slug,
  })
}

export function useProjectTimeline(projectId: number | undefined) {
  return useQuery({
    queryKey: ['project-timeline', projectId],
    queryFn: () => getProjectTimeline(projectId!),
    enabled: !!projectId,
  })
}
