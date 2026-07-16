import { useParams, Link } from 'react-router-dom'
import { useTrainers } from '../context/trainers-context'
import { TrainerTeam } from '../components/trainer/TrainerTeam'
import './Pages.css'

export function TrainerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { getTrainer, removeFromTeam } = useTrainers()

  if (!id) return null

  const trainer = getTrainer(id)

  if (!trainer) {
    return (
      <div className="page">
        <p>Trainer not found.</p>
        <Link to="/trainers">&larr; Back to trainers</Link>
      </div>
    )
  }

  return (
    <div className="page">
      <Link to="/trainers" className="page__back">&larr; Back to trainers</Link>
      <TrainerTeam
        trainer={trainer}
        onRemovePokemon={(pokemonId) => removeFromTeam(id, pokemonId)}
      />
      <Link to="/" className="page__action-link">
        Browse Pokemon to add to this team &rarr;
      </Link>
    </div>
  )
}
