import { useQuery } from '@tanstack/react-query'
import { getLogs, getLogsByCategory } from '../services/logs.service'

export function useLogs(category?: string) {
  return useQuery({
    queryKey: ['logs', category],
    queryFn: () => (category && category !== '全部' ? getLogsByCategory(category) : getLogs()),
  })
}
