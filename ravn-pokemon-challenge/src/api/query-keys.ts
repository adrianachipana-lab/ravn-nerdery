// factory de query keys para tanstack query
// asi todas las keys son consistentes y puedo invalidar por grupo si necesito
export const pokemonKeys = {
  all: ['pokemon'] as const,
  list: (limit: number, offset: number) =>
    [...pokemonKeys.all, 'list', { limit, offset }] as const,
  detail: (id: number | string) =>
    [...pokemonKeys.all, 'detail', id] as const,
  types: () => [...pokemonKeys.all, 'types'] as const,
  byType: (typeName: string) =>
    [...pokemonKeys.all, 'byType', typeName] as const,
}
