import { usePokemonDetail } from '../../hooks/use-pokemon-detail'
import { Badge, TYPE_COLORS } from '../ui/Badge'
import { Spinner } from '../ui/Spinner'
import './PokemonDetail.css'

interface PokemonDetailProps {
  id: string
  onAddToTeam?: (pokemon: { id: number; name: string; sprite: string }) => void
}

// pagina de detalle de un pokemon con stats, tipos y habilidades
export function PokemonDetail({ id, onAddToTeam }: PokemonDetailProps) {
  const { data, isLoading, isError, error } = usePokemonDetail(id)

  // manejo los 3 estados: cargando, error, sin data
  if (isLoading) return <Spinner />
  if (isError) return <p role="alert">Error: {error.message}</p>
  if (!data) return null

  const sprite =
    data.sprites.other?.['official-artwork']?.front_default ??
    data.sprites.front_default ??
    ''

  // uso el tipo principal para el color de fondo del hero
  const mainType = data.types[0]?.type.name ?? 'normal'
  const typeColor = TYPE_COLORS[mainType] ?? '#a8a878'
  // sumo todas las stats base para mostrar el total
  const totalStats = data.stats.reduce((sum, s) => sum + s.base_stat, 0)

  return (
    <div className="pokemon-detail">
      {/* Pokedex hero with type-colored background */}
      <div
        className="pokedex-hero"
        style={{ '--type-color': typeColor } as React.CSSProperties}
      >
        <div className="pokedex-hero__pokeball" />
        <div className="pokedex-hero__content">
          <div className="pokedex-hero__text">
            <span className="pokedex-hero__id">
              #{String(data.id).padStart(3, '0')}
            </span>
            <h2 className="pokedex-hero__name">{data.name}</h2>
            <div className="pokedex-hero__types">
              {data.types.map((t) => (
                <Badge key={t.type.name} typeName={t.type.name} />
              ))}
            </div>
            <div className="pokedex-hero__measures">
              <div className="pokedex-hero__measure">
                <span className="pokedex-hero__measure-value">{data.height / 10}m</span>
                <span className="pokedex-hero__measure-label">Height</span>
              </div>
              <div className="pokedex-hero__divider" />
              <div className="pokedex-hero__measure">
                <span className="pokedex-hero__measure-value">{data.weight / 10}kg</span>
                <span className="pokedex-hero__measure-label">Weight</span>
              </div>
            </div>
            {onAddToTeam && (
              <button
                type="button"
                className="pokedex-hero__add"
                onClick={() => onAddToTeam({ id: data.id, name: data.name, sprite })}
              >
                + Add to team
              </button>
            )}
          </div>
          <img
            className="pokedex-hero__img"
            src={sprite}
            alt={data.name}
            width={220}
            height={220}
          />
        </div>
      </div>

      {/* barras de stats con colores segun que tan alto es el valor */}
      <section className="pokemon-detail__stats">
        <div className="pokemon-detail__stats-header">
          <h3>Base Stats</h3>
          <span className="pokemon-detail__stats-total">Total: {totalStats}</span>
        </div>
        {data.stats.map((s) => (
          <div key={s.stat.name} className="stat-row">
            <span className="stat-row__name">{s.stat.name.replace('special-', 'sp. ')}</span>
            <span className="stat-row__value">{s.base_stat}</span>
            <div className="stat-row__bar">
              <div
                className="stat-row__fill"
                style={{
                  width: `${Math.min(s.base_stat / 255 * 100, 100)}%`,
                  background: s.base_stat >= 100 ? '#10b981' : s.base_stat >= 60 ? typeColor : '#ef4444',
                }}
              />
            </div>
          </div>
        ))}
      </section>

      {/* Abilities */}
      <section className="pokemon-detail__abilities">
        <h3>Abilities</h3>
        <ul>
          {data.abilities.map((a) => (
            <li key={a.ability.name}>
              {a.ability.name}
              {a.is_hidden && <span className="ability-hidden"> (hidden)</span>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
