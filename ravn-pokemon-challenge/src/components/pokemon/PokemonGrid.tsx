import type { PokemonListItem } from '../../types/pokemon'
import { EmptyState } from '../ui/EmptyState'
import { PokemonCard } from './PokemonCard'
import './PokemonGrid.css'

interface PokemonGridProps {
  pokemon: PokemonListItem[]
  onSelect: (name: string) => void
  onAddToTeam?: (pokemon: { id: number; name: string; sprite: string }) => void
}

// grid que renderiza las cards de pokemon, si no hay ninguno muestra un empty state
export function PokemonGrid({ pokemon, onSelect, onAddToTeam }: PokemonGridProps) {
  if (pokemon.length === 0) {
    return <EmptyState message="No Pokemon found" />
  }

  return (
    <div className="pokemon-grid">
      {pokemon.map((p) => (
        <PokemonCard
          key={p.name}
          name={p.name}
          onSelect={onSelect}
          onAddToTeam={onAddToTeam}
        />
      ))}
    </div>
  )
}
