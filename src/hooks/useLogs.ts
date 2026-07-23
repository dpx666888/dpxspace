import { useQuery } from '@tanstack/react-query'
import { getLogs, getLogsByCategory } from '../services/logs.service'

export function useLogs(category?: string) {
  return useQuery({
    queryKey: ['logs', category],
    queryFn: () => (category && category !== '全部' ? getLogsByCategory(category) : getLogs()),
    select: (data) => [...data].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
