import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createLog, updateLog, deleteLog } from '../../services/logs.service'
import type { LogInput } from '../../types/database'

export function useCreateLog() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createLog,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['logs'] }),
  })
}

export function useUpdateLog() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, log }: { id: number; log: Partial<LogInput> }) => updateLog(id, log),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['logs'] }),
  })
}

export function useDeleteLog() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteLog,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['logs'] }),
  })
}
