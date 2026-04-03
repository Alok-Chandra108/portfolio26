import React from 'react';
import AnimatedButton from './ui/AnimatedButton.jsx';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-fallback">
          <div className="container">
            <div className="error-fallback__content">
              <div className="error-fallback__icon">!</div>
              <h1 className="error-fallback__title">Something went wrong</h1>
              <p className="error-fallback__message">
                We encountered an unexpected error. Don't worry, your data is safe.
              </p>
              {this.state.error && (
                <div className="error-fallback__details">
                  <code>{this.state.error.toString()}</code>
                </div>
              )}
              <div className="error-fallback__actions">
                <AnimatedButton onClick={this.handleReset}>
                  Back to safety
                </AnimatedButton>
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
