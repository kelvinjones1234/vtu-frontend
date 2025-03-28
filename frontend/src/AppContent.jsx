import { React, lazy, Suspense, useContext } from "react";
import { Routes, Route } from "react-router-dom";
// import HomePage from "./pages/HomePage";
import { useAuth } from "./context/AuthenticationContext";
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
import FundWalletPage from "./pages/FundWalletPage";
// import ServiceShortcutsPage from "./pages/ServiceShortcutsPage";
// import ShortcutListPage from "./pages/ShortcutListPage";
// import AboutPage from "./pages/AboutPage"
// import NoAuthAboutPage from "./pages/NoAuthAboutPage";
// import LoadingSpinner from "./components/LoadingSpinner";

const HomePage = lazy(() => import("./pages/HomePage"));
const PageNotFoundPage = lazy(() => import("./pages/PageNotFoundPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterationPage = lazy(() => import("./pages/RegisterationPage"));
const PasswordResetPage = lazy(() => import("./pages/PasswordResetPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const NoAuthAboutPage = lazy(() => import("./pages/NoAuthAboutPage"));
// const PriceListPage = lazy(() => import("./pages/PriceListPage"));
const ServiceShortcutsPage = lazy(() => import("./pages/ServiceShortcutsPage"));
const ShortcutListPage = lazy(() => import("./pages/ShortcutListPage"));

const PasswordResetRequestPage = lazy(() =>
  import("./pages/PasswordResetRequestPage")
);

function AppContent() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="*" element={<PageNotFoundPage />} />
      <Route path="/" element={<HomePage />} />
      {/* <Route path="/price-list" element={<PriceListPage />} /> */}
      <Route
        path="/user/get-password-reset-link"
        element={<PasswordResetRequestPage />}
      />
      <Route path="/authentication/login" element={<LoginPage />} />
      <Route path="/authentication/register" element={<RegisterationPage />} />
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
        <Route path="/user/dashboard/fundwallet" element={<FundWalletPage />} />
        <Route
          path="/user/dashboard/service-shortcut"
          element={<ServiceShortcutsPage />}
        />

        <Route
          path="/user/dashboard/shortcuts"
          element={<ShortcutListPage />}
        />

        <Route
          path="/user/dashboard/services/airtime"
          element={<AirtimePage />}
        />
        <Route
          path="/user/dashboard/services/cable"
          element={<CableSubPage />}
        />
        <Route
          path="/user/dashboard/services/electricity"
          element={<ElectricityBillPage />}
        />
        <Route path="/user/dashboard/profile" element={<ProfilePage />} />
        <Route
          path="/user/dashboard/transactions"
          element={<TransactionHistoryPage />}
        />
      </Route>
    </Routes>
  );
}

export default AppContent;
