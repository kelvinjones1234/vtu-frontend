import { React, lazy, Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthenticationContext";
import ProductProvider from "./context/ProductContext";
import { WalletProvider } from "./context/WalletContext";
import GeneralProvider from "./context/GeneralContext";
import ParticleComponent from "./components/ParticleComponent";
import ScrollToTop from "./components/ScrollTop";
import AppContent from "./AppContent";
import ErrorBoundary from "./pages/ErrorBoundary";

function App() {
  return (
    <BrowserRouter>
      <GeneralProvider>
        <AuthProvider>
          <ProductProvider>
            <WalletProvider>
              <div>
                <div className="bg-white dark:bg-dark-custom-gradient w-full z-[-100] min-w-[150px] fixed top-0 left-0 min-h-screen"></div>
                <ParticleComponent className="particles" />
                <ScrollToTop />
                <AppContent />
              </div>
            </WalletProvider>
          </ProductProvider>
        </AuthProvider>
      </GeneralProvider>
    </BrowserRouter>
  );
}

export default App;
