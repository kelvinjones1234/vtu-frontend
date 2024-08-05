import { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { GeneralContext } from "./GeneralContext";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userError, setUserError] = useState("");
  const [registerErrors, setRegisterErrors] = useState({});

  const navigate = useNavigate();
  const { api } = useContext(GeneralContext);

  const [authTokens, setAuthTokens] = useState(
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  const [user, setUser] = useState(
    localStorage.getItem("authTokens")
      ? jwtDecode(JSON.parse(localStorage.getItem("authTokens")).access)
      : null
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (authTokens) {
        refreshToken();
      }
    }, 17 * 60 * 1000);

    return () => clearInterval(interval);
  }, [authTokens]);

  const loginUser = async (username, password) => {
    try {
      const response = await api.post(
        "token/",
        {
          username: username.toLowerCase(),
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      if (response.status === 200) {
        setAuthTokens(data);
        setUser(jwtDecode(data.access));

        localStorage.setItem("authTokens", JSON.stringify(data));
        navigate("/user/dashboard");
      } else {
        alert("Something went wrong!");
      }
      if (response.status === 401) {
        logoutUser();
      }
    } catch (error) {
      setUserError(error.response.data.detail);

      console.error(
        "Error:",
        error.response ? error.response.data.detail : error.message
      );
    }
  };

  const registerUser = async (formData) => {
    try {
      const response = await api.post("authentication/register/", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        navigate("/authentication/login");
      } else {
        alert("Something went wrong!");
      }
    } catch (error) {
      const newError = {};
      const errors = error.response.data;
      setRegisterErrors(errors);
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const refreshToken = async () => {
    try {
      const response = await api.post(
        "token/refresh/",
        { refresh: authTokens.refresh },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem("authTokens", JSON.stringify(data));
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
  };

  const logoutUser = () => {
    setUser(null);
    setAuthTokens(null);
    localStorage.removeItem("authTokens");
    navigate("/authentication/login");
  };

  const contextData = {
    loginUser,
    logoutUser,
    registerUser,
    setUserError,
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
