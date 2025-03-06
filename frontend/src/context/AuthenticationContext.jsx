import { createContext, useState, useMemo, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GeneralContext } from "./GeneralContext";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userError, setUserError] = useState("");
  const [registerErrors, setRegisterErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const navigate = useNavigate();
  const { api } = useContext(GeneralContext);

  // Configure request interceptor to handle token refresh
  useEffect(() => {
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

    const requestInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Only attempt refresh if:
        // 1. It's a 401 error
        // 2. It's not a refresh request itself
        // 3. We haven't already tried to refresh
        // 4. We haven't already had a refresh failure this session
        if (
          error.response?.status === 401 &&
          !originalRequest.url.includes("/refresh/") &&
          !originalRequest._retry &&
          !refreshFailed &&
          authInitialized // Only try refresh after initial auth check
        ) {
          if (isRefreshing) {
            // If we're already refreshing, queue this request
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then(() => {
                return api(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
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
              // Unexpected success status
              refreshFailed = true;
              processQueue(new Error("Refresh failed"));

              // Clear user and redirect
              setUser(null);
              if (!window.location.pathname.includes("/authentication/login")) {
                navigate("/authentication/login");
              }

              return Promise.reject(error);
            }
          } catch (refreshError) {
            isRefreshing = false;
            refreshFailed = true;
            processQueue(refreshError);

            // If refresh fails, clear user and redirect to login
            setUser(null);
            if (!window.location.pathname.includes("/authentication/login")) {
              navigate("/authentication/login");
            }

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
        // Call endpoint to get user profile
        const response = await api.get("/auth/validate/", {
          withCredentials: true,
        });

        if (response.status === 200) {
          console.log("Auth validation successful:", response.data);
          setUser(response.data);
        }
      } catch (error) {
        console.log("Auth validation failed:", error.response?.status);
        setUser(null);
      } finally {
        setLoading(false);
        setAuthInitialized(true); // Mark initialization as complete
      }
    };

    validateAuth();
  }, [api]);

  const loginUser = async (username, password) => {
    try {
      setUserError("");
      setLoading(true);

      console.log("Attempting login for:", username);
      const response = await api.post(
        "/login/",
        { username, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log("Login successful:", user);
        setUser(response.data);

        // Redirect after login
        navigate("/user/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response?.status === 401) {
        setUserError("Invalid username or password");
      } else if (error.response?.data?.error) {
        setUserError(error.response.data.error);
      } else if (error.message === "Network Error") {
        setUserError(
          "Network error. Please check your connection and try again."
        );
      } else {
        setUserError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    try {
      await api.post("/logout/", {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear user and redirect, even if the API fails
      setUser(null);
      navigate("/authentication/login", { replace: true });
    }
  };

  const registerUser = async (formData) => {
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
      if (error.response?.data) {
        setRegisterErrors(error.response.data);
      } else {
        setRegisterErrors({
          non_field_errors: ["Registration failed. Please try again."],
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const contextData = useMemo(
    () => ({
      loginUser,
      logoutUser,
      registerUser,
      setUserError,
      user,
      userError,
      registerErrors,
      loading,
      isAuthenticated: !!user,
    }),
    [user, userError, registerErrors, loading]
  );

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
