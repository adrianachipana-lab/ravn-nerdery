import { useNavigate } from 'react-router-dom'
import { useTrainers } from '../context/trainers-context'
import { TrainerForm } from '../components/trainer/TrainerForm'
import { TrainerCard } from '../components/trainer/TrainerCard'
import { EmptyState } from '../components/ui/EmptyState'
import './Pages.css'

// pagina de trainers: formulario para crear y lista de los que ya existen
export function TrainersPage() {
  // leo el state y la accion de borrar del context de trainers
  const { state, removeTrainer } = useTrainers()
  const navigate = useNavigate()

  return (
    <div className="page">
      <h2 className="page__title">Trainers</h2>
      <TrainerForm />

      {state.trainers.length === 0 ? (
        <EmptyState message="No trainers yet. Create one above!" />
      ) : (
        <div className="trainers-list">
          {state.trainers.map((trainer) => (
            <TrainerCard
              key={trainer.id}
              trainer={trainer}
              onSelect={(id) => navigate(`/trainers/${id}`)}
              onRemove={removeTrainer}
            />
          ))}
        </div>
      )}
    </div>
  )
}
