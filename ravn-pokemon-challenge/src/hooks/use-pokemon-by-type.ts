import { useQuery } from '@tanstack/react-query'
import { fetchPokemonByType } from '../api/pokemon-api'
import { pokemonKeys } from '../api/query-keys'

// trae los pokemon filtrados por tipo, solo se activa si hay un tipo seleccionado
export function usePokemonByType(typeName: string) {
  return useQuery({
    queryKey: pokemonKeys.byType(typeName),
    queryFn: () => fetchPokemonByType(typeName),
    // no hago fetch si no hay tipo seleccionado
    enabled: typeName !== '',
    staleTime: Infinity,
    // la api devuelve una estructura rara, con select me quedo solo con los nombres
    select: (data) => data.pokemon.map((p) => p.pokemon),
  })
}
