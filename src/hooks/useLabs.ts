import { useQuery } from '@tanstack/react-query'
import { getLabs } from '../services/labs.service'

export function useLabs() {
  return useQuery({
    queryKey: ['labs'],
    queryFn: getLabs,
  })
}
