import { useQuery } from '@tanstack/react-query'
import { fetchPokemonDetail } from '../api/pokemon-api'
import { pokemonKeys } from '../api/query-keys'

// trae el detalle de un pokemon, enabled evita que se ejecute si no hay id
export function usePokemonDetail(id: number | string) {
  return useQuery({
    queryKey: pokemonKeys.detail(id),
    queryFn: () => fetchPokemonDetail(id),
    // si id es vacio o 0, no hace el fetch, asi evito llamadas innecesarias
    enabled: !!id,
  })
}
