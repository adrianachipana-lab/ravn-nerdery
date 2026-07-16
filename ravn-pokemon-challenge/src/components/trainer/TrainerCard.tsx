import type { TrainerWithTeam } from '../../types/trainer'
import './TrainerCard.css'

interface TrainerCardProps {
  trainer: TrainerWithTeam
  onSelect: (id: string) => void
  onRemove: (id: string) => void
}

export function TrainerCard({ trainer, onSelect, onRemove }: TrainerCardProps) {
  return (
    <article className="trainer-card">
      <button
        type="button"
        className="trainer-card__link"
        onClick={() => onSelect(trainer.id)}
      >
        <h3 className="trainer-card__name">{trainer.name}</h3>
        <p className="trainer-card__team-count">
          {trainer.team.length}/6 Pokemon
        </p>
        {trainer.team.length > 0 && (
          <div className="trainer-card__preview">
            {trainer.team.map((slot) => (
              <img
                key={slot.pokemonId}
                src={slot.spriteUrl}
                alt={slot.pokemonName}
                className="trainer-card__sprite"
                width={40}
                height={40}
              />
            ))}
          </div>
        )}
      </button>
      <button
        type="button"
        className="trainer-card__remove"
        onClick={() => onRemove(trainer.id)}
        aria-label={`Remove trainer ${trainer.name}`}
      >
        Delete
      </button>
    </article>
  )
}
