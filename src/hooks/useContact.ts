import { useQuery } from '@tanstack/react-query'
import { getContacts } from '../services/contact.service'

export function useContact() {
  return useQuery({
    queryKey: ['contact'],
    queryFn: getContacts,
  })
}
