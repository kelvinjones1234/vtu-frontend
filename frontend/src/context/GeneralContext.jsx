import { createContext, useEffect, react, useState } from "react";
import axios from "axios";

export const GeneralContext = createContext();

const GeneralProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [loading, setLoading] = useState(false);

  const handleThemeSettings = () => {
    setDarkMode((previous) => !previous);
    setTheme(theme == "dark" ? "light" : "dark");
  };

  useEffect(() => {
    theme == "dark"
      ? document.documentElement.classList.add("dark")
      : document.documentElement.classList.remove("dark");
  }, [handleThemeSettings]);
 
  const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const contextData = {
    darkMode: darkMode,
    theme: theme,
    api: api,
    loading: loading,
    setLoading: setLoading,
    setTheme: setTheme,
    setDarkMode: setDarkMode,
    handleThemeSettings: handleThemeSettings,
  };

  return (
    <GeneralContext.Provider value={contextData}>
      {children}
    </GeneralContext.Provider>
  );
};

export default GeneralProvider;
