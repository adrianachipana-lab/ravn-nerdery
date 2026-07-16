import { useState, useId, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAllPokemonNames } from '../hooks/use-all-pokemon-names'
import { usePokemonDetail } from '../hooks/use-pokemon-detail'
import { useTypeMatchups } from '../hooks/use-type-matchups'
import { usePokemonByType } from '../hooks/use-pokemon-by-type'
import { useDebounce } from '../hooks/use-debounce'
import { Badge, TYPE_COLORS } from '../components/ui/Badge'
import { Spinner } from '../components/ui/Spinner'
import { BattleCard } from '../components/pokemon/BattleCard'
import './Pages.css'
import './MatchupPage.css'

// pagina de matchups: buscas un pokemon y te muestra debilidades, resistencias y counters
export function MatchupPage() {
  const [search, setSearch] = useState('')
  const [selectedPokemon, setSelectedPokemon] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debouncedSearch = useDebounce(search, 200)
  const searchId = useId()
  const navigate = useNavigate()

  const { data: allNames } = useAllPokemonNames()

  // muestro sugerencias solo si escribiste al menos 2 letras, maximo 8 resultados
  const suggestions = useMemo(() => {
    if (!allNames || debouncedSearch.length < 2) return []
    return allNames
      .filter((p) => p.name.includes(debouncedSearch.toLowerCase()))
      .slice(0, 8)
  }, [allNames, debouncedSearch])

  // fetcheo el detalle del pokemon seleccionado para sacar sus tipos
  const { data: pokemonData, isLoading: loadingPokemon } =
    usePokemonDetail(selectedPokemon)

  // con los tipos del pokemon, calculo las relaciones de dano (debilidades, etc)
  const typeNames = pokemonData?.types.map((t) => t.type.name) ?? []
  const matchups = useTypeMatchups(typeNames)

  // el usuario puede elegir contra que tipo ver counters, por default agarro la primera debilidad
  const [counterType, setCounterType] = useState('')
  const activeCounterType = counterType || matchups.weakTo[0] || ''
  const { data: counterPokemon, isLoading: loadingCounters } =
    usePokemonByType(activeCounterType)

  // solo muestro los primeros 8 counters para no saturar la pantalla
  const countersToShow = counterPokemon?.slice(0, 8) ?? []

  function handleSelect(name: string) {
    setSelectedPokemon(name)
    setSearch(name)
    setShowSuggestions(false)
    setCounterType('')
  }

  const sprite = pokemonData
    ? (pokemonData.sprites.other?.['official-artwork']?.front_default ??
       pokemonData.sprites.front_default ??
       '')
    : ''

  const mainType = pokemonData?.types[0]?.type.name ?? 'normal'
  const typeColor = TYPE_COLORS[mainType] ?? '#a8a878'

  return (
    <div className="page">
      <div className="browse-hero">
        <h2 className="browse-hero__title">Matchup Finder</h2>
        <p className="browse-hero__subtitle">
          Search a Pokemon to see its weaknesses and find the best counters
        </p>
      </div>

      {/* Search */}
      <div className="matchup-search">
        <label htmlFor={searchId} className="matchup-search__label">
          Choose your Pokemon
        </label>
        <div className="matchup-search__wrapper">
          <input
            id={searchId}
            className="matchup-search__input"
            type="text"
            placeholder="e.g. charizard, mewtwo..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setShowSuggestions(true)
              if (!e.target.value) setSelectedPokemon('')
            }}
            onFocus={() => setShowSuggestions(true)}
            autoComplete="off"
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="matchup-search__suggestions" role="listbox">
              {suggestions.map((p) => (
                <li key={p.name}>
                  <button
                    type="button"
                    className="matchup-search__suggestion"
                    role="option"
                    aria-selected={p.name === selectedPokemon}
                    onClick={() => handleSelect(p.name)}
                  >
                    {p.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {loadingPokemon && selectedPokemon && <Spinner />}

      {pokemonData && !matchups.isLoading && (
        <>
          {/* Battle Arena — right after search */}
          {activeCounterType && (
            <div className="battle-arena">
              <div className="battle-arena__type-picker">
                <span className="battle-arena__type-label">Weak to:</span>
                {matchups.weakTo.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`matchup-type-btn ${activeCounterType === t ? 'matchup-type-btn--active' : ''}`}
                    onClick={() => setCounterType(t)}
                  >
                    <Badge typeName={t} />
                  </button>
                ))}
              </div>

              <div
                className="battle-arena__field"
                style={{ '--type-color': typeColor } as React.CSSProperties}
              >
                {/* Your Pokemon - left side */}
                <div className="battle-arena__side battle-arena__side--yours">
                  <img
                    src={sprite}
                    alt={pokemonData.name}
                    className="battle-arena__sprite battle-arena__sprite--yours"
                    width={160}
                    height={160}
                  />
                  <div className="battle-arena__nameplate">
                    <span className="battle-arena__pokemon-name">{pokemonData.name}</span>
                    <div className="battle-arena__pokemon-types">
                      {pokemonData.types.map((t) => (
                        <Badge key={t.type.name} typeName={t.type.name} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* VS */}
                <div className="battle-arena__vs">VS</div>

                {/* Counters - right side */}
                <div className="battle-arena__side battle-arena__side--counters">
                  {loadingCounters ? (
                    <Spinner size={32} />
                  ) : (
                    <div className="battle-arena__counter-grid">
                      {countersToShow.map((p) => (
                        <BattleCard
                          key={p.name}
                          name={p.name}
                          onClick={() => navigate(`/pokemon/${p.name}`)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <p className="battle-arena__hint">
                Hover a counter to see stats. Click a type badge to switch.
              </p>
            </div>
          )}

          {/* Type relations grid — below the arena */}
          <div className="matchup-relations">
            <div className="matchup-section matchup-section--weak">
              <h4 className="matchup-section__title">Weak to (x2)</h4>
              <div className="matchup-section__types">
                {matchups.weakTo.length === 0 ? (
                  <span className="matchup-section__none">None</span>
                ) : (
                  matchups.weakTo.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`matchup-type-btn ${activeCounterType === t ? 'matchup-type-btn--active' : ''}`}
                      onClick={() => setCounterType(t)}
                    >
                      <Badge typeName={t} />
                    </button>
                  ))
                )}
              </div>
            </div>
            <div className="matchup-section matchup-section--resist">
              <h4 className="matchup-section__title">Resists (x0.5)</h4>
              <div className="matchup-section__types">
                {matchups.resistantTo.length === 0 ? (
                  <span className="matchup-section__none">None</span>
                ) : (
                  matchups.resistantTo.map((t) => (
                    <Badge key={t} typeName={t} />
                  ))
                )}
              </div>
            </div>
            {matchups.immuneTo.length > 0 && (
              <div className="matchup-section matchup-section--immune">
                <h4 className="matchup-section__title">Immune (x0)</h4>
                <div className="matchup-section__types">
                  {matchups.immuneTo.map((t) => (
                    <Badge key={t} typeName={t} />
                  ))}
                </div>
              </div>
            )}
            <div className="matchup-section matchup-section--strong">
              <h4 className="matchup-section__title">Strong vs (x2)</h4>
              <div className="matchup-section__types">
                {matchups.strongAgainst.length === 0 ? (
                  <span className="matchup-section__none">None</span>
                ) : (
                  matchups.strongAgainst.map((t) => (
                    <Badge key={t} typeName={t} />
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {pokemonData && matchups.isLoading && <Spinner />}
    </div>
  )
}
