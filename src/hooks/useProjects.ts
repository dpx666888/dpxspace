import { useQuery } from '@tanstack/react-query'
import { getProjects, getProjectBySlug, getProjectTimeline } from '../services/projects.service'

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
    select: (data) => [...data].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    staleTime: 5 * 60 * 1000,
    retry: 1,
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
