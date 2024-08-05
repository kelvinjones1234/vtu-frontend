import { useContext, React } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthenticationContext";

const PrivateRoute = () => {
  const { user } = useContext(AuthContext);

  return user ? <Outlet /> : <Navigate to="/authentication/login" />;
};

export default PrivateRoute;
