import type { FormState } from './formState'
import { describeState } from './formState'

// componente que muestra el estado del formulario como un banner
// si es error usa role="alert" para que lectores de pantalla lo anuncien
export function StatusBanner({ state }: { state: FormState }) {
  const text = describeState(state)

  // si es error, le pongo role="alert" por accesibilidad
  if (state.status === 'error') {
    return <div role="alert">{text}</div>
  }

  return <div>{text}</div>
}
