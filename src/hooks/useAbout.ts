import { useQuery } from '@tanstack/react-query'
import { getAbout } from '../services/about.service'

export function useAbout() {
  return useQuery({
    queryKey: ['about'],
    queryFn: getAbout,
  })
}
