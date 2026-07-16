import type { TrainerWithTeam } from '../../types/trainer'
import './TrainerTeam.css'

interface TrainerTeamProps {
  trainer: TrainerWithTeam
  onRemovePokemon: (pokemonId: number) => void
}

const EMPTY_SLOTS = 6

// muestra los 6 slots del equipo, los que estan vacios dicen "Empty"
export function TrainerTeam({ trainer, onRemovePokemon }: TrainerTeamProps) {
  // creo un array de 6 elementos, si el trainer tiene menos pokemon los demas son undefined
  const slots = Array.from({ length: EMPTY_SLOTS }, (_, i) => trainer.team[i])

  return (
    <div className="trainer-team">
      <h3 className="trainer-team__title">
        {trainer.name}&apos;s Team ({trainer.team.length}/{EMPTY_SLOTS})
      </h3>
      <div className="trainer-team__grid">
        {slots.map((slot, i) =>
          slot ? (
            <div key={slot.pokemonId} className="team-slot team-slot--filled">
              <img
                src={slot.spriteUrl}
                alt={slot.pokemonName}
                className="team-slot__img"
                width={80}
                height={80}
              />
              <span className="team-slot__name">{slot.pokemonName}</span>
              <button
                type="button"
                className="team-slot__remove"
                onClick={() => onRemovePokemon(slot.pokemonId)}
                aria-label={`Remove ${slot.pokemonName} from team`}
              >
                Remove
              </button>
            </div>
          ) : (
            <div key={`empty-${i}`} className="team-slot team-slot--empty">
              <span className="team-slot__placeholder">Empty</span>
            </div>
          ),
        )}
      </div>
    </div>
  )
}
