import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createProject, updateProject, deleteProject } from '../../services/projects.service'
import type { ProjectInput } from '../../types/database'

export function useCreateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useUpdateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, project }: { id: number; project: Partial<ProjectInput> }) => updateProject(id, project),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['projects'] })
      qc.invalidateQueries({ queryKey: ['project', String(vars.id)] })
    },
  })
}

export function useDeleteProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}
