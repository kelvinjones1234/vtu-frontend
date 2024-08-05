import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthProvider from "./context/AuthenticationContext";
import LoginPage from "./pages/LoginPage";
import RegisterationPage from "./pages/RegisterationPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import PrivateRoute from "./utils/PrivateRoute";
import DataPage from "./pages/DataPage";
import AirtimePage from "./pages/AirtimePage";
import CableSubPage from "./pages/CableSubPage";
import ProductProvider from "./context/ProductContext";
import ElectricityBillPage from "./pages/ElectricityBillPage";
import ProfilePage from "./pages/ProfilePage";
import TransactionHistoryPage from "./pages/TransactionHistoryPage";
import { WalletProvider } from "./context/WalletContext";
import PasswordResetRequestPage from "./pages/PasswordResetRequestPage";
import PasswordResetPage from "./pages/PasswordResetPage";
import GeneralProvider from "./context/GeneralContext";
import ParticleComponent from "./components/ParticleComponent";

function App() {
  return (
    <BrowserRouter>
      <GeneralProvider>
        <AuthProvider>
          <ProductProvider>
            <WalletProvider>
              <div>
                <div className="bg-white dark:bg-dark-custom-gradient w-full z-[-2] min-w-[150px] fixed top-0 left-0 min-h-screen"></div>
                <ParticleComponent className='particles'/>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route
                    path="/user/get-password-reset-link"
                    element={<PasswordResetRequestPage />}
                  />
                  <Route path="/authentication/login" element={<LoginPage />} />
                  <Route
                    path="/authentication/register"
                    element={<RegisterationPage />}
                  />
                  <Route
                    path="/user/reset-password/:uid/:token"
                    element={<PasswordResetPage />}
                  />
                  <Route path="/" element={<PrivateRoute />}>
                    <Route
                      path="/user/dashboard"
                      element={<UserDashboardPage />}
                    />
                    <Route
                      path="/user/dashboard/services/data"
                      element={<DataPage />}
                    />
                    <Route
                      path="/user/dashboard/services/airtime"
                      element={<AirtimePage />}
                    />
                    <Route
                      path="/user/dashboard/services/cable subscription"
                      element={<CableSubPage />}
                    />
                    <Route
                      path="/user/dashboard/services/electricity bill"
                      element={<ElectricityBillPage />}
                    />
                    <Route
                      path="/user/dashboard/profile"
                      element={<ProfilePage />}
                    />
                    <Route
                      path="/user/dashboard/transactions"
                      element={<TransactionHistoryPage />}
                    />
                  </Route>
                </Routes>
              </div>
            </WalletProvider>
          </ProductProvider>
        </AuthProvider>
      </GeneralProvider>
    </BrowserRouter>
  );
}

export default App;
