import { React, lazy, Suspense, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthenticationContext";
import ProductProvider from "./context/ProductContext";
import { WalletProvider } from "./context/WalletContext";
import GeneralProvider from "./context/GeneralContext";
import ParticleComponent from "./components/ParticleComponent";
import ScrollToTop from "./components/ScrollTop";
import ErrorBoundary from "./pages/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy load the AppContent component
const AppContent = lazy(() => import("./AppContent"));

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <BrowserRouter>
      <GeneralProvider>
        <AuthProvider>
          <ProductProvider>
            <WalletProvider>
              <div className="absolute top-0 left-0 w-full min-h-full bg-white dark:bg-dark-custom-gradient z-[-100]"></div>
              <ParticleComponent className="particles" />
              {!isLoading && <ScrollToTop />}
              <ErrorBoundary>
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center h-screen">
                      <LoadingSpinner />
                    </div>
                  }
                >
                  <AppContent onLoad={() => setIsLoading(false)} />
                </Suspense>
              </ErrorBoundary>
            </WalletProvider>
          </ProductProvider>
        </AuthProvider>
      </GeneralProvider>
    </BrowserRouter>
  );
}

export default App;
