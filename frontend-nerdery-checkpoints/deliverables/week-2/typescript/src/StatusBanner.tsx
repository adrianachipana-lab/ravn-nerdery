import type { FormState } from './formState'
import { describeState } from './formState'

interface StatusBannerProps {
  state: FormState
}

// componente que muestra el estado del formulario como un banner
// si es error usa role="alert" para que lectores de pantalla lo anuncien
export function StatusBanner({ state }: StatusBannerProps) {
  const text = describeState(state)
  const className = `typescript-demo__status typescript-demo__status--${state.status}`

  // si es error, le pongo role="alert" por accesibilidad
  if (state.status === 'error') {
    return (
      <div className={className}>
        <span className="typescript-demo__status-label">Current state</span>
        <strong className="typescript-demo__status-text" role="alert">
          {text}
        </strong>
      </div>
    )
  }

  return (
    <div className={className}>
      <span className="typescript-demo__status-label">Current state</span>
      <strong className="typescript-demo__status-text">{text}</strong>
    </div>
  )
}
