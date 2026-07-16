import { useQuery } from '@tanstack/react-query'
import { fetchPokemonList } from '../api/pokemon-api'
import { pokemonKeys } from '../api/query-keys'

// tanstack query se encarga del cache y loading states automaticamente
// solo paso la key y la funcion, y ya tengo data, isLoading, isError, etc
export function usePokemonList(limit: number, offset: number) {
  return useQuery({
    queryKey: pokemonKeys.list(limit, offset),
    queryFn: () => fetchPokemonList(limit, offset),
  })
}
