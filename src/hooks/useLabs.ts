import { useQuery } from '@tanstack/react-query'
import { getLabs } from '../services/labs.service'

export function useLabs() {
  return useQuery({
    queryKey: ['labs'],
    queryFn: getLabs,
    select: (data) => [...data].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
