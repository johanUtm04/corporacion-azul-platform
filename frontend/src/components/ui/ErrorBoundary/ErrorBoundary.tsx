import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import './ErrorBoundary.css'
type Props = {
  children: ReactNode
}

type State = {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('Application rendering error:', error, info)
    }
  }

  render() {
    if (this.state.hasError) {
    return (
    <main
        className="error-boundary-page"
        aria-labelledby="error-boundary-title"
    >
        <div className="error-boundary-content" role="alert">
        <span className="error-boundary-code">
            ERROR DE APLICACIÓN
        </span>

        <h1 id="error-boundary-title">
            Ocurrió un problema
        </h1>

        <p>
            No pudimos mostrar esta página.
            Intenta recargarla para continuar.
        </p>

        <button
            type="button"
            className="btn-primary"
            onClick={() => window.location.reload()}
        >
            Recargar página
        </button>
        </div>
    </main>
    )
    }

    return this.props.children
  }
}