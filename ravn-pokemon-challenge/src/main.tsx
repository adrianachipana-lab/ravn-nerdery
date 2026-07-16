// punto de entrada de la app, aca se montan todos los providers y se renderiza en el DOM
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TrainersProvider } from './context/trainers-context'
import { ThemeProvider } from './context/theme-context'
import { App } from './App'
import './styles/global.css'

// configuro tanstack query: staleTime de 5 min para no refetchear tanto, y solo 1 retry si falla
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
})

// el orden de los providers importa: query va afuera porque los demas pueden necesitarlo
// StrictMode ayuda a detectar problemas en desarrollo (renderiza dos veces)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TrainersProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </TrainersProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
