import { Suspense, Component, use, useState, type ReactNode, type ErrorInfo } from 'react'
import { fetchUsers, type User } from './api'

// error boundary tiene que ser clase porque react no tiene hooks para atrapar errores todavia
interface ErrorBoundaryProps {
  fallback: (retry: () => void) => ReactNode
  children: ReactNode
  resetKey: number
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  // cuando un hijo tira error, react llama esto automaticamente para actualizar el state
  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('UsersView error boundary:', error, info)
  }

  // si el resetKey cambia significa que el usuario quiere reintentar, limpio el error
  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false })
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback(() => {})
    }
    return this.props.children
  }
}

// guardo la promesa en cache para que no se vuelva a llamar la api cada render
let cachedPromise: Promise<User[]> | null = null

function getUsers(): Promise<User[]> {
  if (!cachedPromise) {
    cachedPromise = fetchUsers()
  }
  return cachedPromise
}

// uso el hook use() de react 19 que suspende el componente mientras la promesa resuelve
function UserList() {
  const users = use(getUsers())
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}

export function UsersView() {
  // resetKey sirve para forzar que el error boundary se limpie cuando reintento
  const [resetKey, setResetKey] = useState(0)

  // limpio el cache de la promesa y la vuelvo a crear, asi fuerzo un refetch
  function handleRetry() {
    cachedPromise = null
    getUsers()
    setResetKey((k) => k + 1)
  }

  // suspense muestra el loading mientras use() espera, error boundary atrapa si falla
  return (
    <ErrorBoundary
      resetKey={resetKey}
      fallback={() => (
        <div>
          <p>Something went wrong</p>
          <button type="button" onClick={handleRetry}>
            Try again
          </button>
        </div>
      )}
    >
      <Suspense fallback={<p>Loading...</p>}>
        <UserList />
      </Suspense>
    </ErrorBoundary>
  )
}
