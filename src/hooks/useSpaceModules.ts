import { useQuery } from '@tanstack/react-query'
import { getSpaceModules } from '../services/spaceModules.service'

export function useSpaceModules() {
  return useQuery({
    queryKey: ['spaceModules'],
    queryFn: getSpaceModules,
    select: (data) => [...data].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
