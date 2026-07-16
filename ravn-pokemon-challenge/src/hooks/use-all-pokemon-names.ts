import { useQuery } from '@tanstack/react-query'
import { fetchPokemonList } from '../api/pokemon-api'

// traigo todos los nombres de pokemon de una sola vez para el buscador
// staleTime Infinity porque la lista de pokemon no cambia, no necesito refetch
export function useAllPokemonNames() {
  return useQuery({
    queryKey: ['pokemon', 'all-names'],
    queryFn: () => fetchPokemonList(10000, 0),
    staleTime: Infinity,
    // select transforma la data antes de devolvermela, solo me quedo con results
    select: (data) => data.results,
  })
}
