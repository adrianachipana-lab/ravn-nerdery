import { useTrainers } from '../../context/trainers-context'
import type { TeamSlot } from '../../types/trainer'
import './AddToTeamModal.css'

interface AddToTeamModalProps {
  pokemon: { id: number; name: string; sprite: string }
  onClose: () => void
}

// modal que muestra la lista de trainers para elegir a cual equipo agregar el pokemon
export function AddToTeamModal({ pokemon, onClose }: AddToTeamModalProps) {
  const { state, addToTeam } = useTrainers()

  // creo el slot con la info del pokemon y lo agrego al equipo del trainer seleccionado
  function handleAdd(trainerId: string) {
    const slot: TeamSlot = {
      pokemonId: pokemon.id,
      pokemonName: pokemon.name,
      spriteUrl: pokemon.sprite,
    }
    addToTeam(trainerId, slot)
    onClose()
  }

  return (
    {/* click en el overlay cierra el modal, stopPropagation evita que cierre al clickear dentro */}
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-label={`Add ${pokemon.name} to a team`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__header">
          <h3 className="modal__title">
            Add <span className="modal__pokemon-name">{pokemon.name}</span> to team
          </h3>
          <button
            type="button"
            className="modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="modal__body">
          {state.trainers.length === 0 ? (
            <p className="modal__empty">
              No trainers yet. Create one in the Trainers page first.
            </p>
          ) : (
            <ul className="modal__trainer-list">
              {/* desactivo el boton si el equipo ya esta lleno o si el pokemon ya esta en el equipo */}
              {state.trainers.map((trainer) => {
                const isFull = trainer.team.length >= 6
                const hasPokemon = trainer.team.some(
                  (s) => s.pokemonId === pokemon.id,
                )

                return (
                  <li key={trainer.id} className="modal__trainer-item">
                    <button
                      type="button"
                      className="modal__trainer-btn"
                      disabled={isFull || hasPokemon}
                      onClick={() => handleAdd(trainer.id)}
                    >
                      <span>{trainer.name}</span>
                      <span className="modal__team-info">
                        {isFull
                          ? 'Team full'
                          : hasPokemon
                            ? 'Already in team'
                            : `${trainer.team.length}/6`}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
