import React from 'react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          textAlign: 'center',
          background: '#F7F5EF',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          <div style={{
            fontSize: '4rem',
            marginBottom: '1rem',
          }}>⚠️</div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#0F181E',
            margin: '0 0 0.5rem 0',
          }}>Something went wrong</h1>
          <p style={{
            fontSize: '1rem',
            color: '#52636B',
            margin: '0 0 1.5rem 0',
            maxWidth: '400px',
          }}>
            {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
          </p>
          <div style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '0.75rem 2rem',
                background: '#14535F',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#0E3F48'
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 4px 12px rgba(20, 83, 95, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#14535F'
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = 'none'
              }}
            >
              Refresh Page
            </button>
            <button
              onClick={() => window.location.href = '/'}
              style={{
                padding: '0.75rem 2rem',
                background: 'transparent',
                color: '#14535F',
                border: '2px solid #14535F',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#14535F'
                e.target.style.color = '#FFFFFF'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent'
                e.target.style.color = '#14535F'
              }}
            >
              Go to Homepage
            </button>
          </div>
          {this.state.errorInfo && process.env.NODE_ENV === 'development' && (
            <details style={{
              marginTop: '2rem',
              textAlign: 'left',
              maxWidth: '600px',
              width: '100%',
            }}>
              <summary style={{
                cursor: 'pointer',
                fontWeight: 'bold',
                color: '#52636B',
              }}>
                Error Details (Development Only)
              </summary>
              <pre style={{
                background: '#1a1a1a',
                color: '#f8f8f8',
                padding: '1rem',
                borderRadius: '8px',
                overflow: 'auto',
                fontSize: '0.85rem',
                marginTop: '0.5rem',
              }}>
                {this.state.error && this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary