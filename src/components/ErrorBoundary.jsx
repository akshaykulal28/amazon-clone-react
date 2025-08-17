import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card border-danger">
                <div className="card-body text-center">
                  <h2 className="card-title text-danger">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    Oops! Something went wrong
                  </h2>
                  <p className="card-text">
                    We're sorry, but something unexpected happened. Please try refreshing the page.
                  </p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => window.location.reload()}
                  >
                    Refresh Page
                  </button>
                  {process.env.NODE_ENV === 'development' && (
                    <details className="mt-3">
                      <summary>Error Details (Development Mode)</summary>
                      <pre className="text-start mt-2 p-3 bg-light border rounded">
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
