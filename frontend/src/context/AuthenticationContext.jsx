import {
  createContext,
  useState,
  useMemo,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { useGeneral } from "./GeneralContext";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userError, setUserError] = useState("");
  const [registerErrors, setRegisterErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const navigate = useNavigate();
  const { api } = useGeneral();

  // Clear user error message handler - memoized
  const clearUserError = useCallback(() => setUserError(""), []);

  // Configure request interceptor to handle token refresh
  useEffect(() => {
    // These variables persist across interceptor calls but aren't in state
    // to avoid unnecessary re-renders
    let isRefreshing = false;
    let refreshFailed = false;
    let failedQueue = [];

    const processQueue = (error = null) => {
      failedQueue.forEach((prom) => {
        if (error) {
          prom.reject(error);
        } else {
          prom.resolve();
        }
      });
      failedQueue = [];
    };

    // Handle the logout process - extracted for reuse
    const handleLogout = () => {
      setUser(null);
      if (!window.location.pathname.includes("/authentication/login")) {
        navigate("/authentication/login");
      }
    };

    const requestInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Combine conditions for better readability
        const shouldAttemptRefresh =
          error.response?.status === 401 &&
          !originalRequest.url.includes("/refresh/") &&
          !originalRequest._retry &&
          !refreshFailed &&
          authInitialized;

        if (shouldAttemptRefresh) {
          if (isRefreshing) {
            // Queue this request while refresh is in progress
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then(() => api(originalRequest))
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            // Call refresh token endpoint
            const refreshResponse = await api.post(
              "/refresh/",
              {},
              {
                withCredentials: true,
              }
            );

            isRefreshing = false;

            if (refreshResponse.status === 200) {
              processQueue();
              return api(originalRequest);
            } else {
              refreshFailed = true;
              processQueue(new Error("Refresh failed"));
              handleLogout();
              return Promise.reject(error);
            }
          } catch (refreshError) {
            isRefreshing = false;
            refreshFailed = true;
            processQueue(refreshError);
            handleLogout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      // Clean up interceptor on unmount
      api.interceptors.response.eject(requestInterceptor);
    };
  }, [api, navigate, authInitialized]);

  // Validate auth on component mount - only once
  useEffect(() => {
    const validateAuth = async () => {
      if (authInitialized) return; // Only run once

      setLoading(true);
      try {
        const response = await api.get("/auth/validate/", {
          withCredentials: true,
        });

        if (response.status === 200) {
          setUser(response.data);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
        setAuthInitialized(true);
      }
    };

    validateAuth();
  }, [api, authInitialized]);

  // Login function - memoized
  const loginUser = useCallback(
    async (username, password) => {
      try {
        setUserError("");
        setLoading(true);

        const response = await api.post(
          "/login/",
          { username, password },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          setUser(response.data);
          navigate("/user/dashboard", { replace: true });
        }
      } catch (error) {
        if (error.response?.data?.error) {
          setUserError(error.response.data.error);
        } else if (error.message === "Network Error") {
          setUserError(
            "Network error. Please check your connection and try again."
          );
        } else {
          setUserError("Invalid username or password.");
        }
      } finally {
        setLoading(false);
      }
    },
    [api, navigate]
  );

  // Logout function - memoized
  // const logoutUser = useCallback(async () => {
  //   try {
  //     await api.post("/logout/", null, { withCredentials: true });
  //   } catch (error) {
  //     console.error("Logout error:", error);
  //   } finally {
  //     setUser(null);
  //     navigate("/authentication/login", { replace: true });
  //   }
  // }, [api, navigate, setUser]);

  const logoutUser = useCallback(() => {
    setUser(null);
    navigate("/authentication/login", { replace: true });

    api.post("/logout/", null, { withCredentials: true }).catch((error) => {
      console.error("Logout error:", error);
    });
  }, [navigate, setUser]);

  // Register function - memoized
  const registerUser = useCallback(
    async (formData) => {
      try {
        setRegisterErrors({});
        setLoading(true);

        const response = await api.post("/register/", formData, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });

        if (response.status === 201) {
          navigate("/authentication/login/", { replace: true });
        }
      } catch (error) {
        const errors = error.response?.data || {};
        setRegisterErrors(errors);
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setLoading(false);
      }
    },
    [api, navigate]
  );

  // Memoize context value to prevent unnecessary renders
  const contextData = useMemo(
    () => ({
      loginUser,
      logoutUser,
      registerUser,
      setUserError: clearUserError,
      setRegisterErrors,
      user,
      userError,
      registerErrors,
      loading,
      isAuthenticated: !!user,
    }),
    [
      user,
      userError,
      registerErrors,
      loading,
      setRegisterErrors,
      loginUser,
      logoutUser,
      registerUser,
      clearUserError,
    ]
  );

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
