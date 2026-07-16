import { useState, useId } from 'react'
import { usePokemonTypes } from '../../hooks/use-pokemon-types'
import './PokemonSearchBar.css'

interface PokemonSearchBarProps {
  onSearchChange: (query: string) => void
  onTypeChange: (type: string) => void
  selectedType: string
}

export function PokemonSearchBar({
  onSearchChange,
  onTypeChange,
  selectedType,
}: PokemonSearchBarProps) {
  const [query, setQuery] = useState('')
  const { data: typesData } = usePokemonTypes()
  const searchId = useId()
  const typeId = useId()

  return (
    <div className="search-bar">
      <div className="search-bar__field">
        <label htmlFor={searchId} className="search-bar__label">
          Search Pokemon
        </label>
        <input
          id={searchId}
          className="search-bar__input"
          type="text"
          placeholder="e.g. pikachu, bulbasaur..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            onSearchChange(e.target.value)
          }}
        />
      </div>

      <div className="search-bar__field">
        <label htmlFor={typeId} className="search-bar__label">
          Filter by type
        </label>
        <select
          id={typeId}
          className="search-bar__select"
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
        >
          <option value="">All types</option>
          {typesData?.results.map((t) => (
            <option key={t.name} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
