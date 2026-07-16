// error boundary tiene que ser un componente de clase porque react no tiene un hook equivalente
// atrapa errores de cualquier hijo y muestra un fallback en vez de crashear toda la app
import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  // react llama esto cuando un hijo tira un error, actualizo el state para mostrar el fallback
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  // aca puedo loggear el error a un servicio externo si quisiera
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      // si me pasan un fallback custom lo uso, si no muestro uno default con boton de reintentar
      return (
        this.props.fallback ?? (
          <div role="alert" style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>Something went wrong</h2>
            <p>{this.state.error?.message}</p>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Try again
            </button>
          </div>
        )
      )
    }
    return this.props.children
  }
}
