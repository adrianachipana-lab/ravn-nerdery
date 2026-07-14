import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';
import './styles/global.css';

/*
  MEJORAS APLICADAS EN ESTE ARCHIVO:

  1. ERROR BOUNDARY — Wrappea toda la app. Si cualquier componente
     crashea, muestra una pantalla de error en vez de pantalla blanca.
     Sin esto, un error en un componente mata toda la app.

  2. LAZY LOADING (React.lazy) — Las paginas se cargan SOLO cuando
     el usuario navega a ellas. En vez de descargar todo el JS al inicio,
     se divide en "chunks" que se cargan bajo demanda.
     Esto hace que la carga inicial sea mas rapida.

  3. SUSPENSE — Muestra un loading spinner mientras una pagina lazy
     se esta cargando. Es el complemento necesario de React.lazy.
*/

// Lazy loading: cada pagina se carga solo cuando se necesita
// React.lazy recibe una funcion que retorna un import() dinamico
const Dashboard = lazy(() =>
  import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })),
);
const Settings = lazy(() =>
  import('./pages/Settings').then((m) => ({ default: m.Settings })),
);
const NotFound = lazy(() =>
  import('./pages/NotFound').then((m) => ({ default: m.NotFound })),
);

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="app-layout">
          <Sidebar />

          <div className="app-main">
            <Header />

            <main className="app-content">
              <ErrorBoundary>
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
