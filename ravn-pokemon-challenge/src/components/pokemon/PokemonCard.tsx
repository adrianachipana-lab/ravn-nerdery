import { useId } from 'react'
import { usePokemonDetail } from '../../hooks/use-pokemon-detail'
import { Badge } from '../ui/Badge'
import { Spinner } from '../ui/Spinner'
import './PokemonCard.css'

interface PokemonCardProps {
  name: string
  onSelect: (name: string) => void
  onAddToTeam?: (pokemon: { id: number; name: string; sprite: string }) => void
}

// la card fetchea su propio detalle con el nombre, asi cada una se carga independiente
export function PokemonCard({ name, onSelect, onAddToTeam }: PokemonCardProps) {
  const { data, isLoading } = usePokemonDetail(name)
  // useId genera un id unico para accesibilidad (aria-labelledby)
  const labelId = useId()

  // mientras carga muestro un spinner en la card
  if (isLoading || !data) {
    return (
      <article className="pokemon-card pokemon-card--loading">
        <Spinner size={32} />
      </article>
    )
  }

  // intento usar el artwork oficial, si no hay uso el sprite normal
  const sprite =
    data.sprites.other?.['official-artwork']?.front_default ??
    data.sprites.front_default ??
    ''

  return (
    <article className="pokemon-card" aria-labelledby={labelId}>
      <button
        type="button"
        className="pokemon-card__link"
        onClick={() => onSelect(name)}
      >
        <img
          className="pokemon-card__img"
          src={sprite}
          alt={data.name}
          loading="lazy"
          width={120}
          height={120}
        />
        <h3 className="pokemon-card__name" id={labelId}>
          {data.name}
        </h3>
        {/* padStart para que el id siempre tenga 3 digitos: #001, #025, etc */}
        <span className="pokemon-card__id">#{String(data.id).padStart(3, '0')}</span>
      </button>

      <div className="pokemon-card__types">
        {data.types.map((t) => (
          <Badge key={t.type.name} typeName={t.type.name} />
        ))}
      </div>

      {/* el boton de agregar al equipo solo aparece si me pasan la prop */}
      {onAddToTeam && (
        <button
          type="button"
          className="pokemon-card__add"
          onClick={() =>
            onAddToTeam({ id: data.id, name: data.name, sprite })
          }
        >
          + Add to team
        </button>
      )}
    </article>
  )
}
