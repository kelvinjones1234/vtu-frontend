import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // componentDidCatch(error, errorInfo) {
  //   // You can log the error to an error reporting service here
  //   console.error("Uncaught error:", error, errorInfo);
  // }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-bg_on min-h-screen bg-contain bg-no-repeat justify-center pt-24 sm:bg-cover bg-center px-4 sm:px-6 lg:px-8 xl:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
              <h2 className="font-bold font-heading_two text-primary dark:text-white text-3xl mb-4">
                Oops! Something went wrong.
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                We're sorry, but an unexpected error has occurred. Please try
                refreshing the page or contact support if the problem persists.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition-all"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
