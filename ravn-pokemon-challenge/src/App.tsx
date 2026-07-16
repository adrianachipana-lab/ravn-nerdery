import { Routes, Route } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { ErrorBoundary } from './components/error/ErrorBoundary'
import { PokemonBrowsePage } from './pages/PokemonBrowsePage'
import { PokemonDetailPage } from './pages/PokemonDetailPage'
import { TrainersPage } from './pages/TrainersPage'
import { TrainerDetailPage } from './pages/TrainerDetailPage'
import { MatchupPage } from './pages/MatchupPage'
import { NotFoundPage } from './pages/NotFoundPage'

// componente principal de la app, define todas las rutas
export function App() {
  return (
    <>
      {/* skip link para accesibilidad, los lectores de pantalla pueden saltar directo al contenido */}
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main-content">
        {/* error boundary envuelve las rutas para que si una pagina falla no crashee toda la app */}
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<PokemonBrowsePage />} />
            <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
            <Route path="/matchups" element={<MatchupPage />} />
            <Route path="/trainers" element={<TrainersPage />} />
            <Route path="/trainers/:id" element={<TrainerDetailPage />} />
            {/* ruta catch-all para URLs que no existen */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ErrorBoundary>
      </main>
    </>
  )
}
