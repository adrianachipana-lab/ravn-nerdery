import { useState, useRef } from 'react'
import { usePokemonDetail } from '../../hooks/use-pokemon-detail'
import { Badge } from '../ui/Badge'
import './BattleCard.css'

interface BattleCardProps {
  name: string
  onClick: () => void
}

// card de batalla que muestra un tooltip con stats cuando haces hover
export function BattleCard({ name, onClick }: BattleCardProps) {
  const { data, isLoading } = usePokemonDetail(name)
  // el tooltip sigue al mouse, guardo la posicion con state
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [showTooltip, setShowTooltip] = useState(false)
  const cardRef = useRef<HTMLButtonElement>(null)

  // actualizo la posicion del tooltip con un offset para que no tape el cursor
  function handleMouseEnter(e: React.MouseEvent) {
    setTooltipPos({ x: e.clientX + 12, y: e.clientY - 80 })
    setShowTooltip(true)
  }

  function handleMouseMove(e: React.MouseEvent) {
    setTooltipPos({ x: e.clientX + 12, y: e.clientY - 80 })
  }

  function handleMouseLeave() {
    setShowTooltip(false)
  }

  if (isLoading || !data) {
    return <div className="battle-card battle-card--loading" />
  }

  const sprite =
    data.sprites.other?.['official-artwork']?.front_default ??
    data.sprites.front_default ??
    ''

  // sumo todas las base stats para mostrar el total en el tooltip
  const totalStats = data.stats.reduce((s, st) => s + st.base_stat, 0)

  return (
    <button
      type="button"
      className="battle-card"
      onClick={onClick}
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={sprite}
        alt={data.name}
        className="battle-card__img"
        width={80}
        height={80}
        loading="lazy"
      />
      <span className="battle-card__name">{data.name}</span>
      <div className="battle-card__types">
        {data.types.map((t) => (
          <Badge key={t.type.name} typeName={t.type.name} />
        ))}
      </div>

      {showTooltip && (
        <div
          className="battle-card__tooltip"
          style={{
            top: tooltipPos.y,
            left: tooltipPos.x,
            display: 'block',
          }}
        >
          <div className="battle-card__tooltip-header">
            <strong>{data.name}</strong>
            <span>#{String(data.id).padStart(3, '0')}</span>
          </div>
          <div className="battle-card__tooltip-stats">
            {data.stats.map((s) => (
              <div key={s.stat.name} className="battle-card__tooltip-stat">
                <span>{s.stat.name.replace('special-', 'sp.').replace('attack', 'atk').replace('defense', 'def')}</span>
                <span>{s.base_stat}</span>
              </div>
            ))}
            <div className="battle-card__tooltip-stat battle-card__tooltip-stat--total">
              <span>Total</span>
              <span>{totalStats}</span>
            </div>
          </div>
        </div>
      )}
    </button>
  )
}
