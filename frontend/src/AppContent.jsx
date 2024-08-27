import { React, lazy, Suspense, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthContext } from "./context/AuthenticationContext";
// import HomePage from "./pages/HomePage";
import UserDashboardPage from "./pages/UserDashboardPage";
import PrivateRoute from "./utils/PrivateRoute";
import DataPage from "./pages/DataPage";
import AirtimePage from "./pages/AirtimePage";
import CableSubPage from "./pages/CableSubPage";
import ElectricityBillPage from "./pages/ElectricityBillPage";
import ProfilePage from "./pages/ProfilePage";
import TransactionHistoryPage from "./pages/TransactionHistoryPage";

import NotificationPage from "./pages/NotificationPage";
import TermsAndConditionsPage from "./pages/TermsAndConditionsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import NoAuthPrivacyPolicyPage from "./pages/NoAuthPrivacyPolicyPage";
import NoAuthTermsAndConditionPage from "./pages/NoAuthTermsAndConditionPage";
import LoadingSpinner from "./components/LoadingSpinner";

// import RegisterationPage from "./pages/RegisterationPage";
// import PageNotFoundPage from "./pages/PageNotFoundPage";
// import LoginPage from "./pages/LoginPage";
// import PasswordResetRequestPage from "./pages/PasswordResetRequestPage";
// import PasswordResetPage from "./pages/PasswordResetPage";

const HomePage = lazy(() => import("./pages/HomePage"));
const PageNotFoundPage = lazy(() => import("./pages/PageNotFoundPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterationPage = lazy(() => import("./pages/RegisterationPage"));
const PasswordResetPage = lazy(() => import("./pages/PasswordResetPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const NoAuthAboutPage = lazy(() => import("./pages/NoAuthAboutPage"));
const PriceListPage = lazy(() => import("./pages/PriceListPage"));

const PasswordResetRequestPage = lazy(() =>
  import("./pages/PasswordResetRequestPage")
);

function AppContent() {
  const { user } = useContext(AuthContext);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="*" element={<PageNotFoundPage />} />
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
          path="/privacy-and-policy"
          element={user ? <PrivacyPolicyPage /> : <NoAuthPrivacyPolicyPage />}
        />
        <Route
          path="/dashboard/about"
          element={user ? <AboutPage /> : <NoAuthAboutPage />}
        />
        <Route
          path="/terms-and-conditions"
          element={
            user ? <TermsAndConditionsPage /> : <NoAuthTermsAndConditionPage />
          }
        />
        <Route
          path="/user/reset-password/:uidb64/:token"
          element={<PasswordResetPage />}
        />
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/user/dashboard" element={<UserDashboardPage />} />
          <Route path="/user/notifications" element={<NotificationPage />} />
          <Route path="/user/dashboard/services/data" element={<DataPage />} />
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
          <Route path="/user/dashboard/profile" element={<ProfilePage />} />
          <Route
            path="/user/dashboard/transactions"
            element={<TransactionHistoryPage />}
          />
          {/* <Route path="/dashboard/price-list" element={<PriceListPage />} /> */}
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AppContent;