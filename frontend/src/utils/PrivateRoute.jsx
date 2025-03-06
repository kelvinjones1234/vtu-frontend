import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthenticationContext";

const PrivateRoute = () => {
  const { user, loading } = useContext(AuthContext);
  
  // Show loading indicator or fallback while checking authentication
  if (loading) {
    return <div>Loading...</div>; // Or a more sophisticated loading component
  }
  
  // Only redirect after we've confirmed the user isn't authenticated
  return user && user ? (
    <Outlet />
  ) : (
    <Navigate to="/authentication/login" replace />
  );
};

export default PrivateRoute;