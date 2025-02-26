import {
  createContext,
  useState,
  useMemo,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { GeneralContext } from "./GeneralContext";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userError, setUserError] = useState("");
  const [registerErrors, setRegisterErrors] = useState({});
  const navigate = useNavigate();
  const { api } = useContext(GeneralContext);
  const memoizedApi = useMemo(() => api, [api]);
  const [rememberMe, setRememberMe] = useState(false);

  const getStoredTokens = () => {
    // Check localStorage first, then sessionStorage
    const tokens =
      localStorage.getItem("authTokens") ||
      sessionStorage.getItem("authTokens");
    return tokens ? JSON.parse(tokens) : null;
  };

  // Define authTokens state and initialize it with getStoredTokens
  const [authTokens, setAuthTokens] = useState(getStoredTokens());

  // Define user state and initialize it with the decoded token
  const [user, setUser] = useState(() => {
    const tokens = getStoredTokens();
    return tokens ? jwtDecode(tokens.access) : null;
  });

  const loginUser = async (username, password) => {
    try {
      const response = await memoizedApi.post(
        "token/",
        { username: username.toLowerCase(), password },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data;
      if (response.status === 200) {
        setAuthTokens(data);
        setUser(jwtDecode(data.access));

        localStorage.removeItem("fundingData");

        // Store in localStorage by default
        localStorage.setItem("authTokens", JSON.stringify(data));

        // If rememberMe is false, also store in sessionStorage for temporary session
        if (!rememberMe) {
          sessionStorage.setItem("authTokens", JSON.stringify(data));
        }

        navigate("/user/dashboard");
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    if (error.message === "Network Error") {
      setUserError("Network error. Try again later.");
    } else if (error.response) {
      if (error.response.status === 401) {
        setUserError("Invalid username or password.");
      } else {
        setUserError(
          error.response.data?.detail || "An error occurred. Please try again."
        );
      }
    } else if (error.request) {
      setUserError("No response from server. Please try again later.");
    } else {
      setUserError("An unexpected error occurred. Please try again.");
    }
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
  };

  const registerUser = async (formData) => {
    try {
      const response = await memoizedApi.post(
        "authentication/register/",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201) {
        navigate("/authentication/login");
      }
    } catch (error) {
      const errors = error.response?.data || {};
      setRegisterErrors(errors);
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const refreshToken = useCallback(async () => {
    try {
      const response = await memoizedApi.post(
        "token/refresh/",
        { refresh: authTokens.refresh },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        const data = response.data;
        setAuthTokens(data);
        setUser(jwtDecode(data.access));

        // Update localStorage by default
        localStorage.setItem("authTokens", JSON.stringify(data));

        // If rememberMe is false, also update sessionStorage
        if (!rememberMe) {
          sessionStorage.setItem("authTokens", JSON.stringify(data));
        }
      } else {
        logoutUser();
      }
    } catch (error) {
      console.error(
        "Error refreshing token:",
        error.response ? error.response.data : error.message
      );
      logoutUser();
    }
  }, [authTokens?.refresh, memoizedApi, rememberMe]);

  useEffect(() => {
    if (authTokens) {
      const decodedToken = jwtDecode(authTokens.access);
      if (decodedToken.exp * 1000 < Date.now()) {
        logoutUser();
      } else {
        const interval = setInterval(refreshToken, 17 * 60 * 1000); // Refresh token every 17 minutes
        return () => clearInterval(interval);
      }
    }
  }, [authTokens, refreshToken]);

  const logoutUser = () => {
    setUser(null);
    setAuthTokens(null);
    localStorage.removeItem("authTokens");
    sessionStorage.removeItem("authTokens");
    navigate("/authentication/login");
  };

  const contextData = {
    loginUser,
    logoutUser,
    registerUser,
    setUserError,
    refreshToken,
    setRememberMe,
    setRegisterErrors,
    rememberMe,
    registerErrors,
    user,
    userError,
    authTokens,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;