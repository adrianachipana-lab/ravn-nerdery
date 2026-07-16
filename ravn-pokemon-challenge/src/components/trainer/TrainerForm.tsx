import { useState, useId } from 'react'
import { useTrainers } from '../../context/trainers-context'
import './TrainerForm.css'

// formulario controlado para crear un trainer nuevo
export function TrainerForm() {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const { addTrainer } = useTrainers()
  const inputId = useId()

  // prevengo el submit por default, valido que no este vacio y despacho la accion
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Trainer name is required')
      return
    }
    addTrainer(trimmed)
    setName('')
    setError('')
  }

  return (
    <form className="trainer-form" onSubmit={handleSubmit}>
      <div className="trainer-form__field">
        <label htmlFor={inputId} className="trainer-form__label">
          New trainer name
        </label>
        <input
          id={inputId}
          className="trainer-form__input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Ash Ketchum"
        />
      </div>
      {error && <p className="trainer-form__error" role="alert">{error}</p>}
      <button type="submit" className="trainer-form__submit">
        Create trainer
      </button>
    </form>
  )
}
