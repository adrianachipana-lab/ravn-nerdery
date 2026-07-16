import { useQueries } from '@tanstack/react-query'
import { fetchTypeDetail } from '../api/pokemon-api'

// useQueries porque un pokemon puede tener varios tipos, y necesito fetchear las relaciones de cada uno
export function useTypeMatchups(typeNames: string[]) {
  const results = useQueries({
    queries: typeNames.map((name) => ({
      queryKey: ['pokemon', 'type-detail', name],
      queryFn: () => fetchTypeDetail(name),
      staleTime: Infinity,
      enabled: typeNames.length > 0,
    })),
  })

  const isLoading = results.some((r) => r.isLoading)
  const isError = results.some((r) => r.isError)

  // uso Sets para que no se repitan los tipos cuando un pokemon tiene dos tipos
  const weakTo = new Set<string>()
  const resistantTo = new Set<string>()
  const immuneTo = new Set<string>()
  const strongAgainst = new Set<string>()

  // recorro los resultados de cada tipo y junto las relaciones de dano
  for (const result of results) {
    if (!result.data) continue
    const dr = result.data.damage_relations
    dr.double_damage_from.forEach((t) => weakTo.add(t.name))
    dr.half_damage_from.forEach((t) => resistantTo.add(t.name))
    dr.no_damage_from.forEach((t) => immuneTo.add(t.name))
    dr.double_damage_to.forEach((t) => strongAgainst.add(t.name))
  }

  // si sos inmune a un tipo, no puede ser debilidad, lo saco
  for (const immune of immuneTo) {
    weakTo.delete(immune)
  }

  return {
    isLoading,
    isError,
    weakTo: [...weakTo],
    resistantTo: [...resistantTo],
    immuneTo: [...immuneTo],
    strongAgainst: [...strongAgainst],
  }
}
