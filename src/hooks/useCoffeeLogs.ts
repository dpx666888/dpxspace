import { useQuery } from '@tanstack/react-query'
import { getCoffeeLogs } from '../services/coffee.service'

export function useCoffeeLogs() {
  return useQuery({
    queryKey: ['coffeeLogs'],
    queryFn: getCoffeeLogs,
    select: (data) => [...data].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
