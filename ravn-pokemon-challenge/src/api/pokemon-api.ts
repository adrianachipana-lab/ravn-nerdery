// todas las funciones para llamar a la pokeapi, cada una hace un fetch y valida la respuesta
import type {
  PokemonListResponse,
  PokemonDetail,
  PokemonTypeListResponse,
  PokemonTypeDetailResponse,
  TypeDetailWithRelations,
} from '../types/pokemon'

const BASE_URL = 'https://pokeapi.co/api/v2'

// trae la lista paginada de pokemon, limit y offset controlan la pagina
export async function fetchPokemonList(
  limit: number,
  offset: number,
): Promise<PokemonListResponse> {
  const res = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`)
  if (!res.ok) throw new Error(`Failed to fetch pokemon list: ${res.status}`)
  return res.json() as Promise<PokemonListResponse>
}

// trae el detalle de un pokemon por id o nombre
export async function fetchPokemonDetail(
  idOrName: number | string,
): Promise<PokemonDetail> {
  const res = await fetch(`${BASE_URL}/pokemon/${idOrName}`)
  if (!res.ok) throw new Error(`Failed to fetch pokemon ${idOrName}: ${res.status}`)
  return res.json() as Promise<PokemonDetail>
}

// trae todos los tipos disponibles (fire, water, grass, etc)
export async function fetchPokemonTypes(): Promise<PokemonTypeListResponse> {
  const res = await fetch(`${BASE_URL}/type`)
  if (!res.ok) throw new Error(`Failed to fetch types: ${res.status}`)
  return res.json() as Promise<PokemonTypeListResponse>
}

// trae los pokemon que pertenecen a un tipo especifico
export async function fetchPokemonByType(
  typeName: string,
): Promise<PokemonTypeDetailResponse> {
  const res = await fetch(`${BASE_URL}/type/${typeName}`)
  if (!res.ok) throw new Error(`Failed to fetch type ${typeName}: ${res.status}`)
  return res.json() as Promise<PokemonTypeDetailResponse>
}

// trae las relaciones de dano de un tipo (debilidades, resistencias, inmunidades)
export async function fetchTypeDetail(
  typeName: string,
): Promise<TypeDetailWithRelations> {
  const res = await fetch(`${BASE_URL}/type/${typeName}`)
  if (!res.ok) throw new Error(`Failed to fetch type detail ${typeName}: ${res.status}`)
  return res.json() as Promise<TypeDetailWithRelations>
}
