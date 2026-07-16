import { useQuery } from '@tanstack/react-query'
import { fetchPokemonTypes } from '../api/pokemon-api'
import { pokemonKeys } from '../api/query-keys'

export function usePokemonTypes() {
  return useQuery({
    queryKey: pokemonKeys.types(),
    queryFn: fetchPokemonTypes,
    staleTime: Infinity,
  })
}
