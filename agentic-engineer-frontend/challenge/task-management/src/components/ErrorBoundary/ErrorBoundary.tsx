import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';

/*
  ERROR BOUNDARY
  ================
  ¿Que es? Un componente que "atrapa" errores de JavaScript en
  cualquier componente hijo y muestra un fallback en vez de crashear
  toda la app (pantalla blanca).

  ¿Por que es class component? Porque React solo soporta Error Boundaries
  como class components — los hooks no tienen equivalente de
  componentDidCatch ni getDerivedStateFromError (todavia).

  ¿Donde se usa? Se wrappea alrededor de secciones de la app.
  Si un componente dentro del boundary crashea, solo ESA seccion
  muestra el error, el resto de la app sigue funcionando.
*/

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Aqui iria un servicio de logging como Sentry
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className={styles.container}>
          <div className={styles.card}>
            <h2 className={styles.title}>Something went wrong</h2>
            <p className={styles.message}>
              {this.state.error?.message ?? 'An unexpected error occurred'}
            </p>
            <button
              className={styles.button}
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
