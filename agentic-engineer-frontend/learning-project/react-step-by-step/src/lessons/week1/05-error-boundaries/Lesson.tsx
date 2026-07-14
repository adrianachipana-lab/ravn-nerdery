import { Component, useState } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Link } from 'react-router-dom';

/*
  LECCION 1.5: Error Boundaries
  Que pasa cuando algo crashea en tu app
*/

// Error Boundary — el unico class component que todavia necesitamos
interface EBProps { children: ReactNode; fallback?: ReactNode }
interface EBState { hasError: boolean; error: Error | null }

class ErrorBoundary extends Component<EBProps, EBState> {
  constructor(props: EBProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error): EBState {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Caught by ErrorBoundary:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div style={{ padding: '20px', background: 'rgba(218,88,75,0.1)', borderRadius: '8px', border: '1px solid rgba(218,88,75,0.2)' }}>
          <p style={{ fontWeight: 600, color: '#da584b', marginBottom: '8px' }}>Something crashed</p>
          <p style={{ fontSize: '13px', color: '#94979a', marginBottom: '12px' }}>{this.state.error?.message}</p>
          <button className="btn btn-secondary" onClick={() => this.setState({ hasError: false, error: null })}>Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Componente que crashea a proposito
function BuggyCounter() {
  const [count, setCount] = useState(0);
  if (count === 3) throw new Error('Counter reached 3 — I crashed on purpose!');
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <button className="btn btn-primary" onClick={() => setCount(c => c + 1)}>
        Count: {count}
      </button>
      <span style={{ fontSize: '12px', color: '#94979a' }}>Crashes at 3</span>
    </div>
  );
}

// Componente seguro al lado
function SafeComponent() {
  return <p style={{ fontSize: '14px', color: '#70b252' }}>I'm safe — the crash didn't affect me</p>;
}

export default function Lesson() {
  return (
    <div className="lesson">
      <h2>1.5b — Error Boundaries</h2>
      <p className="subtitle">
        ¿Que pasa cuando un componente tiene un bug y crashea?
        Sin Error Boundary, TODA la app se vuelve pantalla blanca.
        Con Error Boundary, solo la parte rota muestra un error.
      </p>

      <h3>El problema: pantalla blanca de la muerte</h3>
      <p>
        Imagina que tienes una app con sidebar, header, y contenido.
        Si el contenido tiene un bug (por ejemplo, intentas leer una propiedad
        de <code>undefined</code>), <strong>toda la app desaparece</strong>.
        El sidebar, el header, todo — pantalla blanca. El usuario no puede hacer nada.
      </p>
      <p>
        Es como si un fusible de la cocina se quemara y se apagara TODA la casa
        en vez de solo la cocina.
      </p>

      <h3>La solucion: Error Boundary</h3>
      <p>
        Un Error Boundary es un componente que <strong>"atrapa" los errores</strong> de
        sus hijos y muestra un fallback en vez de dejar que toda la app crashee.
        Es como un fusible individual: si la cocina falla, solo se apaga la cocina.
      </p>

      <div className="code-block">{
`// Wrappeas la seccion que quieres proteger:
<ErrorBoundary>
  <DashboardContent />   {/* Si esto crashea... */}
</ErrorBoundary>
{/* ...solo esta seccion muestra el error */}
{/* El sidebar y header siguen funcionando */}

// Puedes tener MULTIPLES boundaries:
<ErrorBoundary>
  <Sidebar />
</ErrorBoundary>
<ErrorBoundary>
  <MainContent />
</ErrorBoundary>
// Si MainContent crashea, Sidebar sigue vivo`
      }</div>

      <h3>Demo — clickea hasta que crashee</h3>
      <p>El contador de la izquierda va a crashear al llegar a 3. El texto de la derecha NO se ve afectado:</p>

      <div className="demo">
        <p className="demo-label">Dos componentes en boundaries separados:</p>
        <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
          <ErrorBoundary>
            <BuggyCounter />
          </ErrorBoundary>
          <ErrorBoundary>
            <SafeComponent />
          </ErrorBoundary>
        </div>
      </div>

      <h3>¿Por que es un class component?</h3>
      <div className="code-block">{
`// Error Boundaries SOLO funcionan como class components.
// React no tiene un hook equivalente a componentDidCatch (todavia).
// Es el UNICO caso donde necesitas class components en React moderno.

class ErrorBoundary extends Component {
  static getDerivedStateFromError(error) {
    // Se llama cuando un hijo crashea
    // Retorna el nuevo estado (hasError: true)
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Se llama despues del crash
    // Aqui mandas el error a un servicio (Sentry, LogRocket, etc.)
    logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;  // Muestra esto en vez del componente roto
    }
    return this.props.children;  // Si no hay error, renderiza normal
  }
}`
      }</div>

      <div className="info-box warning">
        <strong>Pregunta del mentor:</strong> "¿Que errores NO atrapa un Error Boundary?"
        <br /><br />
        <strong>Lo que deberias poder responder:</strong> Error Boundaries solo atrapan
        errores durante el render, en lifecycle methods, y en constructores de
        componentes hijos. NO atrapan: (1) Errores en event handlers (onClick, onChange) —
        esos se manejan con try/catch normal. (2) Errores en codigo asincrono (setTimeout,
        fetch, promises). (3) Errores en el propio Error Boundary (necesitas otro boundary
        arriba). (4) Errores en SSR (server-side rendering).
      </div>

      <div className="info-box warning">
        <strong>Pregunta del mentor:</strong> "¿Donde pondrias Error Boundaries en una app real?"
        <br /><br />
        <strong>Lo que deberias poder responder:</strong> En tres niveles: (1) Uno
        a nivel de la APP completa — captura errores catastroficos y muestra una pagina
        de error con "volver al inicio". (2) Uno a nivel de cada RUTA/PAGINA — si una
        pagina crashea, las otras siguen funcionando. (3) Opcionalmente alrededor de
        componentes de terceros o secciones criticas que podrian fallar (widgets, charts,
        integraciones externas).
      </div>

      <div className="info-box success">
        <strong>Para el code review:</strong> Si tu app no tiene Error Boundaries,
        un solo bug en un componente pequeño puede tumbar toda la app. Es una de las
        primeras cosas que un reviewer senior va a buscar.
      </div>

      <div className="lesson-nav">
        <Link to="/week1/forms">← Forms</Link>
        <Link to="/week1/useState">useState →</Link>
      </div>
    </div>
  );
}
