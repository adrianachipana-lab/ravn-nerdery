// union discriminada: cada variante tiene un campo status en comun
// pero cada una lleva datos distintos (id, message, etc)
// typescript puede hacer narrowing con state.status en un switch
export type FormState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success'; id: string }
  | { status: 'error'; message: string }

// funcion que convierte el estado del form en un texto legible
export function describeState(state: FormState): string {
  switch (state.status) {
    case 'idle':
      return 'Ready'
    case 'submitting':
      return 'Submitting\u2026'
    case 'success':
      // aca puedo acceder a state.id porque typescript ya sabe que es 'success'
      return `Saved #${state.id}`
    case 'error':
      return state.message
    default: {
      // esto es un exhaustive check, si me olvido de un case typescript me avisa
      const _exhaustive: never = state
      return _exhaustive
    }
  }
}
