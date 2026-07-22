import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createLab, updateLab, deleteLab } from '../../services/labs.service'
import type { LabInput } from '../../types/database'

export function useCreateLab() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createLab,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['labs'] }),
  })
}

export function useUpdateLab() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, lab }: { id: number; lab: Partial<LabInput> }) => updateLab(id, lab),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['labs'] }),
  })
}

export function useDeleteLab() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteLab,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['labs'] }),
  })
}
