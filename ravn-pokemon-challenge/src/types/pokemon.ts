export interface PokemonListItem {
  name: string
  url: string
}

export interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: PokemonListItem[]
}

export interface PokemonSprites {
  front_default: string | null
  other?: {
    'official-artwork'?: {
      front_default: string | null
    }
  }
}

export interface PokemonTypeSummary {
  slot: number
  type: { name: string; url: string }
}

export interface PokemonStat {
  base_stat: number
  stat: { name: string }
}

export interface PokemonAbility {
  ability: { name: string }
  is_hidden: boolean
}

export interface PokemonDetail {
  id: number
  name: string
  height: number
  weight: number
  sprites: PokemonSprites
  types: PokemonTypeSummary[]
  stats: PokemonStat[]
  abilities: PokemonAbility[]
}

export interface PokemonTypeEntry {
  name: string
  url: string
}

export interface PokemonTypeListResponse {
  results: PokemonTypeEntry[]
}

export interface PokemonTypeDetailResponse {
  pokemon: Array<{ pokemon: PokemonListItem }>
}

export interface TypeRelation {
  name: string
  url: string
}

export interface DamageRelations {
  double_damage_from: TypeRelation[]
  double_damage_to: TypeRelation[]
  half_damage_from: TypeRelation[]
  half_damage_to: TypeRelation[]
  no_damage_from: TypeRelation[]
  no_damage_to: TypeRelation[]
}

export interface TypeDetailWithRelations {
  name: string
  damage_relations: DamageRelations
  pokemon: Array<{ pokemon: PokemonListItem }>
}
