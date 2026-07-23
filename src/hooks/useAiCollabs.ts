import { useQuery } from '@tanstack/react-query'
import { getAiCollabs } from '../services/aiCollab.service'

export function useAiCollabs() {
  return useQuery({
    queryKey: ['aiCollabs'],
    queryFn: getAiCollabs,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
